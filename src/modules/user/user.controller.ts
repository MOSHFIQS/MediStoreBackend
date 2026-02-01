import { Request, Response, NextFunction } from "express"
import sendResponse from "../../utils/sendResponse"
import status from "http-status"
import { userService } from "./user.service"



const getMe = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const token = req.cookies.token
          if (!token) {
               return sendResponse(res, {
                    statusCode: status.UNAUTHORIZED,
                    success: false,
                    message: "Not logged in"
               })
          }

          const user = await userService.getMe(token)

          sendResponse(res, {
               statusCode: status.OK,
               success: true,
               message: "Current user fetched",
               data: { user }
          })
     } catch (err) {
          next(err)
     }
}

const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const token = req.cookies.token

          if (!token) {
               return sendResponse(res, {
                    statusCode: status.UNAUTHORIZED,
                    success: false,
                    message: "Not logged in",
               })
          }

          const user = await userService.updateProfile(token, req.body)

          sendResponse(res, {
               statusCode: status.OK,
               success: true,
               message: "Profile updated successfully",
               data: { user },
          })
     } catch (err) {
          next(err)
     }
}




export const userController = {
     getMe,
     updateProfile
}
