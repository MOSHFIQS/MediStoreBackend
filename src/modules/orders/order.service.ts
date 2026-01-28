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

     return prisma.$transaction(async (tx) => {
        
          const medicines = await tx.medicine.findMany({
               where: { id: { in: medicineIds } }
          })

          if (medicines.length !== items.length) {
               throw new Error("Some medicines not found")
          }

          let totalPrice = 0

          const orderItemsData = []

          for (const item of items) {

               const medicine = medicines.find(m => m.id === item.medicineId)!

        
               if (medicine.stock < item.quantity) {
                    throw new Error(`${medicine.name} out of stock`)
               }

               totalPrice += medicine.price * item.quantity

               orderItemsData.push({
                    medicineId: medicine.id,
                    quantity: item.quantity,
                    price: medicine.price
               })

         
               await tx.medicine.update({
                    where: { id: medicine.id },
                    data: {
                         stock: {
                              decrement: item.quantity
                         }
                    }
               })
          }

  
          const order = await tx.order.create({
               data: {
                    customerId: userId,
                    address,
                    totalPrice,
                    items: {
                         create: orderItemsData
                    }
               },
               include: {
                    items: { include: { medicine: true } }
               }
          })

          return order
     })
}



const cancelOrder = async (userId: string, orderId: string) => {
     return prisma.$transaction(async (tx) => {

          const order = await tx.order.findFirst({
               where: { id: orderId, customerId: userId },
               include: { items: true }
          })

          if (!order) throw new Error("Order not found")

          if (!["PLACED", "PROCESSING"].includes(order.status)) {
               throw new Error("Order cannot be cancelled at this stage")
          }

          for (const item of order.items) {
               await tx.medicine.update({
                    where: { id: item.medicineId },
                    data: {
                         stock: {
                              increment: item.quantity   
                         }
                    }
               })
          }

          const updatedOrder = await tx.order.update({
               where: { id: orderId },
               data: { status: "CANCELLED" },
               include: {
                    items: { include: { medicine: true } }
               }
          })

          return updatedOrder
     })
}




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
