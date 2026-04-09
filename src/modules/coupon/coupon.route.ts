import { Router } from "express"
import { auth } from "../../middlewares/auth"
import { Role } from "../../../generated/prisma/enums"
import { couponController } from "./coupon.controller"

const router = Router()

router.post("/", auth(Role.ADMIN), couponController.createCoupon)
router.get("/", auth(Role.ADMIN), couponController.getAllCoupons)
router.patch("/:id", auth(Role.ADMIN), couponController.updateCoupon)
router.delete("/:id", auth(Role.ADMIN), couponController.deleteCoupon)
router.post("/validate", auth(Role.CUSTOMER), couponController.validateCoupon)

export const couponRouter = router