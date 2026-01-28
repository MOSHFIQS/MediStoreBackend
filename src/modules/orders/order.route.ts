import { Router } from "express"
import { auth } from "../../middlewares/auth"
import { Role } from "../../../generated/prisma/enums"
import { orderController } from "./order.controller"

const router = Router()

router.post("/orders", auth(Role.CUSTOMER), orderController.createOrder)
router.get("/orders", auth(Role.CUSTOMER), orderController.getMyOrders)
router.get("/orders/:id", auth(Role.CUSTOMER), orderController.getOrderById)


router.get("/seller/orders", auth("SELLER"), orderController.getSellerOrders)
router.patch("/seller/orders/:id", auth("SELLER"), orderController.updateOrderStatus)





export const orderRouter = router