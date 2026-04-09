import { Request, Response, NextFunction } from "express"
import status from "http-status"
import sendResponse from "../../utils/sendResponse"
import { orderService } from "./order.service"
import { IQueryParams } from "../../interfaces/query.interface"

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const result = await orderService.createOrder((req as any).user.id, req.body)
          sendResponse(res, { statusCode: status.CREATED, success: true, message: "Order placed", data: result })
     } catch (e) { next(e) }
}

const getMyOrders = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const query = req.query;
          const result = await orderService.getMyOrders((req as any).user.id, query as IQueryParams)
          sendResponse(res, { statusCode: status.OK, success: true, message: "Orders fetched", data: result })
     } catch (e) { next(e) }
}

const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const result = await orderService.getOrderById(req.params.id as string, (req as any).user.id)
          sendResponse(res, { statusCode: status.OK, success: true, message: "Order fetched", data: result })
     } catch (e) { next(e) }
}

const cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const result = await orderService.cancelOrder(req.params.id as string, (req as any).user.id)
          sendResponse(res, { statusCode: status.OK, success: true, message: "Order cancelled", data: result })
     } catch (e) { next(e) }
}

const getSellerOrders = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const query = req.query;
          const result = await orderService.getSellerOrders((req as any).user.id, query as IQueryParams)
          sendResponse(res, { statusCode: status.OK, success: true, message: "Seller orders fetched", data: result })
     } catch (e) { next(e) }
}

const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const result = await orderService.updateOrderStatus(req.params.id as string, (req as any).user.id, req.body.status)
          sendResponse(res, { statusCode: status.OK, success: true, message: "Order status updated", data: result })
     } catch (e) { next(e) }
}

export const orderController = {
     createOrder, getMyOrders, getOrderById,
     cancelOrder, getSellerOrders, updateOrderStatus
}