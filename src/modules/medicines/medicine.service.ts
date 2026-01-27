import { Prisma } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"


interface createMadecine {
     name: string
     price: number
     stock: number
     categoryId: string
     sellerId: string
     description: string
}

const createMedicine = async (userId: string, payload: createMadecine) => {
     const categories = await prisma.category.findUnique({
          where: {
               id: payload.categoryId
          }
     })
     if (!categories) {
          throw new Error("this category  does not exists")
     }


     return prisma.medicine.create({
          data: {
               ...payload,
               sellerId: userId
          }
     })
}

const updateMedicine = async (userId: string, id: string, payload: any) => {
     return prisma.medicine.update({
          where: { id, sellerId: userId }, // seller can edit only his own medicine
          data: payload
     })
}



const deleteMedicine = async (userId: string, id: string) => {
     return prisma.medicine.delete({
          where: { id, sellerId: userId }
     })
}







const getAllMedicines = async (query: any) => {
     const { category, search } = query

     const where: Prisma.MedicineWhereInput = {}

     // Category filter
     if (category) {
          where.categoryId = String(category)
     }

     // Search filter
     if (search) {
          where.name = {
               contains: String(search),
               mode: "insensitive"
          }
     }

     const medicines = await prisma.medicine.findMany({
          where,
          include: {
               category: true,
               seller: { select: { id: true, name: true } }
          }
     })

     return medicines
}

const getMedicineById = async (id: string) => {
     const medicine = await prisma.medicine.findUnique({
          where: { id },
          include: {
               category: true,
               seller: { select: { id: true, name: true } }
          }
     })

     return medicine
}

export const medicineService = {
     createMedicine,
     updateMedicine,
     deleteMedicine,
     getAllMedicines,
     getMedicineById
}
