import { Router } from "express"
import { auth } from "../../middlewares/auth"
import { Role } from "../../../generated/prisma/enums"
import { notificationController } from "./notification.controller"

const router = Router()

router.get("/", auth(Role.CUSTOMER), notificationController.getMyNotifications)
router.get("/unread-count", auth(Role.CUSTOMER), notificationController.getUnreadCount)
router.patch("/:id/read", auth(Role.CUSTOMER), notificationController.markAsRead)
router.patch("/mark-all-read", auth(Role.CUSTOMER), notificationController.markAllAsRead)

export const notificationRouter = router