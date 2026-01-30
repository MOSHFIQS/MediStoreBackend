import { OrderStatus } from "../../../generated/prisma/enums"
import { prisma } from "../../lib/prisma"

interface CreateOrderPayload {
     address: string
     items: {
          medicineId: string
          quantity: number
     }[]
}

const createOrder = async (userId: string, payload: CreateOrderPayload) => {
     const { items, address } = payload

     if (!address) throw new Error("Delivery address required")
     if (!items || items.length === 0) throw new Error("Order items required")

     const medicineIds = items.map(i => i.medicineId)

     // ✅ STEP 1: READ OUTSIDE TRANSACTION (VERY IMPORTANT)
     const medicines = await prisma.medicine.findMany({
          where: { id: { in: medicineIds } },
     })

     if (medicines.length !== items.length) {
          throw new Error("Some medicines not found")
     }

     // ✅ STEP 2: SHORT TRANSACTION — ONLY WRITES
     return prisma.$transaction(async (tx) => {
          let totalPrice = 0
          const orderItemsData = []

          for (const item of items) {
               const medicine = medicines.find(m => m.id === item.medicineId)!

               // 🔒 Atomic stock check + decrement (prevents overselling)
               const updated = await tx.medicine.updateMany({
                    where: {
                         id: medicine.id,
                         stock: { gte: item.quantity },
                    },
                    data: {
                         stock: { decrement: item.quantity },
                    },
               })

               if (updated.count === 0) {
                    throw new Error(`${medicine.name} out of stock`)
               }

               totalPrice += medicine.price * item.quantity

               orderItemsData.push({
                    medicineId: medicine.id,
                    quantity: item.quantity,
                    price: medicine.price,
               })
          }

          // 🧾 Create order AFTER stock is secured
          return tx.order.create({
               data: {
                    customerId: userId,
                    address,
                    totalPrice,
                    items: {
                         create: orderItemsData,
                    },
               },
               include: {
                    items: { include: { medicine: true } },
               },
          })
     },
          {
               timeout: 15000, // ⏱ prevents early transaction timeout
          })
}

export default createOrder




const cancelOrder = async (userId: string, orderId: string) => {
     // Step 1: Read order OUTSIDE the transaction (fast)
     const order = await prisma.order.findFirst({
          where: { id: orderId, customerId: userId },
          include: { items: true },
     });

     if (!order) throw new Error("Order not found");
     if (!["PLACED", "PROCESSING"].includes(order.status)) {
          throw new Error("Order cannot be cancelled at this stage");
     }

     // Step 2: Collect medicineId + quantity mapping
     const stockUpdates = order.items.map(item => ({
          id: item.medicineId,
          quantity: item.quantity,
     }));

     // Step 3: Short transaction — batch updates + order status
     return prisma.$transaction(async (tx) => {
          // Batch update medicines stock using updateMany
          for (const update of stockUpdates) {
               await tx.medicine.update({
                    where: { id: update.id },
                    data: { stock: { increment: update.quantity } },
               });
          }

          // Update order status
          const updatedOrder = await tx.order.update({
               where: { id: orderId },
               data: { status: "CANCELLED" },
               include: { items: { include: { medicine: true } } },
          });

          return updatedOrder;
     }, { timeout: 15000 }); // optional timeout
};





const getMyOrders = async (userId: string) => {
     return prisma.order.findMany({
          where: { customerId: userId },
          orderBy: { createdAt: "desc" },
          include: {
               items: {
                    include: { medicine: true }
               }
          }
     })
}


const getOrderById = async (userId: string, orderId: string) => {
     const order = await prisma.order.findFirst({
          where: {
               id: orderId,
               customerId: userId
          },
          include: {
               items: {
                    include: { medicine: true }
               }
          }
     })

     if (!order) throw new Error("Order not found")

     return order
}


const getSellerOrders = async (sellerId: string) => {
     return prisma.order.findMany({
          where: {
               items: {
                    some: {
                         medicine: {
                              sellerId: sellerId
                         }
                    }
               }
          },
          orderBy: { createdAt: "desc" },
          include: {
               customer: {
                    select: { id: true, name: true, phone: true }
               },
               items: {
                    include: {
                         medicine: {
                              select: { id: true, name: true, price: true }
                         }
                    }
               }
          }
     })
}


const updateOrderStatus = async (
     sellerId: string,
     orderId: string,
     status: OrderStatus
) => {
     const order = await prisma.order.findFirst({
          where: {
               id: orderId,
               items: {
                    some: {
                         medicine: { sellerId }
                    }
               }
          }
     })

     if (!order) throw new Error("Order not found or not yours")

     return prisma.order.update({
          where: { id: orderId },
          data: { status }
     })
}



export const orderService = {
     createOrder,
     cancelOrder,
     getMyOrders,
     getOrderById,
     getSellerOrders,
     updateOrderStatus
}
