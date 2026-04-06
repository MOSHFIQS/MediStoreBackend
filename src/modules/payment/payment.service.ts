import { envVars } from "../../config/env"
import { prisma } from "../../lib/prisma"
// @ts-ignore
import SSLCommerzPayment from "sslcommerz-lts"

const STORE_ID = envVars.SSLCOMMERZ.SSL_STORE_ID
const STORE_PASS = envVars.SSLCOMMERZ.SSL_STORE_PASS
const IS_LIVE = envVars.SSLCOMMERZ.SSL_IS_LIVE === "true"
const BACKEND_URL = process.env.BACKEND_URL! || "http://localhost:5000" 
const FRONTEND_URL = process.env.FRONTEND_URL! || "http://localhost:3000"

const initiatePayment = async (orderId: string, customerId: string) => {
     const order = await prisma.order.findFirst({
          where: { id: orderId, customerId },
          include: {
               customer: true,
               payment: true,
               address: true
          }
     })
     if (!order) throw new Error("Order not found")
     if (!order.payment) throw new Error("Payment record not found")
     if (order.payment.status === "SUCCESS") throw new Error("Order already paid")

     const tranId = `TXN-${orderId}-${Date.now()}`

     const data = {
          total_amount: order.totalPrice,
          currency: "BDT",
          tran_id: tranId,
          success_url: `${BACKEND_URL}/api/payment/success`,
          fail_url: `${BACKEND_URL}/api/payment/fail`,
          cancel_url: `${BACKEND_URL}/api/payment/cancel`,
          ipn_url: `${BACKEND_URL}/api/payment/ipn`,
          shipping_method: "Courier",
          product_name: "Medicine Order",
          product_category: "Healthcare",
          product_profile: "general",
          cus_name: order.customer.name,
          cus_email: order.customer.email,
          cus_add1: order.address?.line1 || "N/A",
          cus_city: order.address?.city || "N/A",
          cus_country: "Bangladesh",
          cus_phone: order.customer.phone || "01XXXXXXXXX",
          ship_name: order.customer.name,
          ship_add1: order.address?.line1 || "N/A",
          ship_city: order.address?.city || "N/A",
          ship_country: "Bangladesh",
          ship_postcode: order.address?.postalCode || "1000",
     }

     const sslcz = new SSLCommerzPayment(STORE_ID, STORE_PASS, IS_LIVE)
     const apiResponse = await sslcz.init(data)

     if (!apiResponse?.GatewayPageURL) throw new Error("Failed to initiate payment gateway")

     // Save tranId and session key
     await prisma.payment.update({
          where: { id: order.payment.id },
          data: {
               tranId,
               sessionKey: apiResponse.sessionkey,
               status: "INITIATED",
               method: "SSLCOMMERZ",
               initiatedAt: new Date()
          }
     })

     // Log the event
     await prisma.paymentLog.create({
          data: {
               paymentId: order.payment.id,
               event: "INITIATED",
               status: "INITIATED",
               rawPayload: apiResponse
          }
     })

     return { gatewayUrl: apiResponse.GatewayPageURL, tranId }
}

const handleSuccess = async (body: any) => {
     const { tran_id, val_id, bank_tran_id, card_type, card_no, store_amount, currency_type, currency_amount, currency_rate } = body

     const payment = await prisma.payment.findFirst({ where: { tranId: tran_id } })
     if (!payment) throw new Error("Payment not found")

     // Validate with SSLCommerz
     const sslcz = new SSLCommerzPayment(STORE_ID, STORE_PASS, IS_LIVE)
     const validation = await sslcz.validate({ val_id })

     if (validation.status !== "VALID" && validation.status !== "VALIDATED") {
          await prisma.payment.update({ where: { id: payment.id }, data: { status: "FAILED", failedAt: new Date() } })
          await prisma.paymentLog.create({ data: { paymentId: payment.id, event: "VALIDATION_FAILED", status: "FAILED", rawPayload: validation } })
          throw new Error("Payment validation failed")
     }

     await prisma.$transaction(async (tx) => {
          await tx.payment.update({
               where: { id: payment.id },
               data: {
                    status: "SUCCESS",
                    valId: val_id,
                    bankTranId: bank_tran_id,
                    cardType: card_type,
                    cardNo: card_no,
                    storeAmount: parseFloat(store_amount),
                    currency_type,
                    currency_amount: parseFloat(currency_amount),
                    currency_rate: parseFloat(currency_rate),
                    paidAt: new Date(),
                    ipnPayload: body
               }
          })

          await tx.order.update({
               where: { id: payment.orderId },
               data: { status: "CONFIRMED" }
          })

          await tx.paymentLog.create({
               data: { paymentId: payment.id, event: "SUCCESS", status: "SUCCESS", rawPayload: body }
          })

          // Create notification
          const order = await tx.order.findUnique({ where: { id: payment.orderId } })
          if (order) {
               await tx.notification.create({
                    data: {
                         userId: order.customerId,
                         type: "PAYMENT_UPDATE",
                         title: "Payment Successful",
                         message: `Your payment of ৳${payment.amount} was successful. Order confirmed!`,
                         meta: { orderId: order.id, paymentId: payment.id }
                    }
               })
          }
     })

     return payment.orderId
}

const handleFail = async (body: any) => {
     const { tran_id } = body
     const payment = await prisma.payment.findFirst({ where: { tranId: tran_id } })
     if (!payment) return

     await prisma.payment.update({ where: { id: payment.id }, data: { status: "FAILED", failedAt: new Date() } })
     await prisma.paymentLog.create({ data: { paymentId: payment.id, event: "FAILED", status: "FAILED", rawPayload: body } })
}

const handleCancel = async (body: any) => {
     const { tran_id } = body
     const payment = await prisma.payment.findFirst({ where: { tranId: tran_id } })
     if (!payment) return

     await prisma.payment.update({ where: { id: payment.id }, data: { status: "CANCELLED" } })
     await prisma.paymentLog.create({ data: { paymentId: payment.id, event: "CANCELLED", status: "CANCELLED", rawPayload: body } })
}

// IPN = Instant Payment Notification (server-to-server from SSLCommerz)
const handleIPN = async (body: any) => {
     const { tran_id, status } = body
     const payment = await prisma.payment.findFirst({ where: { tranId: tran_id } })
     if (!payment) return

     await prisma.paymentLog.create({
          data: { paymentId: payment.id, event: "IPN_RECEIVED", status, rawPayload: body }
     })

     if (status === "VALID" || status === "VALIDATED") {
          await prisma.payment.update({ where: { id: payment.id }, data: { status: "SUCCESS", paidAt: new Date(), ipnPayload: body } })
          await prisma.order.update({ where: { id: payment.orderId }, data: { status: "CONFIRMED" } })
     }
}

const getPaymentByOrder = async (orderId: string, customerId: string) => {
     const order = await prisma.order.findFirst({ where: { id: orderId, customerId } })
     if (!order) throw new Error("Order not found")
     return prisma.payment.findFirst({
          where: { orderId },
          include: { logs: { orderBy: { createdAt: "desc" } } }
     })
}

export const paymentService = {
     initiatePayment, handleSuccess, handleFail,
     handleCancel, handleIPN, getPaymentByOrder
}