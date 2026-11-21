import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/globalErrorHandler";
import { notFound } from "./middlewares/notFound";
import router from "./routes";
import { envVars } from './config/env';

const app: Application = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(cors({
     origin: function (origin, callback) {
          const envFrontend = envVars.FRONTEND_URL ? envVars.FRONTEND_URL.trim() : "";
          const allowedOrigins = [
               envFrontend,
               "http://localhost:3000",
               "http://localhost:3001",
               "http://localhost:5173",
               "https://sandbox.sslcommerz.com",
               "https://securepay.sslcommerz.com",
          ];

          if (!origin) return callback(null, true);

          if (
               allowedOrigins.includes(origin) ||
               allowedOrigins.includes("*") ||
               origin.endsWith(".vercel.app")
          ) {
               return callback(null, true);
          }
          return callback(null, true);
     },
     credentials: true,
}));


app.use(cookieParser())
app.use(express.json())


app.use("/api", router)

app.get("/", (req: Request, res: Response) => {
     res.send("Hello, World!");
})

app.use(notFound)

app.use(errorHandler)

export default app
