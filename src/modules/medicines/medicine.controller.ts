import { Request, Response, NextFunction } from "express"
import { medicineService } from "./medicine.service"
import sendResponse from "../../utils/sendResponse"
import status from "http-status"





const createMedicine = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const user = req.user
          if(!user){
               throw new Error("Unauthorized")
          }

          const result = await medicineService.createMedicine(user.id, req.body)

          sendResponse(res, {
               statusCode : status.CREATED,
               success: true,
               message: "Medicine added successfully",
               data: result
          })
     } catch (err) {
          next(err)
     }
}


const updateMedicine = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const user = req.user
          if (!user) {
               throw new Error("Unauthorized")
          }

         const result =  await medicineService.updateMedicine(user.id, req.params.id as string, req.body)

          sendResponse(res, {
               statusCode : status.OK,
               success: true,
               message: "Medicine updated",
               data : result
          })
     } catch (err) {
          next(err)
     }
}




const deleteMedicine = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const user = req.user
          if(!user){
               throw new Error("Unauthorized")
          }

          const result = await medicineService.deleteMedicine(user.id, req.params.id as string)

          sendResponse(res, {
               statusCode : status.OK,
               success: true,
               message: "Medicine removed",
               data : result
          })
     } catch (err) {
          console.log(err);
          next(err)
     }
}

const getSellerMedicines = async (
     req: Request,
     res: Response,
     next: NextFunction
) => {
     try {
          const sellerId = req.user!.id
          console.log(sellerId);

          const medicines = await medicineService.getSellerMedicines(sellerId)

          sendResponse(res, {
               statusCode: 200,
               success: true,
               message: "Seller medicines retrieved successfully",
               data: medicines,
          })
     } catch (err) {
          next(err)
     }
}



const getAllMedicines = async (req: Request, res: Response, next: NextFunction) => {
     try {

          const medicines = await medicineService.getAllMedicines(req.query)
          sendResponse(res, {
               statusCode : status.OK,
               success: true,
               message: "Medicines fetched",
               data: medicines
          })
     } catch (err) {
          next(err)
     }
}


const getMedicineById = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const medicine = await medicineService.getMedicineById(req.params.id as string)

          if (!medicine) {
               return sendResponse(res, {
                    statusCode: status.NOT_FOUND,
                    success: false,
                    message: "Medicine not found"
               })
          }

          sendResponse(res, {
               statusCode : status.OK,
               success: true,
               message: "Medicine fetched",
               data: medicine
          })
     } catch (err) {
          next(err)
     }
}

export const medicineController = {
     createMedicine,
     updateMedicine,
     deleteMedicine,
     getSellerMedicines,
     getAllMedicines,
     getMedicineById
}
