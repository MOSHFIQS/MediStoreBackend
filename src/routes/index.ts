import { Router } from "express";
import { authRouter } from './../modules/auth/auth.route';
import { medicineRouter } from "../modules/medicines/medicine.route";
import { orderRouter } from "../modules/orders/order.route";
import { categoryRouter } from "../modules/categories/category.route";
import { adminRouter } from "../modules/admin/admin.route";
import { reviewRouter } from "../modules/reviews/review.route";


const router = Router();

const moduleRoutes = [
     {
          path: '/auth',
          route: authRouter,
     },
     {
          path: '/medicines',
          route: medicineRouter,
     },
     {
          path: '/orders',
          route: orderRouter,
     },
     {
          path: '/categories',
          route: categoryRouter,
     },
     {
          path: '/admin',
          route: adminRouter,
     },
     {
          path: '/review',
          route: reviewRouter,
     },
     {
          path: '/user',
          route: reviewRouter,
     },

];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;