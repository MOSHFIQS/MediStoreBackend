import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/globalErrorHandler";
import { notFound } from "./middlewares/notFound";
import router from "./routes";

const app: Application = express();

app.use(cors({
     origin: process.env.APP_URL || "http://localhost:3000",
     credentials: true 
}))

app.use(cookieParser())
app.use(express.json())

// Routes
app.use("/api", router)

app.get("/", (req : Request, res : Response) => {
     res.send("Hello, World!");
})

app.use(notFound)

app.use(errorHandler)

export default app
