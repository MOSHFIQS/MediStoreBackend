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
     requiresPrescription?: boolean
     categoryId: string
     sku?: string
}

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
     const medicine = await prisma.medicine.findFirst({ where: { id, sellerId } })
     if (!medicine) throw new Error("Medicine not found or unauthorized")
     return prisma.medicine.update({ where: { id }, data: { isActive: false } })
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
     requiresPrescription?: string
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
     if (query.requiresPrescription !== undefined) {
          where.requiresPrescription = query.requiresPrescription === "true"
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