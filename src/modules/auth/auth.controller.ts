import { Request, Response, NextFunction } from "express"
import { authService } from "./auth.service"
import sendResponse from "../../utils/sendResponse"
import status from "http-status"

const signUpUser = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const result = await authService.signUpUser(req.body)

          // res.cookie("token", result.token, {
          //      httpOnly: true,
          //      secure: process.env.NODE_ENV === "production",
          //      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          //      maxAge: 7 * 24 * 60 * 60 * 1000
          // })

          sendResponse(res, {
               statusCode: status.CREATED,
               success: true,
               message: "User registered successfully",
               // data: { user: result.user }
               data: result
          })
     } catch (err) {
          next(err)
     }
}

const signInUser = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const result = await authService.signInUser(req.body)

          // res.cookie("token", result.token, {
          //      httpOnly: true,
          //      secure: process.env.NODE_ENV === "production",
          //      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          //      maxAge: 7 * 24 * 60 * 60 * 1000
          // })

          sendResponse(res, {
               statusCode: status.OK,
               success: true,
               message: "Login successful",
               // data: { user: result.user }
               data: result
          })
     } catch (err) {
          next(err)
     }
}


export const authController = { signUpUser, signInUser}
