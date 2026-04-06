import { Router } from "express"
import { auth } from "../../middlewares/auth"
import { Role } from "../../../generated/prisma/enums"
import { reviewController } from "./review.controller"

const router = Router()

router.post("/", auth(Role.CUSTOMER), reviewController.createReview)
router.get("/:medicineId", reviewController.getMedicineReviews)
router.delete("/:id", auth(Role.CUSTOMER), reviewController.deleteReview)

export const reviewRouter = router