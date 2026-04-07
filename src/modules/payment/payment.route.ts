import { Router } from "express"
import { auth } from "../../middlewares/auth"
import { Role } from "../../../generated/prisma/enums"
import { paymentController } from "./payment.controller"

const router = Router()

// Customer initiates payment for an order
router.post("/initiate/:orderId", auth(Role.CUSTOMER), paymentController.initiatePayment)

// SSLCommerz redirects (no auth — SSLCommerz posts to these)
router.post("/success", paymentController.paymentSuccess)
router.post("/fail", paymentController.paymentFail)
router.post("/cancel", paymentController.paymentCancel)
router.post("/ipn", paymentController.paymentIPN)  // server-to-server

// View payment status
router.get("/order/:orderId", auth(Role.CUSTOMER), paymentController.getPaymentByOrder)


router.get("/my", auth(Role.CUSTOMER), paymentController.getMyPayments)
router.get("/admin", auth(Role.ADMIN), paymentController.getAllPayments)
router.get("/seller", auth(Role.SELLER), paymentController.getSellerPayments)




export const paymentRouter = router