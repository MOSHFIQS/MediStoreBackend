// controllers/review.controller.ts
import { Request, Response, NextFunction } from "express";
import status from "http-status";
import { reviewService } from "./review.service";
import sendResponse from "../../utils/sendResponse";

// Create Review
export const createReview = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const user = req.user;
          if (!user) {
               throw new Error("Unauthorized");
          }

          const { medicineId, rating, comment } = req.body;

          const result = await reviewService.createReview({
               userId: user.id,
               medicineId,
               rating,
               comment,
          });

          sendResponse(res, {
               statusCode: status.OK,
               success: true,
               message: "Review created successfully",
               data: result,
          });
     } catch (err) {
          console.log(err);
          next(err);
     }
};

// Get All Reviews
export const getAllReviews = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const result = await reviewService.getAllReviews();

          sendResponse(res, {
               statusCode: status.OK,
               success: true,
               message: "All reviews fetched successfully",
               data: result,
          });
     } catch (err) {
          console.log(err);
          next(err);
     }
};



export const reviewController = {
     createReview,
     getAllReviews
}
