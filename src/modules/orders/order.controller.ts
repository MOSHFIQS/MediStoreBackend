import { Request, Response, NextFunction } from "express"
import sendResponse from "../../utils/sendResponse"
import status from "http-status"
import { orderService } from "./order.service"





const createOrder = async (req: Request, res : Response, next : NextFunction) => {
     try {
          const order = await orderService.createOrder(req.user!.id, req.body)

          sendResponse(res,{
               statusCode : status.CREATED,
               success: true,
               message: "Order placed successfully",
               data: order,
          })
     } catch (e) {
          next(e)
     }
}

const getMyOrders = async (req: Request, res : Response, next : NextFunction) => {
     try {
          const orders = await orderService.getMyOrders(req.user!.id)

          sendResponse(res,{
               statusCode : status.OK,
               success: true,
               message: "Orders fetched",
               data: orders,
          })
     } catch (e) {
          next(e)
     }
}

const getOrderById = async (req: Request, res : Response, next : NextFunction) => {
     try {
          const order = await orderService.getOrderById(req.user!.id, req.params.id as string)

          sendResponse(res,{
               statusCode : status.OK,
               success: true,
               message: "Order details",
               data: order,
          })
     } catch (e) {
          next(e)
     }
}


const getSellerOrders = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const orders = await orderService.getSellerOrders(req.user!.id)
          sendResponse(res, {
               statusCode : status.OK,
               success: true,
               message: "Seller orders fetched",
               data: orders
          })
     } catch (e) { next(e) }
}

const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const order = await orderService.updateOrderStatus(
               req.user!.id,
               req.params.id as string,
               req.body.status
          )

          sendResponse(res, {
               statusCode : status.OK,
               success: true,
               message: "Order status updated",
               data: order
          })
     } catch (e) { next(e) }
}



export const orderController = {
     createOrder,
     getMyOrders,
     getOrderById,
     getSellerOrders,
     updateOrderStatus
}
