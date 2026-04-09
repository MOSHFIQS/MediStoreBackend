import { Request, Response, NextFunction } from "express"
import status from "http-status"
import sendResponse from "../../utils/sendResponse"
import { medicineService } from "./medicine.service"
import { IQueryParams } from "../../interfaces/query.interface"

const createMedicine = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const result = await medicineService.createMedicine((req as any).user.id, req.body)
          sendResponse(res, { statusCode: status.CREATED, success: true, message: "Medicine created", data: result })
     } catch (e) { next(e) }
}

const updateMedicine = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const result = await medicineService.updateMedicine(req.params.id as string, (req as any).user.id, req.body)
          sendResponse(res, { statusCode: status.OK, success: true, message: "Medicine updated", data: result })
     } catch (e) { next(e) }
}

const deleteMedicine = async (req: Request, res: Response, next: NextFunction) => {
     try {
          await medicineService.deleteMedicine(req.params.id as string, (req as any).user.id)
          sendResponse(res, { statusCode: status.OK, success: true, message: "Medicine deleted", data: null })
     } catch (e) { next(e) }
}

const getSellerMedicines = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const query = req.query;
          const result = await medicineService.getSellerMedicines((req as any).user.id, query as IQueryParams)
          sendResponse(res, { statusCode: status.OK, success: true, message: "Seller medicines fetched", data: result })
     } catch (e) { next(e) }
}

const getAllMedicines = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const query = req.query;
          console.log("query::",query);
          const result = await medicineService.getAllMedicines(query as IQueryParams)
          sendResponse(res, { statusCode: status.OK, success: true, message: "Medicines fetched", data: result })
     } catch (e) { next(e) }
}

const getMedicineById = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const result = await medicineService.getMedicineById(req.params.id as string)
          sendResponse(res, { statusCode: status.OK, success: true, message: "Medicine fetched", data: result })
     } catch (e) { next(e) }
}

export const medicineController = {
     createMedicine, updateMedicine, deleteMedicine,
     getSellerMedicines, getAllMedicines, getMedicineById
}