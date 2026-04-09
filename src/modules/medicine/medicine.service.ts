import { OrderStatus } from "../../../generated/prisma/enums"
import { prisma } from "../../lib/prisma"

interface CreateMedicinePayload {
     name: string
     genericName?: string
     description: string
     price: number
     discountPrice?: number
     stock: number
     image?: string
     images?: string[]
     manufacturer?: string
     brand?: string
     dosageForm?: string
     strength?: string
     unit?: string
     categoryId: string
     sku?: string
}

const ACTIVE_ORDER_STATUSES: OrderStatus[] = [
     OrderStatus.PLACED,
     OrderStatus.CONFIRMED,
     OrderStatus.PROCESSING,
     OrderStatus.SHIPPED,
]

const createMedicine = async (sellerId: string, payload: CreateMedicinePayload) => {
     const slug = payload.name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now()
     return prisma.medicine.create({
          data: { ...payload, sellerId, slug }
     })
}

const updateMedicine = async (id: string, sellerId: string, payload: Partial<CreateMedicinePayload>) => {
     const medicine = await prisma.medicine.findFirst({ where: { id, sellerId } })
     if (!medicine) throw new Error("Medicine not found or unauthorized")
     return prisma.medicine.update({ where: { id }, data: payload })
}



const deleteMedicine = async (id: string, sellerId: string) => {

     // 1. Ownership check
     const medicine = await prisma.medicine.findFirst({
          where: { id, sellerId },
          select: { id: true, name: true, isActive: true, stock: true },
     })
     if (!medicine) throw new Error("Medicine not found or unauthorized")

     // 2. Already deleted
     if (!medicine.isActive) throw new Error("Medicine is already inactive")

     // 3. Block if tied to any active (non-terminal) order
     const activeOrderItem = await prisma.orderItem.findFirst({
          where: {
               medicineId: id,
               order: {
                    status: { in: ACTIVE_ORDER_STATUSES },
               },
          },
          select: {
               orderId: true,
               order: {
                    select: { status: true },
               },
          },
     })

     if (activeOrderItem) {
          throw new Error(
               `Cannot delete "${medicine.name}" — it is part of an active order ` +
               `(status: ${activeOrderItem.order.status}). ` +
               `Wait until all orders containing this medicine are delivered or cancelled.`
          )
     }

     // 4. Soft-delete: mark inactive + zero out stock
     return prisma.medicine.update({
          where: { id },
          data: {
               isActive: false,
               stock: 0,
          },
     })
}



const getSellerMedicines = async (sellerId: string) => {
     return prisma.medicine.findMany({
          where: { sellerId },
          include: { category: true },
          orderBy: { createdAt: "desc" }
     })
}

const getAllMedicines = async (query: {
     search?: string
     categoryId?: string
     minPrice?: string
     maxPrice?: string
     page?: string
     limit?: string
}) => {
     const page = parseInt(query.page || "1")
     const limit = parseInt(query.limit || "12")
     const skip = (page - 1) * limit

     const where: any = { isActive: true }
     if (query.search) {
          where.OR = [
               { name: { contains: query.search, mode: "insensitive" } },
               { genericName: { contains: query.search, mode: "insensitive" } },
               { manufacturer: { contains: query.search, mode: "insensitive" } }
          ]
     }
     if (query.categoryId) where.categoryId = query.categoryId
     if (query.minPrice || query.maxPrice) {
          where.price = {}
          if (query.minPrice) where.price.gte = parseFloat(query.minPrice)
          if (query.maxPrice) where.price.lte = parseFloat(query.maxPrice)
     }


     const [data, total] = await Promise.all([
          prisma.medicine.findMany({
               where,
               include: { category: true, seller: { select: { id: true, name: true } } },
               skip,
               take: limit,
               orderBy: { createdAt: "desc" }
          }),
          prisma.medicine.count({ where })
     ])

     return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } }
}

const getMedicineById = async (id: string) => {
     const medicine = await prisma.medicine.findFirst({
          where: { id, isActive: true },
          include: {
               category: true,
               seller: { select: { id: true, name: true, phone: true } },
               reviews: {
                    include: { user: { select: { id: true, name: true, image: true } } },
                    orderBy: { createdAt: "desc" },
                    take: 10
               },
               batches: { where: { isActive: true }, orderBy: { expiryDate: "asc" } }
          }
     })
     if (!medicine) throw new Error("Medicine not found")
     return medicine
}

export const medicineService = {
     createMedicine,
     updateMedicine,
     deleteMedicine,
     getSellerMedicines,
     getAllMedicines,
     getMedicineById
}