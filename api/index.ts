import type { Request, Response } from "express";
import app from "../src/app";

export default async function handler(req: Request, res: Response) {
     try {
          return new Promise((resolve, reject) => {
               app(req, res);
               res.on("finish", resolve);
               res.on("close", resolve);
               res.on("error", reject);
          });
     } catch (error: any) {
          console.error("Vercel Serverless Function Error:", error);
          return res.status(500).json({
               statusCode: 500,
               message: "Internal Server Initialization Error",
               error: error?.message || String(error),
          });
     }
}
