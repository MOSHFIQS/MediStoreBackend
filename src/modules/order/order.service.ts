import { prisma } from "../../lib/prisma"

interface OrderItemInput {
     medicineId: string
     quantity: number
}

interface CreateOrderPayload {
     items: OrderItemInput[]
     addressId?: string
     addressSnapshot?: object
     couponCode?: string
     notes?: string
     shippingFee?: number
}

const createOrder = async (customerId: string, payload: CreateOrderPayload, ip?: string) => {
     const {
          items,
          addressId,
          addressSnapshot,
          couponCode,
          notes,
          shippingFee = 0,
     } = payload;

     // 1. Basic validations
     if (!items || items.length === 0) {
          throw new Error("Order must contain at least one item");
     }

     const uniqueIds = new Set(items.map(i => i.medicineId));
     if (uniqueIds.size !== items.length) {
          throw new Error("Duplicate medicines in order are not allowed");
     }

     if (!addressId && !addressSnapshot) {
          throw new Error("Shipping address is required");
     }

     if (shippingFee < 0) {
          throw new Error("Invalid shipping fee");
     }

     // 2. Fetch medicines + coupon in parallel (before transaction)
     const medicineIds = items.map(i => i.medicineId);

     const [medicines, couponRaw] = await Promise.all([
          prisma.medicine.findMany({
               where: { id: { in: medicineIds }, isActive: true },
          }),
          couponCode
               ? prisma.coupon.findFirst({
                    where: {
                         code: couponCode,
                         isActive: true,
                         OR: [
                              { expiresAt: null },
                              { expiresAt: { gt: new Date() } },
                         ],
                    },
               })
               : null,
     ]);

     if (medicines.length !== items.length) {
          throw new Error("One or more medicines not found or inactive");
     }

     // 3. Validate stock + quantity
     for (const item of items) {
          if (item.quantity <= 0) throw new Error("Invalid quantity");

          const med = medicines.find(m => m.id === item.medicineId)!;
          if (med.stock < item.quantity) {
               throw new Error(`Insufficient stock for ${med.name}`);
          }
     }

     // 4. Calculate pricing (server-trusted)
     let subtotal = 0;

     const orderItemsData = items.map(item => {
          const med = medicines.find(m => m.id === item.medicineId)!;
          const unitPrice = med.discountPrice ?? med.price;
          const totalPrice = unitPrice * item.quantity;
          subtotal += totalPrice;

          return {
               medicineId: item.medicineId,
               medicineName: med.name,
               medicineImage: med.image,
               quantity: item.quantity,
               unitPrice,
               totalPrice,
          };
     });

     // 5. Coupon validation (outside transaction — already fetched)
     let couponId: string | undefined;
     let couponDiscount = 0;

     if (couponCode) {
          const coupon = couponRaw;
          if (!coupon) throw new Error("Invalid or expired coupon");

          if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
               throw new Error("Coupon usage limit reached");
          }

          if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
               throw new Error(`Minimum order amount is ৳${coupon.minOrderAmount}`);
          }

          couponId = coupon.id;
          couponDiscount =
               coupon.discountType === "PERCENTAGE"
                    ? Math.min(
                         (subtotal * coupon.discountValue) / 100,
                         coupon.maxDiscount ?? Infinity,
                    )
                    : coupon.discountValue;
     }

     const tax = 0;
     let totalPrice = subtotal + shippingFee + tax - couponDiscount;
     if (totalPrice < 0) totalPrice = 0;

     // 6. Transaction — only truly atomic operations go here
     //    Timeout raised to 15s; operations parallelized where safe
     const order = await prisma.$transaction(
          async (tx) => {
               // Re-check stock in parallel (race condition safety)
               const stockChecks = await Promise.all(
                    items.map(item =>
                         tx.medicine.findUnique({
                              where: { id: item.medicineId },
                              select: { stock: true, name: true },
                         }),
                    ),
               );

               for (let i = 0; i < items.length; i++) {
                    const med = stockChecks[i];
                    if (!med || med.stock < items[i].quantity) {
                         throw new Error(`Stock changed for ${med?.name || "item"}`);
                    }
               }

               // Create order
               const newOrder = await tx.order.create({
                    data: {
                         customerId,
                         ...(addressId !== undefined && { addressId: addressId ?? null }),
                         ...(addressSnapshot !== undefined && { addressSnapshot: addressSnapshot as any }),
                         ...(couponId !== undefined && { couponId: couponId ?? null }),
                         ...(notes !== undefined && { notes: notes ?? null }),
                         couponDiscount,
                         subtotal,
                         shippingFee,
                         tax,
                         totalPrice,
                         items: { create: orderItemsData },
                    },
                    include: { items: true },
               });

               // Deduct stock + increment coupon usage + create payment — all in parallel
               await Promise.all([
                    ...items.map(item =>
                         tx.medicine.update({
                              where: {
                                   id: item.medicineId,
                                   stock: { gte: item.quantity }, // prevents oversell
                              },
                              data: { stock: { decrement: item.quantity } },
                         }),
                    ),
                    couponId
                         ? tx.coupon.update({
                              where: { id: couponId },
                              data: { usedCount: { increment: 1 } },
                         })
                         : Promise.resolve(),
                    tx.payment.create({
                         data: {
                              orderId: newOrder.id,
                              amount: totalPrice,
                              status: "PENDING",
                              initiatedAt: new Date(),
                         },
                    }),
               ]);

               return newOrder;
          },
          {
               maxWait: 5000,  // wait up to 5s to acquire a connection
               timeout: 15000, // allow up to 15s for the transaction to complete
          },
     );

     // 7. Non-critical side effects — outside transaction (fire-and-forget safe)
     //    These don't affect order integrity, so no need to block or roll back for them
     await Promise.all([
          prisma.auditLog.create({
               data: {
                    userId: customerId,
                    action: "ORDER_CREATED",
                    entity: "Order",
                    entityId: order.id,
                    newValue: { totalPrice },
                    ipAddress: ip,
               },
          }),
          prisma.notification.create({
               data: {
                    userId: customerId,
                    type: "ORDER_UPDATE",
                    title: "Order Placed",
                    message: `Your order #${order.id.slice(0, 8)} has been placed successfully`,
                    meta: { orderId: order.id },
               },
          }),
     ]).catch(err => {
          // Log but don't throw — order is already committed
          console.error("Post-order side effects failed:", err);
     });

     return order;
};

const getMyOrders = async (customerId: string) => {
     return prisma.order.findMany({
          where: { customerId },
          include: {
               items: true,
               payment: { select: { status: true, method: true, paidAt: true } },
          },
          orderBy: { createdAt: "desc" },
     });
};

const getOrderById = async (id: string, customerId: string) => {
     const order = await prisma.order.findFirst({
          where: { id, customerId },
          include: {
               items: { include: { medicine: { select: { id: true, name: true, image: true } } } },
               address: true,
               payment: true,
               coupon: true,
          },
     });
     if (!order) throw new Error("Order not found");
     return order;
};

const cancelOrder = async (id: string, customerId: string, ip?: string) => {
     return prisma.$transaction(async (tx) => {

          const order = await tx.order.findFirst({
               where: { id, customerId },
               include: { payment: true },
          });

          if (!order) throw new Error("Order not found");
          if (order.status === "CANCELLED") throw new Error("Order already cancelled");
          if (order.status !== "PLACED") throw new Error("Order cannot be cancelled at this stage");

          if (order.payment) {
               const { status: paymentStatus } = order.payment;
               if (paymentStatus === "SUCCESS") throw new Error("Paid order cannot be cancelled. Request a refund.");
               if (paymentStatus === "REFUNDED") throw new Error("Order already refunded");
          }

          const updatedOrder = await tx.order.update({
               where: { id, status: "PLACED" },
               data: { status: "CANCELLED" },
          });

          const orderItems = await tx.orderItem.findMany({ where: { orderId: id } });
          for (const item of orderItems) {
               await tx.medicine.update({
                    where: { id: item.medicineId },
                    data: { stock: { increment: item.quantity } },
               });
          }

          if (order.payment && order.payment.status !== "SUCCESS") {
               await tx.payment.update({
                    where: { id: order.payment.id },
                    data: { status: "CANCELLED", failedAt: new Date() },
               });

               await tx.paymentLog.create({
                    data: {
                         paymentId: order.payment.id,
                         event: "CANCELLED",
                         status: "CANCELLED",
                         note: "Order cancelled before payment completion",
                         ipAddress: ip,
                    },
               });
          }

          await tx.auditLog.create({
               data: {
                    userId: customerId,
                    action: "ORDER_CANCELLED",
                    entity: "Order",
                    entityId: id,
                    oldValue: { status: order.status },
                    newValue: { status: "CANCELLED" },
                    ipAddress: ip,
               },
          });

          await tx.notification.create({
               data: {
                    userId: customerId,
                    type: "ORDER_UPDATE",
                    title: "Order Cancelled",
                    message: `Your order #${id.slice(0, 8)} has been cancelled`,
                    meta: { orderId: id },
               },
          });

          return updatedOrder;
     });
};

const getSellerOrders = async (sellerId: string) => {
     return prisma.order.findMany({
          where: { items: { some: { medicine: { sellerId } } } },
          include: {
               items: { where: { medicine: { sellerId } }, include: { medicine: true } },
               customer: { select: { id: true, name: true, email: true, phone: true } },
               address: true,
               payment: { select: { status: true, method: true } },
          },
          orderBy: { createdAt: "desc" },
     });
};

const updateOrderStatus = async (orderId: string, sellerId: string, newStatus: string) => {

     // Valid next transitions per status
     const validTransitions: Record<string, string[]> = {
          PLACED: ["CONFIRMED", "CANCELLED"],
          CONFIRMED: ["PROCESSING", "CANCELLED"],
          PROCESSING: ["SHIPPED", "CANCELLED"],
          SHIPPED: ["DELIVERED"],
          DELIVERED: [],
          CANCELLED: [],
     };

     const cancellableStatuses = ["PLACED", "CONFIRMED", "PROCESSING"];

     const notificationMessages: Record<string, { title: string; message: string }> = {
          CONFIRMED: {
               title: "Order Confirmed",
               message: `Your order #${orderId.slice(0, 8).toUpperCase()} has been confirmed by the seller.`,
          },
          PROCESSING: {
               title: "Order Processing",
               message: `Your order #${orderId.slice(0, 8).toUpperCase()} is now being processed.`,
          },
          SHIPPED: {
               title: "Order Shipped",
               message: `Your order #${orderId.slice(0, 8).toUpperCase()} has been shipped and is on its way!`,
          },
          DELIVERED: {
               title: "Order Delivered",
               message: `Your order #${orderId.slice(0, 8).toUpperCase()} has been delivered. Enjoy!`,
          },
          CANCELLED: {
               title: "Order Cancelled",
               message: `Your order #${orderId.slice(0, 8).toUpperCase()} has been cancelled by the seller.`,
          },
     };

     return prisma.$transaction(async (tx) => {

          // 1. Fetch order with payment and items
          const order = await tx.order.findFirst({
               where: { id: orderId, items: { some: { medicine: { sellerId } } } },
               include: {
                    payment: true,
                    items: true,
               },
          });

          if (!order) throw new Error("Order not found or unauthorized");

          // 2. Check transition is valid
          const allowedNext = validTransitions[order.status] ?? [];
          if (!allowedNext.includes(newStatus)) {
               throw new Error(`Cannot move order from ${order.status} to ${newStatus}`);
          }

          // 3. Extra rules for CANCELLED
          if (newStatus === "CANCELLED") {
               if (!cancellableStatuses.includes(order.status)) {
                    throw new Error(
                         `Order cannot be cancelled once it has been ${order.status.toLowerCase()}`
                    );
               }

               // Block cancellation if customer already paid
               if (order.payment?.status === "SUCCESS") {
                    throw new Error("Cannot cancel a paid order. Issue a refund instead.");
               }
          }

          // 4. Build all parallel writes
          const writes: Promise<any>[] = [

               // Always — update order status
               tx.order.update({
                    where: { id: orderId },
                    data: { status: newStatus as any },
               }),

               // Always — audit log
               tx.auditLog.create({
                    data: {
                         userId: sellerId,
                         action: "ORDER_STATUS_UPDATED",
                         entity: "Order",
                         entityId: orderId,
                         oldValue: { status: order.status },
                         newValue: { status: newStatus },
                    },
               }),

               // Always — notify customer if message exists for this status
               ...(notificationMessages[newStatus]
                    ? [
                         tx.notification.create({
                              data: {
                                   userId: order.customerId,
                                   type: "ORDER_UPDATE",
                                   title: notificationMessages[newStatus].title,
                                   message: notificationMessages[newStatus].message,
                                   meta: { orderId },
                              },
                         }),
                    ]
                    : []
               ),

               // If CANCELLED — restore stock for all items in parallel
               ...(newStatus === "CANCELLED"
                    ? order.items.map((item) =>
                         tx.medicine.update({
                              where: { id: item.medicineId },
                              data: { stock: { increment: item.quantity } },
                         })
                    )
                    : []
               ),

               // If CANCELLED and payment not already succeeded — cancel payment record
               ...(newStatus === "CANCELLED" &&
                    order.payment &&
                    order.payment.status !== "SUCCESS"
                    ? [
                         tx.payment.update({
                              where: { id: order.payment.id },
                              data: { status: "CANCELLED", failedAt: new Date() },
                         }),
                         tx.paymentLog.create({
                              data: {
                                   paymentId: order.payment.id,
                                   event: "CANCELLED",
                                   status: "CANCELLED",
                                   note: "Order cancelled by seller",
                              },
                         }),
                    ]
                    : []
               ),
          ];

          // 5. Run all writes in parallel
          const [updatedOrder] = await Promise.all(writes);

          return updatedOrder;

     }, {
          maxWait: 10000,  // wait up to 10s for a transaction slot
          timeout: 30000,  // transaction must complete within 30s
     });
};


export const orderService = {
     createOrder,
     getMyOrders,
     getOrderById,
     cancelOrder,
     getSellerOrders,
     updateOrderStatus,
};