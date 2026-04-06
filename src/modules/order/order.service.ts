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

     // 2. Fetch medicines
     const medicineIds = items.map(i => i.medicineId);
     const medicines = await prisma.medicine.findMany({
          where: { id: { in: medicineIds }, isActive: true }
     });

     if (medicines.length !== items.length) {
          throw new Error("One or more medicines not found or inactive");
     }

     // 3. Validate stock
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

     // 5. Coupon validation
     let couponId: string | undefined;
     let couponDiscount = 0;

     if (couponCode) {
          const coupon = await prisma.coupon.findFirst({
               where: {
                    code: couponCode,
                    isActive: true,
                    OR: [
                         { expiresAt: null },
                         { expiresAt: { gt: new Date() } },
                    ],
               },
          });

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
                    ? Math.min((subtotal * coupon.discountValue) / 100, coupon.maxDiscount ?? Infinity)
                    : coupon.discountValue;
     }

     const tax = 0;
     let totalPrice = subtotal + shippingFee + tax - couponDiscount;
     if (totalPrice < 0) totalPrice = 0;

     // 6. Transaction
     const order = await prisma.$transaction(async (tx) => {

          // Re-check stock inside transaction (race condition safety)
          for (const item of items) {
               const med = await tx.medicine.findUnique({
                    where: { id: item.medicineId },
                    select: { stock: true, name: true },
               });

               if (!med || med.stock < item.quantity) {
                    throw new Error(`Stock changed for ${med?.name || "item"}`);
               }
          }

          // 7. Create order
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

          // 8. Deduct stock (safe — gte prevents oversell)
          for (const item of items) {
               await tx.medicine.update({
                    where: {
                         id: item.medicineId,
                         stock: { gte: item.quantity },
                    },
                    data: {
                         stock: { decrement: item.quantity },
                    },
               });
          }

          // 9. Coupon usage increment
          if (couponId) {
               await tx.coupon.update({
                    where: { id: couponId },
                    data: { usedCount: { increment: 1 } },
               });
          }

          // 10. Create payment record
          await tx.payment.create({
               data: {
                    orderId: newOrder.id,
                    amount: totalPrice,
                    status: "PENDING",
                    initiatedAt: new Date(),
               },
          });

          // 11. Audit log
          await tx.auditLog.create({
               data: {
                    userId: customerId,
                    action: "ORDER_CREATED",
                    entity: "Order",
                    entityId: newOrder.id,
                    newValue: { totalPrice },
                    ipAddress: ip,
               },
          });

          // 12. Notification
          await tx.notification.create({
               data: {
                    userId: customerId,
                    type: "ORDER_UPDATE",
                    title: "Order Placed",
                    message: `Your order #${newOrder.id.slice(0, 8)} has been placed successfully`,
                    meta: { orderId: newOrder.id },
               },
          });

          return newOrder;
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
     const order = await prisma.order.findFirst({
          where: { id: orderId, items: { some: { medicine: { sellerId } } } },
     });
     if (!order) throw new Error("Order not found or unauthorized");

     const allowed = ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];
     if (!allowed.includes(newStatus)) throw new Error("Invalid status transition");

     return prisma.order.update({
          where: { id: orderId },
          data: { status: newStatus as any },
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