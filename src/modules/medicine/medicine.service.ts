import { OrderStatus } from "../../../generated/prisma/enums"
import { IQueryParams } from "../../interfaces/query.interface"
import { prisma } from "../../lib/prisma"
import { QueryBuilder } from "../../utils/QueryBuilder"

interface CreateMedicinePayload {
     name: string
     genericName?: string
     description: string
     price: number
     discountPrice?: number
     stock: number
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



const getSellerMedicines = async (sellerId: string, query: IQueryParams = {}) => {
     const qb = new QueryBuilder(prisma.medicine, query, {
          searchableFields: ['name', 'genericName', 'manufacturer'], // search by medicine name
          filterableFields: ['categoryId', 'price', 'stock'], // filters
     });

     return qb
          .where({ sellerId }) // restrict to seller
          .include({ category: true })
          .sort() // default sort
          .paginate()
          .execute();
};

const getAllMedicines = async (query: IQueryParams = {}) => {
     const qb = new QueryBuilder(prisma.medicine, query, {
          searchableFields: ['name', 'genericName', 'manufacturer'],
          filterableFields: ['categoryId'],
     });

     const result = await qb
          .search()
          .filter()
          .where({
               isActive: true,
          })
          .include({
               category: true,
               seller: {
                    select: { id: true, name: true },
               },
          })
          .sort()
          .paginate()
          .execute();

     return result;
};

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