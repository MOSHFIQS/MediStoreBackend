import { Router } from "express"
import { medicineController } from "./medicine.controller"
import { auth } from "../../middlewares/auth"
import { Role } from "../../../generated/prisma/enums"

const router = Router()

router.post("/seller/medicines", auth(Role.SELLER), medicineController.createMedicine)
router.put("/seller/medicines/:id", auth(Role.SELLER), medicineController.updateMedicine)
router.delete("/seller/medicines/:id", auth(Role.SELLER),  medicineController.deleteMedicine)



router.get("/medicines", medicineController.getAllMedicines)
router.get("/medicines/:id", medicineController.getMedicineById)

export const medicineRouter = router
