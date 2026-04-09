import { Request, Response, NextFunction } from "express"
import status from "http-status"
import sendResponse from "../../utils/sendResponse"
import { categoryService } from "./category.service"
import { IQueryParams } from "../../interfaces/query.interface"





const createCategory = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const result = await categoryService.createCategory(req.body)

          sendResponse(res, {
               statusCode: status.CREATED,
               success: true,
               message: "Category created successfully",
               data: result
          })
     } catch (err) {
          next(err)
     }
}





const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const query = req.query;
          const categories = await categoryService.getAllCategories(query as IQueryParams)

          sendResponse(res, {
               statusCode: status.OK,
               success: true,
               message: "Categories fetched successfully",
               data: categories
          })
     } catch (err) {
          next(err)
     }
}



const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const { id } = req.params;
          const result = await categoryService.updateCategory(id as string, req.body);
          sendResponse(res, {
               statusCode: status.OK,
               success: true,
               message: "Category updated successfully",
               data: result
          });
     } catch (err) {
          next(err);
     }
};

const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const { id } = req.params;
          await categoryService.deleteCategory(id as string);
          sendResponse(res, {
               statusCode: status.OK,
               success: true,
               message: "Category deleted successfully",
               data: null
          });
     } catch (err) {
          next(err);
     }
};


const getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const { id } = req.params;
          const category = await categoryService.getCategoryById(id as string);

          sendResponse(res, {
               statusCode: status.OK,
               success: true,
               message: "Category fetched successfully",
               data: category,
          });
     } catch (err) {
          next(err);
     }
};

export const categoryController = {
     createCategory,
     getAllCategories,
     updateCategory,
     deleteCategory,
     getCategoryById
}
