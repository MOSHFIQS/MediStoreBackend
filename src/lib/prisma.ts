import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";
import { envVars } from "../config/env";
import { Pool } from "pg";

const isLocal =
     !envVars.DATABASE_URL ||
     envVars.DATABASE_URL.includes("localhost") ||
     envVars.DATABASE_URL.includes("127.0.0.1");

const pool = new Pool({
     connectionString: envVars.DATABASE_URL,
     ssl: isLocal ? false : { rejectUnauthorized: false },
     max: process.env.VERCEL ? 2 : 10,
     idleTimeoutMillis: 30000,
     connectionTimeoutMillis: 10000,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export { prisma };
