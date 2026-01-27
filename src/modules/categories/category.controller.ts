import { Request, Response, NextFunction } from "express"
import status from "http-status"
import sendResponse from "../../utils/sendResponse"
import { categoryService } from "./category.service"





const createCategory = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const result = await categoryService.createCategory(req.body)

          sendResponse(res,  {
               statusCode : status.CREATED,
               success: true,
               message: "Category created successfully",
               data: result
          })
     } catch (err) {
          console.log(err);
          next(err)
     }
}





const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const categories = await categoryService.getAllCategories()

          sendResponse(res, {
               statusCode : status.OK,
               success: true,
               message: "Categories fetched successfully",
               data: categories
          })
     } catch (err) {
          next(err)
     }
}

export const categoryController = {
     createCategory,
     getAllCategories
}
