import { Router } from "express"
import { auth } from "../../middlewares/auth"
import { adminController } from './admin.controller';

const router = Router()

router.get("/users", auth("ADMIN"), adminController.getAllUsers)
router.patch("/users/:id", auth("ADMIN"), adminController.updateUserStatus)


export const adminRouter = router
