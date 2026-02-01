import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/globalErrorHandler";
import { notFound } from "./middlewares/notFound";
import router from "./routes";

const app: Application = express();

app.use(cors({
     origin: function (origin, callback) {
          const allowedOrigins = [
               process.env.LOCAL_CLIENT_URL,
               process.env.PROD_CLIENT_URL,
          ];

          if (!origin) return callback(null, true);

          if (allowedOrigins.includes(origin)) {
               callback(null, true);
          } else {
               callback(new Error("Not allowed by CORS"));
          }
     },
     credentials: true,
}));


app.use(cookieParser())
app.use(express.json())


app.use("/api", router)

app.get("/", (req : Request, res : Response) => {
     res.send("Hello, World!");
})

app.use(notFound)

app.use(errorHandler)

export default app
