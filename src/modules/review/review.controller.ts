import { Request, Response, NextFunction } from "express"
import status from "http-status"
import sendResponse from "../../utils/sendResponse"
import { reviewService } from "./review.service"

const createReview = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const result = await reviewService.createReview((req as any).user.id, req.body)
          sendResponse(res, { statusCode: status.CREATED, success: true, message: "Review submitted", data: result })
     } catch (e) { next(e) }
}

const getMedicineReviews = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const result = await reviewService.getMedicineReviews(req.params.medicineId as string)
          sendResponse(res, { statusCode: status.OK, success: true, message: "Reviews fetched", data: result })
     } catch (e) { next(e) }
}

const deleteReview = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const { id: userId, role } = (req as any).user
          const result = await reviewService.deleteReview(req.params.id as string, userId, role)
          sendResponse(res, { statusCode: status.OK, success: true, message: "Review deleted", data: result })
     } catch (e) { next(e) }
}

const getAllReviews = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const result = await reviewService.getAllReviews()
          sendResponse(res, { statusCode: status.OK, success: true, message: "Reviews fetched", data: result })
     } catch (e) { next(e) }
}

export const reviewController = {
     createReview,
     getAllReviews,   // ← add
     getMedicineReviews,
     deleteReview
}