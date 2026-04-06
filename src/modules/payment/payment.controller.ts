import { Request, Response, NextFunction } from "express"
import status from "http-status"
import sendResponse from "../../utils/sendResponse"
import { paymentService } from "./payment.service"

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

export const paymentController = {
     initiatePayment, paymentSuccess, paymentFail,
     paymentCancel, paymentIPN, getPaymentByOrder
}