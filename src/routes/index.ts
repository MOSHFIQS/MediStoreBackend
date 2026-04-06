import { Router } from "express";
import { authRouter } from './../modules/auth/auth.route';
import { medicineRouter } from "../modules/medicine/medicine.route";
import { orderRouter } from "../modules/order/order.route";
import { categoryRouter } from "../modules/category/category.route";
import { adminRouter } from "../modules/admin/admin.route";
import { reviewRouter } from "../modules/review/review.route";
import { userRouter } from './../modules/user/user.route';
import { addressRouter } from './../modules/address/address.route';
import { couponRouter } from './../modules/coupon/coupon.route';
import { notificationRouter } from './../modules/notification/notification.route';
import { paymentRouter } from './../modules/payment/payment.route';
import { FileRoutes } from "../modules/file/file.route";


const router = Router();

const moduleRoutes = [
     {
          path: '/file',
          route: FileRoutes,
     },
     {
          path: '/auth',
          route: authRouter,
     },
     {
          path: '/medicine',
          route: medicineRouter,
     },
     {
          path: '/order',
          route: orderRouter,
     },
     {
          path: '/category',
          route: categoryRouter,
     },
     {
          path: '/admin',
          route: adminRouter,
     },
     {
          path: '/user',
          route: userRouter,
     },
     {
          path: '/review',
          route: reviewRouter,
     },
     {
          path: '/address',
          route: addressRouter,
     },
     {
          path: '/coupon',
          route: couponRouter,
     },
     {
          path: '/notification',
          route: notificationRouter,
     },
     {
          path: '/payment',
          route: paymentRouter,
     },

];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;