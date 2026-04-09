import { Request, Response, NextFunction } from "express"
import sendResponse from "../../utils/sendResponse"
import status from "http-status"
import { adminService } from "./admin.service"

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const users = await adminService.getAllUsers()
          sendResponse(res, {
               statusCode: status.OK,
               success: true,
               message: "All users fetched",
               data: users
          })
     } catch (e) { next(e) }
}

const updateUserStatus = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const adminId = req.user?.id as string
          const ipAddress = req.ip

          const userRes = await adminService.updateUserStatus(
               req.params.id as string,
               req.body.status,
               adminId,
               ipAddress,
          )

          sendResponse(res, {
               statusCode: status.OK,
               success: true,
               message: `User status updated to ${req.body.status}`,
               data: userRes
          })
     } catch (e) { next(e) }
}

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const adminId = req.user?.id as string
          const ipAddress = req.ip

          await adminService.deleteUser(req.params.id as string, adminId, ipAddress)

          sendResponse(res, {
               statusCode: status.OK,
               success: true,
               message: "User deleted successfully",
               data: null
          })
     } catch (e) { next(e) }
}

const adminStatistics = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const stats = await adminService.getStatistics();
          sendResponse(res, {
               statusCode: status.OK,
               success: true,
               message: "Stats fetched successfully",
               data: stats
          })
     } catch (err) { next(err) }
}

export const adminController = {
     getAllUsers,
     updateUserStatus,
     deleteUser,
     adminStatistics,
}