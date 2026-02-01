import { prisma } from "../../lib/prisma";

export const reviewService = {
     createReview: async ({
          userId,
          medicineId,
          rating,
          comment,
     }: {
          userId: string;
          medicineId: string;
          rating: number;
          comment: string;
     }) => {
          const review = await prisma.review.create({
               data: {
                    userId,
                    medicineId,
                    rating,
                    comment,
               },
          });
          return review;
     },



     getAllReviews: async () => {
          const reviews = await prisma.review.findMany({
               include: {
                    user: true,
                    medicine: true,
               },
               orderBy: { createdAt: "desc" },
          });
          return reviews;
     },

    

};
