import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/globalErrorHandler";
import { notFound } from "./middlewares/notFound";
import { authRouter } from "./modules/auth/auth.route";
import { medicineRouter } from "./modules/medicines/medicine.route";

const app: Application = express();

app.use(cors({
     origin: process.env.APP_URL || "http://localhost:4000",
     credentials: true // allow cookies
}))

app.use(cookieParser())
app.use(express.json())

// Routes
app.use("/api/auth", authRouter)
app.use("/api", medicineRouter)

app.get("/", (req, res) => {
     res.send("Hello, World!");
})

// 404 handler
app.use(notFound)

// Global error handler
app.use(errorHandler)

export default app
