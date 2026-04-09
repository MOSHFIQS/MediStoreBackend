import { Router } from "express"
import { auth } from "../../middlewares/auth"
import { Role } from "../../../generated/prisma/enums"
import { addressController } from "./address.controller"

const router = Router()

router.post("/", auth(Role.CUSTOMER), addressController.createAddress)
router.get("/", auth(Role.CUSTOMER), addressController.getMyAddresses)
router.patch("/:id", auth(Role.CUSTOMER), addressController.updateAddress)
router.delete("/:id", auth(Role.CUSTOMER), addressController.deleteAddress)

export const addressRouter = router