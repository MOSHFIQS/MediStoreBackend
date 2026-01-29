import { Router } from "express"
import { auth } from "../../middlewares/auth"
import { Role } from "../../../generated/prisma/enums"
import { orderController } from "./order.controller"

const router = Router()

router.post("/", auth(Role.CUSTOMER), orderController.createOrder)
router.get("/", auth(Role.CUSTOMER), orderController.getMyOrders)
router.get("/:id", auth(Role.CUSTOMER), orderController.getOrderById)

router.patch("/:id",auth(Role.CUSTOMER),orderController.cancelOrder)



router.get("/seller", auth(Role.SELLER), orderController.getSellerOrders)
router.patch("/seller/:id", auth(Role.SELLER), orderController.updateOrderStatus)





export const orderRouter = router