import { Request, Response, NextFunction } from "express"
import status from "http-status"
import sendResponse from "../../utils/sendResponse"
import { prescriptionService } from "./prescription.service"

const uploadPrescription = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const result = await prescriptionService.uploadPrescription((req as any).user.id, req.body)
          sendResponse(res, { statusCode: status.CREATED, success: true, message: "Prescription uploaded", data: result })
     } catch (e) { next(e) }
}

const getMyPrescriptions = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const result = await prescriptionService.getMyPrescriptions((req as any).user.id)
          sendResponse(res, { statusCode: status.OK, success: true, message: "Prescriptions fetched", data: result })
     } catch (e) { next(e) }
}

const getAllPrescriptions = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const result = await prescriptionService.getAllPrescriptions()
          sendResponse(res, { statusCode: status.OK, success: true, message: "All prescriptions fetched", data: result })
     } catch (e) { next(e) }
}

const reviewPrescription = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const result = await prescriptionService.reviewPrescription(req.params.id as string, {
               ...req.body,
               reviewedBy: (req as any).user.name || (req as any).user.id
          })
          sendResponse(res, { statusCode: status.OK, success: true, message: "Prescription reviewed", data: result })
     } catch (e) { next(e) }
}

export const prescriptionController = {
     uploadPrescription, getMyPrescriptions,
     getAllPrescriptions, reviewPrescription
}