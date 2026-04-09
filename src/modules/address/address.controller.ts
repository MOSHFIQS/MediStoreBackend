import { Request, Response, NextFunction } from "express"
import status from "http-status"
import sendResponse from "../../utils/sendResponse"
import { addressService } from "./address.service"

const createAddress = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const result = await addressService.createAddress((req as any).user.id, req.body)
          sendResponse(res, { statusCode: status.CREATED, success: true, message: "Address added", data: result })
     } catch (e) { next(e) }
}

const getMyAddresses = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const result = await addressService.getMyAddresses((req as any).user.id)
          sendResponse(res, { statusCode: status.OK, success: true, message: "Addresses fetched", data: result })
     } catch (e) { next(e) }
}

const updateAddress = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const result = await addressService.updateAddress(req.params.id as string, (req as any).user.id, req.body)
          sendResponse(res, { statusCode: status.OK, success: true, message: "Address updated", data: result })
     } catch (e) { next(e) }
}

const deleteAddress = async (req: Request, res: Response, next: NextFunction) => {
     try {
          await addressService.deleteAddress(req.params.id as string, (req as any).user.id)
          sendResponse(res, { statusCode: status.OK, success: true, message: "Address deleted", data: null })
     } catch (e) { next(e) }
}

export const addressController = { createAddress, getMyAddresses, updateAddress, deleteAddress }