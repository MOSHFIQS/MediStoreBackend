import { Router } from "express"
import { userController } from "./user.controller"
import { auth } from "../../middlewares/auth"
import { Role } from "../../../generated/prisma/enums"

const router = Router()

router.get("/me", auth(Role.CUSTOMER, Role.ADMIN, Role.SELLER), userController.getMe)
router.patch("/me", auth(Role.CUSTOMER, Role.ADMIN, Role.SELLER), userController.updateProfile)



//stats

router.get("/admin/statistics", auth(Role.ADMIN), userController.adminStatistics);
router.get("/customer/statistics",   auth(Role.CUSTOMER), userController.customerStatistics);
router.get("/seller/statistics", auth(Role.SELLER), userController.sellerStatistics);

export const userRouter = router
