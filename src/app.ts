import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/globalErrorHandler";
import { notFound } from "./middlewares/notFound";
import { authRouter } from "./modules/auth/auth.route";
import { medicineRouter } from "./modules/medicines/medicine.route";
import { categoryRouter } from "./modules/categories/category.route";
import { orderRouter } from "./modules/orders/order.route";
import { adminRouter } from "./modules/admin/admin.route";

const app: Application = express();

app.use(cors({
     origin: process.env.APP_URL || "http://localhost:4000",
     credentials: true 
}))

app.use(cookieParser())
app.use(express.json())

// Routes
app.use("/api/auth", authRouter)
app.use("/api", medicineRouter)
app.use("/api", orderRouter )
app.use("/api/categories", categoryRouter)
app.use("/api/admin", adminRouter)

app.get("/", (req, res) => {
     res.send("Hello, World!");
})

app.use(notFound)

app.use(errorHandler)

export default app
