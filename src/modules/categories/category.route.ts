import { Router } from "express"
import { categoryController } from "./category.controller"

const router = Router()

router.get("/", categoryController.getAllCategories)
router.post("/", categoryController.createCategory)

export const categoryRouter = router
