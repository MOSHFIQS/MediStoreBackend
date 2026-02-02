import { Request, Response, NextFunction } from "express"
import sendResponse from "../../utils/sendResponse"
import status from "http-status"
import { adminService} from "./admin.service"



const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const users = await adminService.getAllUsers()

          sendResponse(res, {
               statusCode : status.OK,
               success: true,
               message: "All users fetched",
               data: users
          })
     } catch (e) { next(e) }
}

const updateUserStatus = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const user = await adminService.updateUserStatus(
               req.params.id as string,
               req.body.status
          )
          sendResponse(res, {
               statusCode : status.OK,
               success: true,
               message: `User ${req.body.status}`,
               data: user
          })
     } catch (e) { next(e) }
}

const adminStatistics = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const stats = await adminService.getStatistics();
          sendResponse(res, {
               statusCode: status.OK,
               success: true,
               message: "stats get successfully",
               data: stats
          })
     } catch (err) {
          next(err)
     }
}



export const adminController = {
     getAllUsers,
     updateUserStatus,
     adminStatistics
}
