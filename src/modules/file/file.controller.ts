import { NextFunction, Request, Response } from "express";
import status from "http-status";
import { FileService } from "./file.service";
import AppError from "../../errorHelpers/AppError";
import sendResponse from "../../utils/sendResponse";

const uploadImage = async (req: Request, res: Response) => {
     const files = req.files as Express.Multer.File[];
     if (files?.length > 10) {
          throw new AppError(status.BAD_REQUEST, "Maximum 10 images are allowed");
     }

     const result = await FileService.uploadImage(files);

     sendResponse(res, {
          statusCode: status.OK,
          success: true,
          message: "Image uploaded successfully",
          data: result,
     });
};


const deleteImage = async (req: Request, res: Response, next: NextFunction) => {
     const { url } = req.body;

     const result = await FileService.deleteImage(url);

     sendResponse(res, {
          statusCode: status.OK,
          success: true,
          message: "Image deleted successfully",
          data: result,
     });
}

export const FileController = {
     uploadImage,
     deleteImage,
};