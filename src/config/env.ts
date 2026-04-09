import dotenv from "dotenv";
import status from "http-status";
import AppError from "../errorHelpers/AppError";

dotenv.config();

interface EnvConfig {
     NODE_ENV: string;
     PORT: string;
     DATABASE_URL: string;
     JWT_SECRET: string;
     FRONTEND_URL: string;
     BACKEND_URL:string;
     CLOUDINARY: {
          CLOUDINARY_CLOUD_NAME: string;
          CLOUDINARY_API_KEY: string;
          CLOUDINARY_API_SECRET: string;
     },
     SSLCOMMERZ: {
          SSL_STORE_ID: string;
          SSL_STORE_PASS: string;
          SSL_IS_LIVE: string;
     },
}

const loadEnvVariables = (): EnvConfig => {
     const requireEnvVariable = [
          "NODE_ENV",
          "PORT",
          "DATABASE_URL",
          "JWT_SECRET",
          "FRONTEND_URL",
          "BACKEND_URL",
          'CLOUDINARY_CLOUD_NAME',
          'CLOUDINARY_API_KEY',
          'CLOUDINARY_API_SECRET',
          "SSL_STORE_ID",
          "SSL_STORE_PASS",
          "SSL_IS_LIVE",
     ];

     requireEnvVariable.forEach((variable) => {
          if (!process.env[variable]) {
               // throw new Error(`Environment variable ${variable} is required but not set in .env file.`);
               throw new AppError(
                    status.INTERNAL_SERVER_ERROR,
                    `Environment variable ${variable} is required but not set in .env file.`,
               );
          }
     });

     return {
          NODE_ENV: process.env.NODE_ENV as string,
          PORT: process.env.PORT as string,
          DATABASE_URL: process.env.DATABASE_URL as string,
          JWT_SECRET: process.env.JWT_SECRET as string,
          FRONTEND_URL: process.env.FRONTEND_URL as string,
          BACKEND_URL: process.env.BACKEND_URL as string,
          CLOUDINARY: {
               CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
               CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
               CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
          },
          SSLCOMMERZ: {
               SSL_STORE_ID: process.env.SSL_STORE_ID as string,
               SSL_STORE_PASS: process.env.SSL_STORE_PASS as string,
               SSL_IS_LIVE: process.env.SSL_IS_LIVE as string,
          },
     };
};

export const envVars = loadEnvVariables();
