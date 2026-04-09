import { Request, Response, NextFunction } from "express"
import status from "http-status"
import sendResponse from "../../utils/sendResponse"
import { couponService } from "./coupon.service"
import { IQueryParams } from "../../interfaces/query.interface"

const createCoupon = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const result = await couponService.createCoupon(req.body)
          sendResponse(res, { statusCode: status.CREATED, success: true, message: "Coupon created", data: result })
     } catch (e) { next(e) }
}

const getAllCoupons = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const query = req.query;
          const result = await couponService.getAllCoupons(query as IQueryParams)
          sendResponse(res, { statusCode: status.OK, success: true, message: "Coupons fetched", data: result })
     } catch (e) { next(e) }
}

const updateCoupon = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const result = await couponService.updateCoupon(req.params.id as string, req.body)
          sendResponse(res, { statusCode: status.OK, success: true, message: "Coupon updated", data: result })
     } catch (e) { next(e) }
}

const deleteCoupon = async (req: Request, res: Response, next: NextFunction) => {
     try {
          await couponService.deleteCoupon(req.params.id as string)
          sendResponse(res, { statusCode: status.OK, success: true, message: "Coupon deleted", data: null })
     } catch (e) { next(e) }
}

const validateCoupon = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const { code, orderAmount } = req.body
          const result = await couponService.validateCoupon(code, parseFloat(orderAmount))
          sendResponse(res, { statusCode: status.OK, success: true, message: "Coupon valid", data: result })
     } catch (e) { next(e) }
}

export const couponController = { createCoupon, getAllCoupons, updateCoupon, deleteCoupon, validateCoupon }