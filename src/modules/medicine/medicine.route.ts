import { Router } from "express"
import { medicineController } from "./medicine.controller"
import { auth } from "../../middlewares/auth"
import { Role } from "../../../generated/prisma/enums"

const router = Router()

router.post("/seller", auth(Role.SELLER), medicineController.createMedicine)
router.put("/seller/:id", auth(Role.SELLER), medicineController.updateMedicine)
router.delete("/seller/:id", auth(Role.SELLER),  medicineController.deleteMedicine)
router.get("/seller", auth(Role.SELLER),  medicineController.getSellerMedicines)



router.get("/", medicineController.getAllMedicines)
router.get("/:id", medicineController.getMedicineById)

export const medicineRouter = router