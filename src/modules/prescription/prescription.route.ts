import { Router } from "express"
import { auth } from "../../middlewares/auth"
import { Role } from "../../../generated/prisma/enums"
import { prescriptionController } from "./prescription.controller"

const router = Router()

router.post("/", auth(Role.CUSTOMER), prescriptionController.uploadPrescription)
router.get("/my", auth(Role.CUSTOMER), prescriptionController.getMyPrescriptions)
router.get("/", auth(Role.ADMIN), prescriptionController.getAllPrescriptions)
router.patch("/:id/review", auth(Role.ADMIN), prescriptionController.reviewPrescription)

export const prescriptionRouter = router