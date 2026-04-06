import { prisma } from "../../lib/prisma"


const createCategory = async (payload: { name: string; description?: string; image?: string }) => {
     const { name, description, image } = payload;

     // Check if category already exists (case-insensitive)
     const existing = await prisma.category.findFirst({
          where: { name: { equals: name, mode: "insensitive" } }
     });

     if (existing) {
          throw new Error("Category already exists");
     }

     // Create category
     const category = await prisma.category.create({
          data: {
               name,
               description,
               image,
          }
     });

     return category;
};

export default createCategory;


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


// Update category
const updateCategory = async (id: string, payload: { name?: string; description?: string; image?: string }) => {
     // Check if category exists
     const existing = await prisma.category.findUnique({ where: { id } });
     if (!existing) throw new Error("Category not found");

     // Optional: check for name uniqueness if updating
     if (payload.name) {
          const nameExists = await prisma.category.findFirst({
               where: { name: { equals: payload.name, mode: "insensitive" }, NOT: { id } }
          });
          if (nameExists) throw new Error("Category name already exists");
     }

     return prisma.category.update({
          where: { id },
          data: payload
     });
};

// Delete category
const deleteCategory = async (id: string) => {
     const existing = await prisma.category.findUnique({ where: { id } });
     if (!existing) throw new Error("Category not found");

     return prisma.category.delete({ where: { id } });
};


const getCategoryById = async (id: string) => {
     const category = await prisma.category.findUnique({
          where: { id },
     });

     if (!category) {
          throw new Error("Category not found");
     }

     return category;
};


export const categoryService = {
     createCategory,
     getAllCategories,
     updateCategory,
     deleteCategory,
     getCategoryById
}
