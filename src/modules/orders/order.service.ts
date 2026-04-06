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

const createOrder = async (customerId: string, payload: CreateOrderPayload) => {
     const { items, addressId, addressSnapshot, couponCode, notes, shippingFee = 0 } = payload

     // Fetch all medicines
     const medicineIds = items.map(i => i.medicineId)
     const medicines = await prisma.medicine.findMany({
          where: { id: { in: medicineIds }, isActive: true }
     })

     if (medicines.length !== items.length) throw new Error("One or more medicines not found")

     // Check stock and build order items
     for (const item of items) {
          const med = medicines.find(m => m.id === item.medicineId)!
          if (med.stock < item.quantity) throw new Error(`Insufficient stock for ${med.name}`)
          if (med.requiresPrescription) throw new Error(`${med.name} requires a prescription`)
     }

     // Calculate subtotal
     let subtotal = 0
     const orderItemsData = items.map(item => {
          const med = medicines.find(m => m.id === item.medicineId)!
          const unitPrice = med.discountPrice ?? med.price
          const totalPrice = unitPrice * item.quantity
          subtotal += totalPrice
          return {
               medicineId: item.medicineId,
               medicineName: med.name,
               medicineImage: med.image,
               quantity: item.quantity,
               unitPrice,
               totalPrice
          }
     })

     // Coupon
     let couponId: string | undefined
     let couponDiscount = 0
     if (couponCode) {
          const coupon = await prisma.coupon.findFirst({
               where: {
                    code: couponCode,
                    isActive: true,
                    OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
                    OR: [{ usageLimit: null }, { usageLimit: { gt: prisma.coupon.fields.usedCount } }] as any
               }
          })
          if (!coupon) throw new Error("Invalid or expired coupon")
          if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount)
               throw new Error(`Minimum order amount is ${coupon.minOrderAmount}`)

          couponId = coupon.id
          couponDiscount = coupon.discountType === "PERCENTAGE"
               ? Math.min((subtotal * coupon.discountValue) / 100, coupon.maxDiscount ?? Infinity)
               : coupon.discountValue
     }

     const tax = 0 // add tax logic if needed
     const totalPrice = subtotal + shippingFee + tax - couponDiscount

     // Create order + deduct stock in a transaction
     const order = await prisma.$transaction(async (tx) => {
          const newOrder = await tx.order.create({
               data: {
                    customerId,
                    addressId,
                    addressSnapshot: addressSnapshot as any,
                    couponId,
                    couponDiscount,
                    subtotal,
                    shippingFee,
                    tax,
                    totalPrice,
                    notes,
                    items: { create: orderItemsData }
               },
               include: { items: true }
          })

          // Deduct stock
          for (const item of items) {
               await tx.medicine.update({
                    where: { id: item.medicineId },
                    data: { stock: { decrement: item.quantity } }
               })
          }

          // Increment coupon usage
          if (couponId) {
               await tx.coupon.update({ where: { id: couponId }, data: { usedCount: { increment: 1 } } })
          }

          // Create payment record
          await tx.payment.create({
               data: { orderId: newOrder.id, amount: totalPrice, status: "PENDING" }
          })

          return newOrder
     })

     return order
}

const getMyOrders = async (customerId: string) => {
     return prisma.order.findMany({
          where: { customerId },
          include: {
               items: true,
               payment: { select: { status: true, method: true, paidAt: true } }
          },
          orderBy: { createdAt: "desc" }
     })
}

const getOrderById = async (id: string, customerId: string) => {
     const order = await prisma.order.findFirst({
          where: { id, customerId },
          include: {
               items: { include: { medicine: { select: { id: true, name: true, image: true } } } },
               address: true,
               payment: true,
               coupon: true
          }
     })
     if (!order) throw new Error("Order not found")
     return order
}

const cancelOrder = async (id: string, customerId: string) => {
     const order = await prisma.order.findFirst({ where: { id, customerId } })
     if (!order) throw new Error("Order not found")
     if (!["PLACED", "CONFIRMED"].includes(order.status)) throw new Error("Order cannot be cancelled at this stage")

     return prisma.$transaction(async (tx) => {
          const updated = await tx.order.update({
               where: { id },
               data: { status: "CANCELLED" }
          })
          // Restore stock
          const items = await tx.orderItem.findMany({ where: { orderId: id } })
          for (const item of items) {
               await tx.medicine.update({
                    where: { id: item.medicineId },
                    data: { stock: { increment: item.quantity } }
               })
          }
          return updated
     })
}

const getSellerOrders = async (sellerId: string) => {
     return prisma.order.findMany({
          where: { items: { some: { medicine: { sellerId } } } },
          include: {
               items: { where: { medicine: { sellerId } }, include: { medicine: true } },
               customer: { select: { id: true, name: true, email: true, phone: true } },
               address: true,
               payment: { select: { status: true, method: true } }
          },
          orderBy: { createdAt: "desc" }
     })
}

const updateOrderStatus = async (orderId: string, sellerId: string, newStatus: string) => {
     // Verify seller owns at least one item in this order
     const order = await prisma.order.findFirst({
          where: { id: orderId, items: { some: { medicine: { sellerId } } } }
     })
     if (!order) throw new Error("Order not found or unauthorized")

     const allowed = ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"]
     if (!allowed.includes(newStatus)) throw new Error("Invalid status transition")

     return prisma.order.update({ where: { id: orderId }, data: { status: newStatus as any } })
}

export const orderService = {
     createOrder, getMyOrders, getOrderById,
     cancelOrder, getSellerOrders, updateOrderStatus
}