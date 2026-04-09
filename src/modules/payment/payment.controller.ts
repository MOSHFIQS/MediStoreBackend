import { Request, Response, NextFunction } from "express"
import status from "http-status"
import sendResponse from "../../utils/sendResponse"
import { paymentService } from "./payment.service"
import { IQueryParams } from "../../interfaces/query.interface"

const FRONTEND_URL = process.env.FRONTEND_URL!

const initiatePayment = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const result = await paymentService.initiatePayment(req.params.orderId as string, (req as any).user.id)
          sendResponse(res, { statusCode: status.OK, success: true, message: "Payment initiated", data: result })
     } catch (e) { next(e) }
}

// These are redirect endpoints — SSLCommerz POSTs to them
const paymentSuccess = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const orderId = await paymentService.handleSuccess(req.body)
          res.redirect(`${FRONTEND_URL}/payment/success?orderId=${orderId}`)
     } catch (e) {
          res.redirect(`${FRONTEND_URL}/payment/fail`)
     }
}

const paymentFail = async (req: Request, res: Response, next: NextFunction) => {
     try {
          await paymentService.handleFail(req.body)
          res.redirect(`${FRONTEND_URL}/payment/fail`)
     } catch (e) { next(e) }
}

const paymentCancel = async (req: Request, res: Response, next: NextFunction) => {
     try {
          await paymentService.handleCancel(req.body)
          res.redirect(`${FRONTEND_URL}/payment/cancel`)
     } catch (e) { next(e) }
}

const paymentIPN = async (req: Request, res: Response, next: NextFunction) => {
     try {
          await paymentService.handleIPN(req.body)
          res.status(200).send("IPN received")
     } catch (e) { next(e) }
}

const getPaymentByOrder = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const result = await paymentService.getPaymentByOrder(req.params.orderId as string, (req as any).user.id)
          sendResponse(res, { statusCode: status.OK, success: true, message: "Payment fetched", data: result })
     } catch (e) { next(e) }
}

const getMyPayments = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const query = req.query;
          const result = await paymentService.getMyPayments((req as any).user.id, query as IQueryParams)
          sendResponse(res, { statusCode: status.OK, success: true, message: "My payments fetched", data: result })
     } catch (e) { next(e) }
}

const getSellerPayments = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const query = req.query;
          const result = await paymentService.getSellerPayments((req as any).user.id, query as IQueryParams)
          sendResponse(res, { statusCode: status.OK, success: true, message: "Seller payments fetched", data: result })
     } catch (e) { next(e) }
}

const getAllPayments = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const query = req.query;
          const result = await paymentService.getAllPayments(query as IQueryParams)
          sendResponse(res, { statusCode: status.OK, success: true, message: "All payments fetched", data: result })
     } catch (e) { next(e) }
}

const refundPayment = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const ip = req.ip || req.headers["x-forwarded-for"] as string
          const result = await paymentService.refundPayment(
               req.params.id as string,
               (req as any).user.id,
               ip
          )
          sendResponse(res, { statusCode: status.OK, success: true, message: "Payment refunded", data: result })
     } catch (e) { next(e) }
}

export const paymentController = {
     initiatePayment, paymentSuccess, paymentFail,
     paymentCancel, paymentIPN, getPaymentByOrder,
     getMyPayments,
     getSellerPayments,
     getAllPayments,
     refundPayment,
}