import { prisma } from "../../lib/prisma"

const createReview = async (userId: string, payload: { medicineId: string; rating: number; title?: string; comment: string }) => {
     // Check if user purchased this medicine
     const purchased = await prisma.orderItem.findFirst({
          where: {
               medicineId: payload.medicineId,
               order: { customerId: userId, status: "DELIVERED" }
          }
     })

     const existing = await prisma.review.findFirst({ where: { userId, medicineId: payload.medicineId } })
     if (existing) throw new Error("You have already reviewed this medicine")

     return prisma.review.create({
          data: { ...payload, userId, isVerifiedPurchase: !!purchased }
     })
}

const getMedicineReviews = async (medicineId: string) => {
     return prisma.review.findMany({
          where: { medicineId },
          include: { user: { select: { id: true, name: true, image: true } } },
          orderBy: { createdAt: "desc" }
     })
}

const deleteReview = async (id: string, userId: string) => {
     const review = await prisma.review.findFirst({ where: { id, userId } })
     if (!review) throw new Error("Review not found")
     return prisma.review.delete({ where: { id } })
}

export const reviewService = { createReview, getMedicineReviews, deleteReview }