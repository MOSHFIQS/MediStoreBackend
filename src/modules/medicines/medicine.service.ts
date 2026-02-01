import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

interface createMedicinePayload {
     name: string;
     price: number;
     stock: number;
     categoryId: string;
     sellerId: string;
     description: string;
}

const createMedicine = async (userId: string, payload: createMedicinePayload) => {
     try {
          const category = await prisma.category.findUnique({
               where: { id: payload.categoryId }
          });

          if (!category) {
               throw new Error("This category does not exist");
          }

          return await prisma.medicine.create({
               data: { ...payload, sellerId: userId }
          });
     } catch (err: any) {
          console.error("Create medicine error:", err);
          throw new Error(err.message || "Failed to create medicine");
     }
};

const updateMedicine = async (userId: string, id: string, payload: any) => {
     try {
          return await prisma.medicine.update({
               where: { id, sellerId: userId },
               data: payload
          });
     } catch (err: any) {
          console.error("Update medicine error:", err);
          throw new Error(err.message || "Failed to update medicine");
     }
};

const deleteMedicine = async (userId: string, id: string) => {
     try {
          const orderItemCount = await prisma.orderItem.count({
               where: { medicineId: id }
          });

          if (orderItemCount > 0) {
               throw new Error("Cannot delete medicine: it has associated orders");
          }

          return await prisma.medicine.delete({
               where: { id, sellerId: userId }
          });
     } catch (err: any) {
          console.error("Delete medicine error:", err);
          throw new Error(err.message || "Failed to delete medicine");
     }
};

const getSellerMedicines = async (sellerId: string) => {
     try {
          return await prisma.medicine.findMany({
               where: { sellerId },
               include: { category: true },
               orderBy: { createdAt: "desc" }
          });
     } catch (err: any) {
          console.error("Get seller medicines error:", err);
          throw new Error(err.message || "Failed to fetch seller medicines");
     }
};

const getAllMedicines = async (query: any) => {
     try {
          const { categoryId, search } = query;
          const where: Prisma.MedicineWhereInput = {};

          if (categoryId) where.categoryId = String(categoryId);
          if (search) {
               where.name = { contains: String(search), mode: "insensitive" };
          }

          return await prisma.medicine.findMany({
               where,
               include: {
                    category: true,
                    seller: { select: { id: true, name: true } }
               }
          });
     } catch (err: any) {
          console.error("Get all medicines error:", err);
          throw new Error(err.message || "Failed to fetch medicines");
     }
};

const getMedicineById = async (id: string) => {
     try {
          return await prisma.medicine.findUnique({
               where: { id },
               include: {
                    category: true,
                    seller: { select: { id: true, name: true } }
               }
          });
     } catch (err: any) {
          console.error("Get medicine by id error:", err);
          throw new Error(err.message || "Failed to fetch medicine");
     }
};

export const medicineService = {
     createMedicine,
     updateMedicine,
     deleteMedicine,
     getSellerMedicines,
     getAllMedicines,
     getMedicineById
};
