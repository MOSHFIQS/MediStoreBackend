import { Router } from "express"
import { auth } from "../../middlewares/auth"
import { adminController } from './admin.controller';
import { Role } from "../../../generated/prisma/enums";

const router = Router()

router.get("/users", auth(Role.ADMIN), adminController.getAllUsers)
router.patch("/users/:id", auth(Role.ADMIN), adminController.updateUserStatus)
router.get("/statistics", adminController.adminStatistics);

export const adminRouter = router
