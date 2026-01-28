import { prisma } from "../../lib/prisma"



const createCategory = async (payload: { name: string }) => {
     const { name } = payload

  
     const existing = await prisma.category.findFirst({
          where: { name: { equals: name, mode: "insensitive" } }
     })

     if (existing) {
          throw new Error("Category already exists")
     }

     const category = await prisma.category.create({
          data: { name }
     })

     return category
}



const getAllCategories = async () => {
     const categories = await prisma.category.findMany({
          orderBy: { name: "asc" },
          include: {
               _count: {
                    select: { medicines: true } 
               }
          }
     })

     return categories
}

export const categoryService = {
     createCategory,
     getAllCategories
}
