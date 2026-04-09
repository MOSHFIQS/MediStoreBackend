// src/app.ts
import express2 from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// src/middlewares/globalErrorHandler.ts
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : void 0
  });
}
var globalErrorHandler_default = errorHandler;

// src/middlewares/notFound.ts
function notFound(req, res) {
  res.status(404).json({
    message: "Route not found!",
    path: req.originalUrl,
    date: Date()
  });
}

// src/routes/index.ts
import { Router as Router14 } from "express";

// src/modules/auth/auth.route.ts
import express from "express";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": 'model Address {\n  id         String  @id @default(uuid())\n  userId     String\n  user       User    @relation(fields: [userId], references: [id], onDelete: Cascade)\n  label      String? // e.g. "Home", "Office"\n  line1      String\n  line2      String?\n  city       String\n  district   String\n  postalCode String?\n  isDefault  Boolean @default(false)\n\n  orders Order[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("addresses")\n}\n\nmodel AuditLog {\n  id        String  @id @default(uuid())\n  userId    String?\n  user      User?   @relation(fields: [userId], references: [id])\n  action    String // ORDER_CANCELLED, PAYMENT_REFUNDED, USER_BANNED...\n  entity    String // Order, User, Medicine...\n  entityId  String\n  oldValue  Json?\n  newValue  Json?\n  ipAddress String?\n\n  createdAt DateTime @default(now())\n\n  @@map("audit_logs")\n}\n\nmodel User {\n  id       String     @id @default(uuid())\n  name     String\n  email    String     @unique\n  password String\n  image    String?\n  phone    String?\n  role     Role       @default(CUSTOMER)\n  status   UserStatus @default(ACTIVE)\n\n  isEmailVerified Boolean   @default(false)\n  emailVerifiedAt DateTime?\n  lastLoginAt     DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  medicines     Medicine[]     @relation("SellerMedicines")\n  orders        Order[]        @relation("CustomerOrders")\n  reviews       Review[]\n  addresses     Address[]\n  notifications Notification[]\n  auditLogs     AuditLog[]\n\n  @@map("users")\n}\n\n// model Category {\n//      id          String     @id @default(uuid())\n//      name        String     @unique\n//      slug        String     @unique\n//      description String?\n//      image       String?\n//      parentId    String?\n//      parent      Category?  @relation("SubCategories", fields: [parentId], references: [id])\n//      children    Category[] @relation("SubCategories")\n//      medicines   Medicine[]\n\n//      createdAt DateTime @default(now())\n//      updatedAt DateTime @updatedAt\n\n//      @@map("categories")\n// }\n\nmodel Category {\n  id          String     @id @default(uuid())\n  name        String     @unique\n  description String?\n  image       String?\n  medicines   Medicine[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("categories")\n}\n\nmodel Coupon {\n  id             String    @id @default(uuid())\n  code           String    @unique\n  description    String?\n  discountType   String // PERCENTAGE | FIXED\n  discountValue  Float\n  minOrderAmount Float?\n  maxDiscount    Float?\n  usageLimit     Int?\n  usedCount      Int       @default(0)\n  isActive       Boolean   @default(true)\n  expiresAt      DateTime?\n\n  orders Order[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("coupons")\n}\n\nenum Role {\n  CUSTOMER\n  SELLER\n  ADMIN\n}\n\nenum UserStatus {\n  ACTIVE\n  BANNED\n  SUSPENDED\n}\n\nenum OrderStatus {\n  PLACED\n  CONFIRMED\n  PROCESSING\n  SHIPPED\n  DELIVERED\n  CANCELLED\n  REFUNDED\n}\n\nenum PaymentStatus {\n  PENDING\n  INITIATED\n  SUCCESS\n  FAILED\n  CANCELLED\n  REFUNDED\n}\n\nenum PaymentMethod {\n  SSLCOMMERZ\n  CASH_ON_DELIVERY\n  BANK_TRANSFER\n}\n\nenum PrescriptionStatus {\n  PENDING\n  APPROVED\n  REJECTED\n}\n\nenum NotificationType {\n  ORDER_UPDATE\n  PAYMENT_UPDATE\n  PRESCRIPTION_STATUS\n  SYSTEM\n  PROMOTION\n}\n\nmodel Medicine {\n  id            String   @id @default(uuid())\n  name          String\n  genericName   String?\n  slug          String   @unique\n  description   String\n  price         Float\n  discountPrice Float?\n  stock         Int      @default(0)\n  images        String[] // additional gallery images\n  manufacturer  String?\n  brand         String?\n  dosageForm    String? // Tablet, Syrup, Injection...\n  strength      String? // 500mg, 5ml...\n  unit          String   @default("piece")\n  isActive      Boolean  @default(true)\n  sku           String?  @unique\n\n  categoryId String\n  category   Category @relation(fields: [categoryId], references: [id])\n\n  sellerId String\n  seller   User   @relation("SellerMedicines", fields: [sellerId], references: [id])\n\n  reviews    Review[]\n  orderItems OrderItem[]\n  batches    MedicineBatch[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("medicines")\n}\n\nmodel MedicineBatch {\n  id          String   @id @default(uuid())\n  medicineId  String\n  medicine    Medicine @relation(fields: [medicineId], references: [id], onDelete: Cascade)\n  batchNumber String\n  quantity    Int\n  expiryDate  DateTime\n  costPrice   Float\n  isActive    Boolean  @default(true)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("medicine_batches")\n}\n\nmodel Notification {\n  id      String           @id @default(uuid())\n  userId  String\n  user    User             @relation(fields: [userId], references: [id], onDelete: Cascade)\n  type    NotificationType\n  title   String\n  message String\n  isRead  Boolean          @default(false)\n  meta    Json? // extra data, e.g. { orderId, paymentId }\n\n  createdAt DateTime @default(now())\n\n  @@map("notifications")\n}\n\nmodel Order {\n  id         String @id @default(uuid())\n  customerId String\n  customer   User   @relation("CustomerOrders", fields: [customerId], references: [id])\n\n  addressId String?\n  address   Address? @relation(fields: [addressId], references: [id])\n\n  // Snapshot address in case Address is deleted later\n  addressSnapshot Json?\n\n  couponId       String?\n  coupon         Coupon? @relation(fields: [couponId], references: [id])\n  couponDiscount Float   @default(0)\n\n  status      OrderStatus @default(PLACED)\n  subtotal    Float\n  shippingFee Float       @default(0)\n  tax         Float       @default(0)\n  totalPrice  Float\n  notes       String?\n\n  items   OrderItem[]\n  payment Payment?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("orders")\n}\n\nmodel OrderItem {\n  id         String   @id @default(uuid())\n  orderId    String\n  order      Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)\n  medicineId String\n  medicine   Medicine @relation(fields: [medicineId], references: [id])\n\n  // Snapshot at time of purchase\n  medicineName  String\n  medicineImage String?\n  quantity      Int\n  unitPrice     Float\n  totalPrice    Float\n\n  @@map("order_items")\n}\n\nmodel Payment {\n  id      String @id @default(uuid())\n  orderId String @unique\n  order   Order  @relation(fields: [orderId], references: [id])\n\n  method   PaymentMethod @default(SSLCOMMERZ)\n  status   PaymentStatus @default(PENDING)\n  amount   Float\n  currency String        @default("BDT")\n\n  // SSLCommerz specific fields\n  tranId          String? @unique // your generated transaction ID sent to SSLCommerz\n  sessionKey      String? // returned by SSLCommerz on init\n  valId           String? // returned on successful IPN/redirect\n  bankTranId      String? // bank-level transaction ID\n  cardType        String? // VISA, MASTER, bKash, Nagad...\n  cardNo          String? // masked card number\n  storeAmount     Float? // amount after SSLCommerz fee deduction\n  currency_type   String? // currency type returned\n  currency_amount Float?\n  currency_rate   Float?\n  gatewayFee      Float?\n\n  // IPN raw payload (store for audit/reconciliation)\n  ipnPayload Json?\n\n  // Refund\n  refundAmount Float?\n  refundedAt   DateTime?\n  refundRef    String?\n\n  initiatedAt DateTime?\n  paidAt      DateTime?\n  failedAt    DateTime?\n\n  logs PaymentLog[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("payments")\n}\n\nmodel PaymentLog {\n  id        String  @id @default(uuid())\n  paymentId String\n  payment   Payment @relation(fields: [paymentId], references: [id], onDelete: Cascade)\n\n  event      String // INITIATED, IPN_RECEIVED, SUCCESS, FAILED, REFUND_REQUESTED...\n  status     String\n  rawPayload Json? // raw data from SSLCommerz at this event\n  ipAddress  String?\n  note       String?\n\n  createdAt DateTime @default(now())\n\n  @@map("payment_logs")\n}\n\nmodel Review {\n  id                 String  @id @default(uuid())\n  rating             Int // 1\u20135\n  title              String?\n  comment            String\n  isVerifiedPurchase Boolean @default(false)\n\n  userId     String\n  user       User     @relation(fields: [userId], references: [id])\n  medicineId String\n  medicine   Medicine @relation(fields: [medicineId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("reviews")\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"Address":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AddressToUser"},{"name":"label","kind":"scalar","type":"String"},{"name":"line1","kind":"scalar","type":"String"},{"name":"line2","kind":"scalar","type":"String"},{"name":"city","kind":"scalar","type":"String"},{"name":"district","kind":"scalar","type":"String"},{"name":"postalCode","kind":"scalar","type":"String"},{"name":"isDefault","kind":"scalar","type":"Boolean"},{"name":"orders","kind":"object","type":"Order","relationName":"AddressToOrder"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"addresses"},"AuditLog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AuditLogToUser"},{"name":"action","kind":"scalar","type":"String"},{"name":"entity","kind":"scalar","type":"String"},{"name":"entityId","kind":"scalar","type":"String"},{"name":"oldValue","kind":"scalar","type":"Json"},{"name":"newValue","kind":"scalar","type":"Json"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"audit_logs"},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"isEmailVerified","kind":"scalar","type":"Boolean"},{"name":"emailVerifiedAt","kind":"scalar","type":"DateTime"},{"name":"lastLoginAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"medicines","kind":"object","type":"Medicine","relationName":"SellerMedicines"},{"name":"orders","kind":"object","type":"Order","relationName":"CustomerOrders"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"addresses","kind":"object","type":"Address","relationName":"AddressToUser"},{"name":"notifications","kind":"object","type":"Notification","relationName":"NotificationToUser"},{"name":"auditLogs","kind":"object","type":"AuditLog","relationName":"AuditLogToUser"}],"dbName":"users"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"medicines","kind":"object","type":"Medicine","relationName":"CategoryToMedicine"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"categories"},"Coupon":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"code","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"discountType","kind":"scalar","type":"String"},{"name":"discountValue","kind":"scalar","type":"Float"},{"name":"minOrderAmount","kind":"scalar","type":"Float"},{"name":"maxDiscount","kind":"scalar","type":"Float"},{"name":"usageLimit","kind":"scalar","type":"Int"},{"name":"usedCount","kind":"scalar","type":"Int"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"orders","kind":"object","type":"Order","relationName":"CouponToOrder"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"coupons"},"Medicine":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"genericName","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Float"},{"name":"discountPrice","kind":"scalar","type":"Float"},{"name":"stock","kind":"scalar","type":"Int"},{"name":"images","kind":"scalar","type":"String"},{"name":"manufacturer","kind":"scalar","type":"String"},{"name":"brand","kind":"scalar","type":"String"},{"name":"dosageForm","kind":"scalar","type":"String"},{"name":"strength","kind":"scalar","type":"String"},{"name":"unit","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"sku","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToMedicine"},{"name":"sellerId","kind":"scalar","type":"String"},{"name":"seller","kind":"object","type":"User","relationName":"SellerMedicines"},{"name":"reviews","kind":"object","type":"Review","relationName":"MedicineToReview"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"MedicineToOrderItem"},{"name":"batches","kind":"object","type":"MedicineBatch","relationName":"MedicineToMedicineBatch"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"medicines"},"MedicineBatch":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"medicine","kind":"object","type":"Medicine","relationName":"MedicineToMedicineBatch"},{"name":"batchNumber","kind":"scalar","type":"String"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"expiryDate","kind":"scalar","type":"DateTime"},{"name":"costPrice","kind":"scalar","type":"Float"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"medicine_batches"},"Notification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"NotificationToUser"},{"name":"type","kind":"enum","type":"NotificationType"},{"name":"title","kind":"scalar","type":"String"},{"name":"message","kind":"scalar","type":"String"},{"name":"isRead","kind":"scalar","type":"Boolean"},{"name":"meta","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"notifications"},"Order":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"customer","kind":"object","type":"User","relationName":"CustomerOrders"},{"name":"addressId","kind":"scalar","type":"String"},{"name":"address","kind":"object","type":"Address","relationName":"AddressToOrder"},{"name":"addressSnapshot","kind":"scalar","type":"Json"},{"name":"couponId","kind":"scalar","type":"String"},{"name":"coupon","kind":"object","type":"Coupon","relationName":"CouponToOrder"},{"name":"couponDiscount","kind":"scalar","type":"Float"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"subtotal","kind":"scalar","type":"Float"},{"name":"shippingFee","kind":"scalar","type":"Float"},{"name":"tax","kind":"scalar","type":"Float"},{"name":"totalPrice","kind":"scalar","type":"Float"},{"name":"notes","kind":"scalar","type":"String"},{"name":"items","kind":"object","type":"OrderItem","relationName":"OrderToOrderItem"},{"name":"payment","kind":"object","type":"Payment","relationName":"OrderToPayment"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"orders"},"OrderItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToOrderItem"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"medicine","kind":"object","type":"Medicine","relationName":"MedicineToOrderItem"},{"name":"medicineName","kind":"scalar","type":"String"},{"name":"medicineImage","kind":"scalar","type":"String"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"unitPrice","kind":"scalar","type":"Float"},{"name":"totalPrice","kind":"scalar","type":"Float"}],"dbName":"order_items"},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToPayment"},{"name":"method","kind":"enum","type":"PaymentMethod"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"currency","kind":"scalar","type":"String"},{"name":"tranId","kind":"scalar","type":"String"},{"name":"sessionKey","kind":"scalar","type":"String"},{"name":"valId","kind":"scalar","type":"String"},{"name":"bankTranId","kind":"scalar","type":"String"},{"name":"cardType","kind":"scalar","type":"String"},{"name":"cardNo","kind":"scalar","type":"String"},{"name":"storeAmount","kind":"scalar","type":"Float"},{"name":"currency_type","kind":"scalar","type":"String"},{"name":"currency_amount","kind":"scalar","type":"Float"},{"name":"currency_rate","kind":"scalar","type":"Float"},{"name":"gatewayFee","kind":"scalar","type":"Float"},{"name":"ipnPayload","kind":"scalar","type":"Json"},{"name":"refundAmount","kind":"scalar","type":"Float"},{"name":"refundedAt","kind":"scalar","type":"DateTime"},{"name":"refundRef","kind":"scalar","type":"String"},{"name":"initiatedAt","kind":"scalar","type":"DateTime"},{"name":"paidAt","kind":"scalar","type":"DateTime"},{"name":"failedAt","kind":"scalar","type":"DateTime"},{"name":"logs","kind":"object","type":"PaymentLog","relationName":"PaymentToPaymentLog"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"payments"},"PaymentLog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"paymentId","kind":"scalar","type":"String"},{"name":"payment","kind":"object","type":"Payment","relationName":"PaymentToPaymentLog"},{"name":"event","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"},{"name":"rawPayload","kind":"scalar","type":"Json"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"note","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"payment_logs"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"title","kind":"scalar","type":"String"},{"name":"comment","kind":"scalar","type":"String"},{"name":"isVerifiedPurchase","kind":"scalar","type":"Boolean"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"medicine","kind":"object","type":"Medicine","relationName":"MedicineToReview"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"reviews"}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/enums.ts
var Role = {
  CUSTOMER: "CUSTOMER",
  SELLER: "SELLER",
  ADMIN: "ADMIN"
};
var UserStatus = {
  ACTIVE: "ACTIVE",
  BANNED: "BANNED",
  SUSPENDED: "SUSPENDED"
};
var OrderStatus = {
  PLACED: "PLACED",
  CONFIRMED: "CONFIRMED",
  PROCESSING: "PROCESSING",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
  REFUNDED: "REFUNDED"
};
var PaymentStatus = {
  PENDING: "PENDING",
  INITIATED: "INITIATED",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED",
  REFUNDED: "REFUNDED"
};

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/config/env.ts
import dotenv from "dotenv";
import status from "http-status";

// src/errorHelpers/AppError.ts
var AppError = class extends Error {
  statusCode;
  constructor(statusCode, message, stack = "") {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};
var AppError_default = AppError;

// src/config/env.ts
dotenv.config();
var loadEnvVariables = () => {
  const requireEnvVariable = [
    "NODE_ENV",
    "PORT",
    "DATABASE_URL",
    "JWT_SECRET",
    "FRONTEND_URL",
    "BACKEND_URL",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "SSL_STORE_ID",
    "SSL_STORE_PASS",
    "SSL_IS_LIVE"
  ];
  requireEnvVariable.forEach((variable) => {
    if (!process.env[variable]) {
      throw new AppError_default(
        status.INTERNAL_SERVER_ERROR,
        `Environment variable ${variable} is required but not set in .env file.`
      );
    }
  });
  return {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    FRONTEND_URL: process.env.FRONTEND_URL,
    BACKEND_URL: process.env.BACKEND_URL,
    CLOUDINARY: {
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
    },
    SSLCOMMERZ: {
      SSL_STORE_ID: process.env.SSL_STORE_ID,
      SSL_STORE_PASS: process.env.SSL_STORE_PASS,
      SSL_IS_LIVE: process.env.SSL_IS_LIVE
    }
  };
};
var envVars = loadEnvVariables();

// src/lib/prisma.ts
var connectionString = `${envVars.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/modules/auth/auth.service.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
var JWT_SECRET = envVars.JWT_SECRET || "supersecret";
var signUpUser = async (payload) => {
  const { name, email, password, role, image } = payload;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("Email already exists");
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      role: role === "SELLER" ? "SELLER" : "CUSTOMER",
      image
    }
  });
  const token = jwt.sign(
    { id: user.id, role: user.role, email: user.email, status: user.status },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
  const { password: _, ...safeUser } = user;
  console.log(token);
  return { user: safeUser, token };
};
var signInUser = async (payload) => {
  const { email, password } = payload;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");
  if (user.status === "BANNED") {
    throw new Error("Your account has been banned");
  }
  if (user.status === "SUSPENDED") {
    throw new Error("Your account is suspended. Contact support");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: /* @__PURE__ */ new Date() }
  });
  const token = jwt.sign(
    { id: updatedUser.id, role: updatedUser.role, email: updatedUser.email, status: updatedUser.status },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
  const { password: _, ...safeUser } = updatedUser;
  return { user: safeUser, token };
};
var authService = { signUpUser, signInUser };

// src/utils/sendResponse.ts
var sendResponse = (res, payload) => {
  const { statusCode, success, message, data } = payload;
  return res.status(statusCode).json({
    success,
    message,
    data
  });
};
var sendResponse_default = sendResponse;

// src/modules/auth/auth.controller.ts
import status2 from "http-status";
var signUpUser2 = async (req, res, next) => {
  try {
    const result = await authService.signUpUser(req.body);
    sendResponse_default(res, {
      statusCode: status2.CREATED,
      success: true,
      message: "User registered successfully",
      // data: { user: result.user }
      data: result
    });
  } catch (err) {
    next(err);
  }
};
var signInUser2 = async (req, res, next) => {
  try {
    const result = await authService.signInUser(req.body);
    sendResponse_default(res, {
      statusCode: status2.OK,
      success: true,
      message: "Login successful",
      // data: { user: result.user }
      data: result
    });
  } catch (err) {
    next(err);
  }
};
var authController = { signUpUser: signUpUser2, signInUser: signInUser2 };

// src/modules/auth/auth.route.ts
var router = express.Router();
router.post(
  "/register",
  authController.signUpUser
);
router.post(
  "/login",
  authController.signInUser
);
var authRouter = router;

// src/modules/medicine/medicine.route.ts
import { Router as Router2 } from "express";

// src/modules/medicine/medicine.controller.ts
import status3 from "http-status";

// src/modules/medicine/medicine.service.ts
var ACTIVE_ORDER_STATUSES = [
  OrderStatus.PLACED,
  OrderStatus.CONFIRMED,
  OrderStatus.PROCESSING,
  OrderStatus.SHIPPED
];
var createMedicine = async (sellerId, payload) => {
  const slug = payload.name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
  return prisma.medicine.create({
    data: { ...payload, sellerId, slug }
  });
};
var updateMedicine = async (id, sellerId, payload) => {
  const medicine = await prisma.medicine.findFirst({ where: { id, sellerId } });
  if (!medicine) throw new Error("Medicine not found or unauthorized");
  return prisma.medicine.update({ where: { id }, data: payload });
};
var deleteMedicine = async (id, sellerId) => {
  const medicine = await prisma.medicine.findFirst({
    where: { id, sellerId },
    select: { id: true, name: true, isActive: true, stock: true }
  });
  if (!medicine) throw new Error("Medicine not found or unauthorized");
  if (!medicine.isActive) throw new Error("Medicine is already inactive");
  const activeOrderItem = await prisma.orderItem.findFirst({
    where: {
      medicineId: id,
      order: {
        status: { in: ACTIVE_ORDER_STATUSES }
      }
    },
    select: {
      orderId: true,
      order: {
        select: { status: true }
      }
    }
  });
  if (activeOrderItem) {
    throw new Error(
      `Cannot delete "${medicine.name}" \u2014 it is part of an active order (status: ${activeOrderItem.order.status}). Wait until all orders containing this medicine are delivered or cancelled.`
    );
  }
  return prisma.medicine.update({
    where: { id },
    data: {
      isActive: false,
      stock: 0
    }
  });
};
var getSellerMedicines = async (sellerId) => {
  return prisma.medicine.findMany({
    where: { sellerId },
    include: { category: true },
    orderBy: { createdAt: "desc" }
  });
};
var getAllMedicines = async (query) => {
  const page = parseInt(query.page || "1");
  const limit = parseInt(query.limit || "12");
  const skip = (page - 1) * limit;
  const where = { isActive: true };
  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: "insensitive" } },
      { genericName: { contains: query.search, mode: "insensitive" } },
      { manufacturer: { contains: query.search, mode: "insensitive" } }
    ];
  }
  if (query.categoryId) where.categoryId = query.categoryId;
  if (query.minPrice || query.maxPrice) {
    where.price = {};
    if (query.minPrice) where.price.gte = parseFloat(query.minPrice);
    if (query.maxPrice) where.price.lte = parseFloat(query.maxPrice);
  }
  const [data, total] = await Promise.all([
    prisma.medicine.findMany({
      where,
      include: { category: true, seller: { select: { id: true, name: true } } },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" }
    }),
    prisma.medicine.count({ where })
  ]);
  return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
};
var getMedicineById = async (id) => {
  const medicine = await prisma.medicine.findFirst({
    where: { id, isActive: true },
    include: {
      category: true,
      seller: { select: { id: true, name: true, phone: true } },
      reviews: {
        include: { user: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: "desc" },
        take: 10
      },
      batches: { where: { isActive: true }, orderBy: { expiryDate: "asc" } }
    }
  });
  if (!medicine) throw new Error("Medicine not found");
  return medicine;
};
var medicineService = {
  createMedicine,
  updateMedicine,
  deleteMedicine,
  getSellerMedicines,
  getAllMedicines,
  getMedicineById
};

// src/modules/medicine/medicine.controller.ts
var createMedicine2 = async (req, res, next) => {
  try {
    const result = await medicineService.createMedicine(req.user.id, req.body);
    sendResponse_default(res, { statusCode: status3.CREATED, success: true, message: "Medicine created", data: result });
  } catch (e) {
    next(e);
  }
};
var updateMedicine2 = async (req, res, next) => {
  try {
    const result = await medicineService.updateMedicine(req.params.id, req.user.id, req.body);
    sendResponse_default(res, { statusCode: status3.OK, success: true, message: "Medicine updated", data: result });
  } catch (e) {
    next(e);
  }
};
var deleteMedicine2 = async (req, res, next) => {
  try {
    await medicineService.deleteMedicine(req.params.id, req.user.id);
    sendResponse_default(res, { statusCode: status3.OK, success: true, message: "Medicine deleted", data: null });
  } catch (e) {
    next(e);
  }
};
var getSellerMedicines2 = async (req, res, next) => {
  try {
    const result = await medicineService.getSellerMedicines(req.user.id);
    sendResponse_default(res, { statusCode: status3.OK, success: true, message: "Seller medicines fetched", data: result });
  } catch (e) {
    next(e);
  }
};
var getAllMedicines2 = async (req, res, next) => {
  try {
    const result = await medicineService.getAllMedicines(req.query);
    sendResponse_default(res, { statusCode: status3.OK, success: true, message: "Medicines fetched", data: result });
  } catch (e) {
    next(e);
  }
};
var getMedicineById2 = async (req, res, next) => {
  try {
    const result = await medicineService.getMedicineById(req.params.id);
    sendResponse_default(res, { statusCode: status3.OK, success: true, message: "Medicine fetched", data: result });
  } catch (e) {
    next(e);
  }
};
var medicineController = {
  createMedicine: createMedicine2,
  updateMedicine: updateMedicine2,
  deleteMedicine: deleteMedicine2,
  getSellerMedicines: getSellerMedicines2,
  getAllMedicines: getAllMedicines2,
  getMedicineById: getMedicineById2
};

// src/middlewares/auth.ts
import jwt2 from "jsonwebtoken";
import status4 from "http-status";
var auth = (...allowedRoles) => {
  return (req, res, next) => {
    const token = req.cookies.token;
    console.log("token", token);
    if (!token) {
      return res.status(status4.UNAUTHORIZED).json({
        success: false,
        message: "Not logged in"
      });
    }
    try {
      const decoded = jwt2.verify(token, envVars.JWT_SECRET);
      if (decoded.status === UserStatus.BANNED) {
        return res.status(status4.FORBIDDEN).json({
          success: false,
          message: "Your account has been banned"
        });
      }
      req.user = decoded;
      if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
        return res.status(status4.FORBIDDEN).json({
          success: false,
          message: "You are not authorized"
        });
      }
      next();
    } catch {
      return res.status(status4.UNAUTHORIZED).json({
        success: false,
        message: "Invalid token"
      });
    }
  };
};

// src/modules/medicine/medicine.route.ts
var router2 = Router2();
router2.post("/seller", auth(Role.SELLER), medicineController.createMedicine);
router2.put("/seller/:id", auth(Role.SELLER), medicineController.updateMedicine);
router2.delete("/seller/:id", auth(Role.SELLER), medicineController.deleteMedicine);
router2.get("/seller", auth(Role.SELLER), medicineController.getSellerMedicines);
router2.get("/", medicineController.getAllMedicines);
router2.get("/:id", medicineController.getMedicineById);
var medicineRouter = router2;

// src/modules/order/order.route.ts
import { Router as Router3 } from "express";

// src/modules/order/order.controller.ts
import status5 from "http-status";

// src/modules/order/order.service.ts
var createOrder = async (customerId, payload, ip) => {
  const {
    items,
    addressId,
    addressSnapshot,
    couponCode,
    notes,
    shippingFee = 0
  } = payload;
  if (!items || items.length === 0) {
    throw new Error("Order must contain at least one item");
  }
  const uniqueIds = new Set(items.map((i) => i.medicineId));
  if (uniqueIds.size !== items.length) {
    throw new Error("Duplicate medicines in order are not allowed");
  }
  if (!addressId && !addressSnapshot) {
    throw new Error("Shipping address is required");
  }
  if (shippingFee < 0) {
    throw new Error("Invalid shipping fee");
  }
  const medicineIds = items.map((i) => i.medicineId);
  const [medicines, couponRaw] = await Promise.all([
    prisma.medicine.findMany({
      where: { id: { in: medicineIds }, isActive: true }
    }),
    couponCode ? prisma.coupon.findFirst({
      where: {
        code: couponCode,
        isActive: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: /* @__PURE__ */ new Date() } }
        ]
      }
    }) : null
  ]);
  if (medicines.length !== items.length) {
    throw new Error("One or more medicines not found or inactive");
  }
  for (const item of items) {
    if (item.quantity <= 0) throw new Error("Invalid quantity");
    const med = medicines.find((m) => m.id === item.medicineId);
    if (med.stock < item.quantity) {
      throw new Error(`Insufficient stock for ${med.name}`);
    }
  }
  let subtotal = 0;
  const orderItemsData = items.map((item) => {
    const med = medicines.find((m) => m.id === item.medicineId);
    const unitPrice = med.discountPrice ?? med.price;
    const totalPrice2 = unitPrice * item.quantity;
    subtotal += totalPrice2;
    return {
      medicineId: item.medicineId,
      medicineName: med.name,
      medicineImage: med.image,
      quantity: item.quantity,
      unitPrice,
      totalPrice: totalPrice2
    };
  });
  let couponId;
  let couponDiscount = 0;
  if (couponCode) {
    const coupon = couponRaw;
    if (!coupon) throw new Error("Invalid or expired coupon");
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      throw new Error("Coupon usage limit reached");
    }
    if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
      throw new Error(`Minimum order amount is \u09F3${coupon.minOrderAmount}`);
    }
    couponId = coupon.id;
    couponDiscount = coupon.discountType === "PERCENTAGE" ? Math.min(
      subtotal * coupon.discountValue / 100,
      coupon.maxDiscount ?? Infinity
    ) : coupon.discountValue;
  }
  const tax = 0;
  let totalPrice = subtotal + shippingFee + tax - couponDiscount;
  if (totalPrice < 0) totalPrice = 0;
  const order = await prisma.$transaction(
    async (tx) => {
      const stockChecks = await Promise.all(
        items.map(
          (item) => tx.medicine.findUnique({
            where: { id: item.medicineId },
            select: { stock: true, name: true }
          })
        )
      );
      for (let i = 0; i < items.length; i++) {
        const med = stockChecks[i];
        if (!med || med.stock < items[i].quantity) {
          throw new Error(`Stock changed for ${med?.name || "item"}`);
        }
      }
      const newOrder = await tx.order.create({
        data: {
          customerId,
          ...addressId !== void 0 && { addressId: addressId ?? null },
          ...addressSnapshot !== void 0 && { addressSnapshot },
          ...couponId !== void 0 && { couponId: couponId ?? null },
          ...notes !== void 0 && { notes: notes ?? null },
          couponDiscount,
          subtotal,
          shippingFee,
          tax,
          totalPrice,
          items: { create: orderItemsData }
        },
        include: { items: true }
      });
      await Promise.all([
        ...items.map(
          (item) => tx.medicine.update({
            where: {
              id: item.medicineId,
              stock: { gte: item.quantity }
              // prevents oversell
            },
            data: { stock: { decrement: item.quantity } }
          })
        ),
        couponId ? tx.coupon.update({
          where: { id: couponId },
          data: { usedCount: { increment: 1 } }
        }) : Promise.resolve(),
        tx.payment.create({
          data: {
            orderId: newOrder.id,
            amount: totalPrice,
            status: "PENDING",
            initiatedAt: /* @__PURE__ */ new Date()
          }
        })
      ]);
      return newOrder;
    },
    {
      maxWait: 5e3,
      // wait up to 5s to acquire a connection
      timeout: 15e3
      // allow up to 15s for the transaction to complete
    }
  );
  await Promise.all([
    prisma.auditLog.create({
      data: {
        userId: customerId,
        action: "ORDER_CREATED",
        entity: "Order",
        entityId: order.id,
        newValue: { totalPrice },
        ipAddress: ip
      }
    }),
    prisma.notification.create({
      data: {
        userId: customerId,
        type: "ORDER_UPDATE",
        title: "Order Placed",
        message: `Your order #${order.id.slice(0, 8)} has been placed successfully`,
        meta: { orderId: order.id }
      }
    })
  ]).catch((err) => {
    console.error("Post-order side effects failed:", err);
  });
  return order;
};
var getMyOrders = async (customerId) => {
  return prisma.order.findMany({
    where: { customerId },
    include: {
      items: true,
      payment: { select: { status: true, method: true, paidAt: true } }
    },
    orderBy: { createdAt: "desc" }
  });
};
var getOrderById = async (id, customerId) => {
  const order = await prisma.order.findFirst({
    where: { id, customerId },
    include: {
      items: { include: { medicine: { select: { id: true, name: true, image: true } } } },
      address: true,
      payment: true,
      coupon: true
    }
  });
  if (!order) throw new Error("Order not found");
  return order;
};
var cancelOrder = async (id, customerId, ip) => {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findFirst({
      where: { id, customerId },
      include: { payment: true }
    });
    if (!order) throw new Error("Order not found");
    if (order.status === "CANCELLED") throw new Error("Order already cancelled");
    if (order.status !== "PLACED") throw new Error("Order cannot be cancelled at this stage");
    if (order.payment) {
      const { status: paymentStatus } = order.payment;
      if (paymentStatus === "SUCCESS") throw new Error("Paid order cannot be cancelled. Request a refund.");
      if (paymentStatus === "REFUNDED") throw new Error("Order already refunded");
    }
    const updatedOrder = await tx.order.update({
      where: { id, status: "PLACED" },
      data: { status: "CANCELLED" }
    });
    const orderItems = await tx.orderItem.findMany({ where: { orderId: id } });
    for (const item of orderItems) {
      await tx.medicine.update({
        where: { id: item.medicineId },
        data: { stock: { increment: item.quantity } }
      });
    }
    if (order.payment && order.payment.status !== "SUCCESS") {
      await tx.payment.update({
        where: { id: order.payment.id },
        data: { status: "CANCELLED", failedAt: /* @__PURE__ */ new Date() }
      });
      await tx.paymentLog.create({
        data: {
          paymentId: order.payment.id,
          event: "CANCELLED",
          status: "CANCELLED",
          note: "Order cancelled before payment completion",
          ipAddress: ip
        }
      });
    }
    await tx.auditLog.create({
      data: {
        userId: customerId,
        action: "ORDER_CANCELLED",
        entity: "Order",
        entityId: id,
        oldValue: { status: order.status },
        newValue: { status: "CANCELLED" },
        ipAddress: ip
      }
    });
    await tx.notification.create({
      data: {
        userId: customerId,
        type: "ORDER_UPDATE",
        title: "Order Cancelled",
        message: `Your order #${id.slice(0, 8)} has been cancelled`,
        meta: { orderId: id }
      }
    });
    return updatedOrder;
  });
};
var getSellerOrders = async (sellerId) => {
  return prisma.order.findMany({
    where: { items: { some: { medicine: { sellerId } } } },
    include: {
      items: { where: { medicine: { sellerId } }, include: { medicine: true } },
      customer: { select: { id: true, name: true, email: true, phone: true } },
      address: true,
      payment: { select: { status: true, method: true } }
    },
    orderBy: { createdAt: "desc" }
  });
};
var updateOrderStatus = async (orderId, sellerId, newStatus) => {
  const validTransitions = {
    PLACED: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["PROCESSING", "CANCELLED"],
    PROCESSING: ["SHIPPED", "CANCELLED"],
    SHIPPED: ["DELIVERED"],
    DELIVERED: [],
    CANCELLED: []
  };
  const cancellableStatuses = ["PLACED", "CONFIRMED", "PROCESSING"];
  const notificationMessages = {
    CONFIRMED: {
      title: "Order Confirmed",
      message: `Your order #${orderId.slice(0, 8).toUpperCase()} has been confirmed by the seller.`
    },
    PROCESSING: {
      title: "Order Processing",
      message: `Your order #${orderId.slice(0, 8).toUpperCase()} is now being processed.`
    },
    SHIPPED: {
      title: "Order Shipped",
      message: `Your order #${orderId.slice(0, 8).toUpperCase()} has been shipped and is on its way!`
    },
    DELIVERED: {
      title: "Order Delivered",
      message: `Your order #${orderId.slice(0, 8).toUpperCase()} has been delivered. Enjoy!`
    },
    CANCELLED: {
      title: "Order Cancelled",
      message: `Your order #${orderId.slice(0, 8).toUpperCase()} has been cancelled by the seller.`
    }
  };
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findFirst({
      where: { id: orderId, items: { some: { medicine: { sellerId } } } },
      include: {
        payment: true,
        items: true
      }
    });
    if (!order) throw new Error("Order not found or unauthorized");
    const allowedNext = validTransitions[order.status] ?? [];
    if (!allowedNext.includes(newStatus)) {
      throw new Error(`Cannot move order from ${order.status} to ${newStatus}`);
    }
    if (newStatus === "CANCELLED") {
      if (!cancellableStatuses.includes(order.status)) {
        throw new Error(
          `Order cannot be cancelled once it has been ${order.status.toLowerCase()}`
        );
      }
      if (order.payment?.status === "SUCCESS") {
        throw new Error("Cannot cancel a paid order. Issue a refund instead.");
      }
    }
    const writes = [
      // Always — update order status
      tx.order.update({
        where: { id: orderId },
        data: { status: newStatus }
      }),
      // Always — audit log
      tx.auditLog.create({
        data: {
          userId: sellerId,
          action: "ORDER_STATUS_UPDATED",
          entity: "Order",
          entityId: orderId,
          oldValue: { status: order.status },
          newValue: { status: newStatus }
        }
      }),
      // Always — notify customer if message exists for this status
      ...notificationMessages[newStatus] ? [
        tx.notification.create({
          data: {
            userId: order.customerId,
            type: "ORDER_UPDATE",
            title: notificationMessages[newStatus].title,
            message: notificationMessages[newStatus].message,
            meta: { orderId }
          }
        })
      ] : [],
      // If CANCELLED — restore stock for all items in parallel
      ...newStatus === "CANCELLED" ? order.items.map(
        (item) => tx.medicine.update({
          where: { id: item.medicineId },
          data: { stock: { increment: item.quantity } }
        })
      ) : [],
      // If CANCELLED and payment not already succeeded — cancel payment record
      ...newStatus === "CANCELLED" && order.payment && order.payment.status !== "SUCCESS" ? [
        tx.payment.update({
          where: { id: order.payment.id },
          data: { status: "CANCELLED", failedAt: /* @__PURE__ */ new Date() }
        }),
        tx.paymentLog.create({
          data: {
            paymentId: order.payment.id,
            event: "CANCELLED",
            status: "CANCELLED",
            note: "Order cancelled by seller"
          }
        })
      ] : []
    ];
    const [updatedOrder] = await Promise.all(writes);
    return updatedOrder;
  }, {
    maxWait: 1e4,
    // wait up to 10s for a transaction slot
    timeout: 3e4
    // transaction must complete within 30s
  });
};
var orderService = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getSellerOrders,
  updateOrderStatus
};

// src/modules/order/order.controller.ts
var createOrder2 = async (req, res, next) => {
  try {
    const result = await orderService.createOrder(req.user.id, req.body);
    sendResponse_default(res, { statusCode: status5.CREATED, success: true, message: "Order placed", data: result });
  } catch (e) {
    next(e);
  }
};
var getMyOrders2 = async (req, res, next) => {
  try {
    const result = await orderService.getMyOrders(req.user.id);
    sendResponse_default(res, { statusCode: status5.OK, success: true, message: "Orders fetched", data: result });
  } catch (e) {
    next(e);
  }
};
var getOrderById2 = async (req, res, next) => {
  try {
    const result = await orderService.getOrderById(req.params.id, req.user.id);
    sendResponse_default(res, { statusCode: status5.OK, success: true, message: "Order fetched", data: result });
  } catch (e) {
    next(e);
  }
};
var cancelOrder2 = async (req, res, next) => {
  try {
    const result = await orderService.cancelOrder(req.params.id, req.user.id);
    sendResponse_default(res, { statusCode: status5.OK, success: true, message: "Order cancelled", data: result });
  } catch (e) {
    next(e);
  }
};
var getSellerOrders2 = async (req, res, next) => {
  try {
    const result = await orderService.getSellerOrders(req.user.id);
    sendResponse_default(res, { statusCode: status5.OK, success: true, message: "Seller orders fetched", data: result });
  } catch (e) {
    next(e);
  }
};
var updateOrderStatus2 = async (req, res, next) => {
  try {
    const result = await orderService.updateOrderStatus(req.params.id, req.user.id, req.body.status);
    sendResponse_default(res, { statusCode: status5.OK, success: true, message: "Order status updated", data: result });
  } catch (e) {
    next(e);
  }
};
var orderController = {
  createOrder: createOrder2,
  getMyOrders: getMyOrders2,
  getOrderById: getOrderById2,
  cancelOrder: cancelOrder2,
  getSellerOrders: getSellerOrders2,
  updateOrderStatus: updateOrderStatus2
};

// src/modules/order/order.route.ts
var router3 = Router3();
router3.post("/", auth(Role.CUSTOMER), orderController.createOrder);
router3.get("/", auth(Role.CUSTOMER), orderController.getMyOrders);
router3.get("/seller/my-orders", auth(Role.SELLER), orderController.getSellerOrders);
router3.get("/:id", auth(Role.CUSTOMER), orderController.getOrderById);
router3.patch("/:id", auth(Role.CUSTOMER), orderController.cancelOrder);
router3.patch("/seller/:id", auth(Role.SELLER), orderController.updateOrderStatus);
var orderRouter = router3;

// src/modules/category/category.route.ts
import { Router as Router4 } from "express";

// src/modules/category/category.controller.ts
import status6 from "http-status";

// src/modules/category/category.service.ts
var createCategory = async (payload) => {
  const { name, description, image } = payload;
  const existing = await prisma.category.findFirst({
    where: { name: { equals: name, mode: "insensitive" } }
  });
  if (existing) {
    throw new Error("Category already exists");
  }
  const category = await prisma.category.create({
    data: {
      name,
      description,
      image
    }
  });
  return category;
};
var getAllCategories = async () => {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { medicines: true }
      }
    }
  });
  return categories;
};
var updateCategory = async (id, payload) => {
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) throw new Error("Category not found");
  if (payload.name) {
    const nameExists = await prisma.category.findFirst({
      where: { name: { equals: payload.name, mode: "insensitive" }, NOT: { id } }
    });
    if (nameExists) throw new Error("Category name already exists");
  }
  return prisma.category.update({
    where: { id },
    data: payload
  });
};
var deleteCategory = async (id) => {
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) throw new Error("Category not found");
  return prisma.category.delete({ where: { id } });
};
var getCategoryById = async (id) => {
  const category = await prisma.category.findUnique({
    where: { id }
  });
  if (!category) {
    throw new Error("Category not found");
  }
  return category;
};
var categoryService = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  getCategoryById
};

// src/modules/category/category.controller.ts
var createCategory2 = async (req, res, next) => {
  try {
    const result = await categoryService.createCategory(req.body);
    sendResponse_default(res, {
      statusCode: status6.CREATED,
      success: true,
      message: "Category created successfully",
      data: result
    });
  } catch (err) {
    next(err);
  }
};
var getAllCategories2 = async (req, res, next) => {
  try {
    const categories = await categoryService.getAllCategories();
    sendResponse_default(res, {
      statusCode: status6.OK,
      success: true,
      message: "Categories fetched successfully",
      data: categories
    });
  } catch (err) {
    next(err);
  }
};
var updateCategory2 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await categoryService.updateCategory(id, req.body);
    sendResponse_default(res, {
      statusCode: status6.OK,
      success: true,
      message: "Category updated successfully",
      data: result
    });
  } catch (err) {
    next(err);
  }
};
var deleteCategory2 = async (req, res, next) => {
  try {
    const { id } = req.params;
    await categoryService.deleteCategory(id);
    sendResponse_default(res, {
      statusCode: status6.OK,
      success: true,
      message: "Category deleted successfully",
      data: null
    });
  } catch (err) {
    next(err);
  }
};
var getCategoryById2 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await categoryService.getCategoryById(id);
    sendResponse_default(res, {
      statusCode: status6.OK,
      success: true,
      message: "Category fetched successfully",
      data: category
    });
  } catch (err) {
    next(err);
  }
};
var categoryController = {
  createCategory: createCategory2,
  getAllCategories: getAllCategories2,
  updateCategory: updateCategory2,
  deleteCategory: deleteCategory2,
  getCategoryById: getCategoryById2
};

// src/modules/category/category.route.ts
var router4 = Router4();
router4.get("/", categoryController.getAllCategories);
router4.get("/:id", categoryController.getCategoryById);
router4.post("/", auth(Role.ADMIN), categoryController.createCategory);
router4.put("/:id", auth(Role.ADMIN), categoryController.updateCategory);
router4.delete("/:id", auth(Role.ADMIN), categoryController.deleteCategory);
var categoryRouter = router4;

// src/modules/admin/admin.route.ts
import { Router as Router5 } from "express";

// src/modules/admin/admin.controller.ts
import status7 from "http-status";

// src/modules/audit/audit.service.ts
var log = async (payload) => {
  return prisma.auditLog.create({
    data: {
      action: payload.action,
      entity: payload.entity,
      entityId: payload.entityId,
      userId: payload.userId ?? null,
      oldValue: payload.oldValue ?? null,
      newValue: payload.newValue ?? null,
      ipAddress: payload.ipAddress ?? null
    }
  });
};
var getAuditLogs = async (query) => {
  const page = parseInt(query.page || "1");
  const limit = parseInt(query.limit || "20");
  const skip = (page - 1) * limit;
  const where = {};
  if (query.entity) where.entity = query.entity;
  if (query.entityId) where.entityId = query.entityId;
  if (query.userId) where.userId = query.userId;
  const [data, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      include: { user: { select: { id: true, name: true, email: true, role: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit
    }),
    prisma.auditLog.count({ where })
  ]);
  return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
};
var auditService = { log, getAuditLogs };

// src/modules/admin/admin.service.ts
var getAllUsers = async () => {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      phone: true,
      image: true,
      isEmailVerified: true,
      lastLoginAt: true,
      createdAt: true
    }
  });
};
var updateUserStatus = async (userId, newStatus, adminId, ipAddress) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { status: true, role: true }
  });
  if (!user) throw new Error("User not found");
  if (userId === adminId) {
    throw new Error("You cannot change your own status");
  }
  if (user.role === "ADMIN") {
    throw new Error("You cannot change another admin's status");
  }
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { status: newStatus }
  });
  await auditService.log({
    userId: adminId,
    action: `USER_${newStatus}`,
    entity: "User",
    entityId: userId,
    oldValue: { status: user.status },
    newValue: { status: newStatus },
    ...ipAddress !== void 0 && { ipAddress }
  });
  return updated;
};
var deleteUser = async (userId, adminId, ipAddress) => {
  const oldUser = await prisma.user.findUnique({ where: { id: userId } });
  if (!oldUser) throw new Error("User not found");
  await prisma.user.delete({ where: { id: userId } });
  await auditService.log({
    userId: adminId,
    action: "USER_DELETED",
    entity: "User",
    entityId: userId,
    oldValue: { name: oldUser.name, email: oldUser.email, role: oldUser.role },
    newValue: null,
    ...ipAddress !== void 0 && { ipAddress }
  });
};
var getStatistics = async () => {
  const totalUsers = await prisma.user.count();
  const totalSellers = await prisma.user.count({ where: { role: "SELLER" } });
  const totalCustomers = await prisma.user.count({ where: { role: "CUSTOMER" } });
  const totalAdmins = await prisma.user.count({ where: { role: "ADMIN" } });
  const totalMedicines = await prisma.medicine.count();
  const totalOrders = await prisma.order.count();
  const totalDeliveredOrders = await prisma.order.count({ where: { status: "DELIVERED" } });
  const totalRevenue = await prisma.order.aggregate({ _sum: { totalPrice: true } });
  return {
    users: { total: totalUsers, customers: totalCustomers, sellers: totalSellers, admins: totalAdmins },
    medicines: totalMedicines,
    orders: { total: totalOrders, delivered: totalDeliveredOrders },
    revenue: totalRevenue._sum.totalPrice || 0
  };
};
var adminService = {
  getAllUsers,
  updateUserStatus,
  deleteUser,
  getStatistics
};

// src/modules/admin/admin.controller.ts
var getAllUsers2 = async (req, res, next) => {
  try {
    const users = await adminService.getAllUsers();
    sendResponse_default(res, {
      statusCode: status7.OK,
      success: true,
      message: "All users fetched",
      data: users
    });
  } catch (e) {
    next(e);
  }
};
var updateUserStatus2 = async (req, res, next) => {
  try {
    const adminId = req.user?.id;
    const ipAddress = req.ip;
    const userRes = await adminService.updateUserStatus(
      req.params.id,
      req.body.status,
      adminId,
      ipAddress
    );
    sendResponse_default(res, {
      statusCode: status7.OK,
      success: true,
      message: `User status updated to ${req.body.status}`,
      data: userRes
    });
  } catch (e) {
    next(e);
  }
};
var deleteUser2 = async (req, res, next) => {
  try {
    const adminId = req.user?.id;
    const ipAddress = req.ip;
    await adminService.deleteUser(req.params.id, adminId, ipAddress);
    sendResponse_default(res, {
      statusCode: status7.OK,
      success: true,
      message: "User deleted successfully",
      data: null
    });
  } catch (e) {
    next(e);
  }
};
var adminStatistics = async (req, res, next) => {
  try {
    const stats = await adminService.getStatistics();
    sendResponse_default(res, {
      statusCode: status7.OK,
      success: true,
      message: "Stats fetched successfully",
      data: stats
    });
  } catch (err) {
    next(err);
  }
};
var adminController = {
  getAllUsers: getAllUsers2,
  updateUserStatus: updateUserStatus2,
  deleteUser: deleteUser2,
  adminStatistics
};

// src/modules/admin/admin.route.ts
var router5 = Router5();
router5.get("/users", auth(Role.ADMIN), adminController.getAllUsers);
router5.patch("/users/:id", auth(Role.ADMIN), adminController.updateUserStatus);
router5.delete("/users/:id", auth(Role.ADMIN), adminController.deleteUser);
router5.get("/statistics", auth(Role.ADMIN), adminController.adminStatistics);
var adminRouter = router5;

// src/modules/review/review.route.ts
import { Router as Router6 } from "express";

// src/modules/review/review.controller.ts
import status8 from "http-status";

// src/modules/review/review.service.ts
var createReview = async (userId, payload) => {
  const purchased = await prisma.orderItem.findFirst({
    where: {
      medicineId: payload.medicineId,
      order: { customerId: userId, status: "DELIVERED" }
    }
  });
  const existing = await prisma.review.findFirst({ where: { userId, medicineId: payload.medicineId } });
  if (existing) throw new Error("You have already reviewed this medicine");
  return prisma.review.create({
    data: { ...payload, userId, isVerifiedPurchase: !!purchased }
  });
};
var getMedicineReviews = async (medicineId) => {
  return prisma.review.findMany({
    where: { medicineId },
    include: { user: { select: { id: true, name: true, image: true } } },
    orderBy: { createdAt: "desc" }
  });
};
var deleteReview = async (id, userId, role) => {
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) throw new Error("Review not found");
  if (review.userId !== userId && role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return prisma.review.delete({ where: { id } });
};
var getAllReviews = async () => {
  return prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, name: true, image: true } },
      medicine: { select: { id: true, name: true, image: true } }
    }
  });
};
var reviewService = {
  createReview,
  getAllReviews,
  getMedicineReviews,
  deleteReview
};

// src/modules/review/review.controller.ts
var createReview2 = async (req, res, next) => {
  try {
    const result = await reviewService.createReview(req.user.id, req.body);
    sendResponse_default(res, { statusCode: status8.CREATED, success: true, message: "Review submitted", data: result });
  } catch (e) {
    next(e);
  }
};
var getMedicineReviews2 = async (req, res, next) => {
  try {
    const result = await reviewService.getMedicineReviews(req.params.medicineId);
    sendResponse_default(res, { statusCode: status8.OK, success: true, message: "Reviews fetched", data: result });
  } catch (e) {
    next(e);
  }
};
var deleteReview2 = async (req, res, next) => {
  try {
    const { id: userId, role } = req.user;
    const result = await reviewService.deleteReview(req.params.id, userId, role);
    sendResponse_default(res, { statusCode: status8.OK, success: true, message: "Review deleted", data: result });
  } catch (e) {
    next(e);
  }
};
var getAllReviews2 = async (req, res, next) => {
  try {
    const result = await reviewService.getAllReviews();
    sendResponse_default(res, { statusCode: status8.OK, success: true, message: "Reviews fetched", data: result });
  } catch (e) {
    next(e);
  }
};
var reviewController = {
  createReview: createReview2,
  getAllReviews: getAllReviews2,
  // ← add
  getMedicineReviews: getMedicineReviews2,
  deleteReview: deleteReview2
};

// src/modules/review/review.route.ts
var router6 = Router6();
router6.get("/", reviewController.getAllReviews);
router6.post("/", auth(Role.CUSTOMER), reviewController.createReview);
router6.get("/:medicineId", reviewController.getMedicineReviews);
router6.delete("/:id", auth(Role.CUSTOMER), reviewController.deleteReview);
var reviewRouter = router6;

// src/modules/user/user.route.ts
import { Router as Router7 } from "express";

// src/modules/user/user.controller.ts
import status9 from "http-status";

// src/modules/user/user.service.ts
import jwt3 from "jsonwebtoken";
import { subDays, startOfDay, endOfDay, startOfMonth, endOfMonth, subMonths } from "date-fns";
var JWT_SECRET2 = envVars.JWT_SECRET || "supersecret";
var getMe = async (token) => {
  const decoded = jwt3.verify(token, JWT_SECRET2);
  const user = await prisma.user.findUnique({ where: { id: decoded.id } });
  if (!user) throw new Error("User not found");
  return user;
};
var updateProfile = async (token, payload) => {
  const decoded = jwt3.verify(token, JWT_SECRET2);
  delete payload.role;
  delete payload.status;
  delete payload.email;
  delete payload.password;
  const updatedUser = await prisma.user.update({
    where: { id: decoded.id },
    data: {
      name: payload.name,
      phone: payload.phone,
      image: payload.image
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      phone: true,
      image: true,
      createdAt: true
    }
  });
  return updatedUser;
};
var getAdminStatistics = async () => {
  const now = /* @__PURE__ */ new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);
  const thisMonthStart = startOfMonth(now);
  const thisMonthEnd = endOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));
  const last7Days = subDays(now, 7);
  const last30Days = subDays(now, 30);
  const [
    // Users
    totalUsers,
    totalCustomers,
    totalSellers,
    totalAdmins,
    activeUsers,
    bannedUsers,
    suspendedUsers,
    verifiedUsers,
    newUsersToday,
    newUsersThisMonth,
    newUsersLastMonth,
    // Medicines
    totalMedicines,
    activeMedicines,
    inactiveMedicines,
    outOfStockMedicines,
    lowStockMedicines,
    // Orders
    totalOrders,
    placedOrders,
    confirmedOrders,
    processingOrders,
    shippedOrders,
    deliveredOrders,
    cancelledOrders,
    refundedOrders,
    ordersToday,
    ordersThisMonth,
    ordersLastMonth,
    ordersLast7Days,
    // Revenue
    totalRevenue,
    revenueThisMonth,
    revenueLastMonth,
    revenueToday,
    revenueByPaymentMethod,
    // Payments
    totalPayments,
    successPayments,
    pendingPayments,
    failedPayments,
    refundedPayments,
    totalRefunded,
    // Reviews
    totalReviews,
    avgRating,
    // Categories
    totalCategories,
    // Coupons
    totalCoupons,
    activeCoupons,
    // Top selling medicines
    topSellingMedicines,
    // Recent orders
    recentOrders,
    // Order status breakdown for chart
    orderStatusBreakdown,
    // Revenue last 7 days (daily)
    revenueDaily
  ] = await Promise.all([
    // Users
    prisma.user.count(),
    prisma.user.count({ where: { role: Role.CUSTOMER } }),
    prisma.user.count({ where: { role: Role.SELLER } }),
    prisma.user.count({ where: { role: Role.ADMIN } }),
    prisma.user.count({ where: { status: UserStatus.ACTIVE } }),
    prisma.user.count({ where: { status: UserStatus.BANNED } }),
    prisma.user.count({ where: { status: UserStatus.SUSPENDED } }),
    prisma.user.count({ where: { isEmailVerified: true } }),
    prisma.user.count({ where: { createdAt: { gte: todayStart, lte: todayEnd } } }),
    prisma.user.count({ where: { createdAt: { gte: thisMonthStart, lte: thisMonthEnd } } }),
    prisma.user.count({ where: { createdAt: { gte: lastMonthStart, lte: lastMonthEnd } } }),
    // Medicines
    prisma.medicine.count(),
    prisma.medicine.count({ where: { isActive: true } }),
    prisma.medicine.count({ where: { isActive: false } }),
    prisma.medicine.count({ where: { stock: 0 } }),
    prisma.medicine.count({ where: { stock: { gt: 0, lte: 10 } } }),
    // Orders
    prisma.order.count(),
    prisma.order.count({ where: { status: OrderStatus.PLACED } }),
    prisma.order.count({ where: { status: OrderStatus.CONFIRMED } }),
    prisma.order.count({ where: { status: OrderStatus.PROCESSING } }),
    prisma.order.count({ where: { status: OrderStatus.SHIPPED } }),
    prisma.order.count({ where: { status: OrderStatus.DELIVERED } }),
    prisma.order.count({ where: { status: OrderStatus.CANCELLED } }),
    prisma.order.count({ where: { status: OrderStatus.REFUNDED } }),
    prisma.order.count({ where: { createdAt: { gte: todayStart, lte: todayEnd } } }),
    prisma.order.count({ where: { createdAt: { gte: thisMonthStart, lte: thisMonthEnd } } }),
    prisma.order.count({ where: { createdAt: { gte: lastMonthStart, lte: lastMonthEnd } } }),
    prisma.order.count({ where: { createdAt: { gte: last7Days } } }),
    // Revenue
    prisma.order.aggregate({ _sum: { totalPrice: true }, where: { status: OrderStatus.DELIVERED } }),
    prisma.order.aggregate({ _sum: { totalPrice: true }, where: { status: OrderStatus.DELIVERED, createdAt: { gte: thisMonthStart, lte: thisMonthEnd } } }),
    prisma.order.aggregate({ _sum: { totalPrice: true }, where: { status: OrderStatus.DELIVERED, createdAt: { gte: lastMonthStart, lte: lastMonthEnd } } }),
    prisma.order.aggregate({ _sum: { totalPrice: true }, where: { status: OrderStatus.DELIVERED, createdAt: { gte: todayStart, lte: todayEnd } } }),
    prisma.payment.groupBy({ by: ["method"], _sum: { amount: true }, where: { status: PaymentStatus.SUCCESS } }),
    // Payments
    prisma.payment.count(),
    prisma.payment.count({ where: { status: PaymentStatus.SUCCESS } }),
    prisma.payment.count({ where: { status: PaymentStatus.PENDING } }),
    prisma.payment.count({ where: { status: PaymentStatus.FAILED } }),
    prisma.payment.count({ where: { status: PaymentStatus.REFUNDED } }),
    prisma.payment.aggregate({ _sum: { refundAmount: true }, where: { status: PaymentStatus.REFUNDED } }),
    // Reviews
    prisma.review.count(),
    prisma.review.aggregate({ _avg: { rating: true } }),
    // Categories
    prisma.category.count(),
    // Coupons
    prisma.coupon.count(),
    prisma.coupon.count({ where: { isActive: true } }),
    // Top selling medicines
    prisma.orderItem.groupBy({
      by: ["medicineId", "medicineName"],
      _sum: { quantity: true, totalPrice: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5
    }),
    // Recent orders
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        customer: { select: { name: true, email: true, image: true } },
        payment: { select: { method: true, status: true } }
      }
    }),
    // Order status breakdown
    prisma.order.groupBy({
      by: ["status"],
      _count: { status: true }
    }),
    // Revenue daily last 7 days (raw)
    prisma.order.findMany({
      where: { status: OrderStatus.DELIVERED, createdAt: { gte: last7Days } },
      select: { createdAt: true, totalPrice: true },
      orderBy: { createdAt: "asc" }
    })
  ]);
  const dailyRevenueMap = {};
  for (let i = 6; i >= 0; i--) {
    const d = subDays(now, i);
    const key = d.toISOString().split("T")[0];
    dailyRevenueMap[key] = 0;
  }
  for (const order of revenueDaily) {
    const key = order.createdAt.toISOString().split("T")[0];
    if (key in dailyRevenueMap) dailyRevenueMap[key] += order.totalPrice;
  }
  const revenueGrowth = (() => {
    const thisM = revenueThisMonth._sum.totalPrice || 0;
    const lastM = revenueLastMonth._sum.totalPrice || 0;
    if (!lastM) return thisM > 0 ? 100 : 0;
    return Number(((thisM - lastM) / lastM * 100).toFixed(1));
  })();
  const orderGrowth = (() => {
    if (!ordersLastMonth) return ordersThisMonth > 0 ? 100 : 0;
    return Number(((ordersThisMonth - ordersLastMonth) / ordersLastMonth * 100).toFixed(1));
  })();
  const userGrowth = (() => {
    if (!newUsersLastMonth) return newUsersThisMonth > 0 ? 100 : 0;
    return Number(((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth * 100).toFixed(1));
  })();
  return {
    users: {
      total: totalUsers,
      customers: totalCustomers,
      sellers: totalSellers,
      admins: totalAdmins,
      active: activeUsers,
      banned: bannedUsers,
      suspended: suspendedUsers,
      verified: verifiedUsers,
      newToday: newUsersToday,
      newThisMonth: newUsersThisMonth,
      newLastMonth: newUsersLastMonth,
      growth: userGrowth
    },
    medicines: {
      total: totalMedicines,
      active: activeMedicines,
      inactive: inactiveMedicines,
      outOfStock: outOfStockMedicines,
      lowStock: lowStockMedicines
    },
    orders: {
      total: totalOrders,
      byStatus: {
        placed: placedOrders,
        confirmed: confirmedOrders,
        processing: processingOrders,
        shipped: shippedOrders,
        delivered: deliveredOrders,
        cancelled: cancelledOrders,
        refunded: refundedOrders
      },
      today: ordersToday,
      thisMonth: ordersThisMonth,
      lastMonth: ordersLastMonth,
      last7Days: ordersLast7Days,
      growth: orderGrowth,
      statusBreakdown: orderStatusBreakdown.map((s) => ({ status: s.status, count: s._count.status }))
    },
    revenue: {
      total: totalRevenue._sum.totalPrice || 0,
      today: revenueToday._sum.totalPrice || 0,
      thisMonth: revenueThisMonth._sum.totalPrice || 0,
      lastMonth: revenueLastMonth._sum.totalPrice || 0,
      growth: revenueGrowth,
      byPaymentMethod: revenueByPaymentMethod.map((p) => ({ method: p.method, amount: p._sum.amount || 0 })),
      daily: Object.entries(dailyRevenueMap).map(([date, amount]) => ({ date, amount }))
    },
    payments: {
      total: totalPayments,
      success: successPayments,
      pending: pendingPayments,
      failed: failedPayments,
      refunded: refundedPayments,
      totalRefunded: totalRefunded._sum.refundAmount || 0
    },
    reviews: {
      total: totalReviews,
      avgRating: Number((avgRating._avg.rating || 0).toFixed(1))
    },
    categories: { total: totalCategories },
    coupons: { total: totalCoupons, active: activeCoupons },
    topSellingMedicines: topSellingMedicines.map((m) => ({
      medicineId: m.medicineId,
      medicineName: m.medicineName,
      totalQuantity: m._sum.quantity || 0,
      totalRevenue: m._sum.totalPrice || 0
    })),
    recentOrders: recentOrders.map((o) => ({
      id: o.id,
      status: o.status,
      totalPrice: o.totalPrice,
      createdAt: o.createdAt,
      customer: o.customer,
      payment: o.payment
    }))
  };
};
var getCustomerStatistics = async (userId) => {
  const now = /* @__PURE__ */ new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);
  const thisMonthStart = startOfMonth(now);
  const thisMonthEnd = endOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));
  const last30Days = subDays(now, 30);
  const [
    // Orders
    totalOrders,
    placedOrders,
    confirmedOrders,
    processingOrders,
    shippedOrders,
    deliveredOrders,
    cancelledOrders,
    refundedOrders,
    ordersThisMonth,
    ordersLastMonth,
    // Spending
    totalSpent,
    spentThisMonth,
    spentLastMonth,
    spentToday,
    // Payments
    totalPayments,
    successPayments,
    pendingPayments,
    failedPayments,
    // Reviews
    totalReviews,
    avgRatingGiven,
    // Addresses
    totalAddresses,
    // Notifications
    totalNotifications,
    unreadNotifications,
    // Favourite / repeat purchase (most ordered medicine)
    topOrderedMedicines,
    // Recent orders
    recentOrders,
    // Coupon savings
    couponSavings
  ] = await Promise.all([
    // Orders
    prisma.order.count({ where: { customerId: userId } }),
    prisma.order.count({ where: { customerId: userId, status: OrderStatus.PLACED } }),
    prisma.order.count({ where: { customerId: userId, status: OrderStatus.CONFIRMED } }),
    prisma.order.count({ where: { customerId: userId, status: OrderStatus.PROCESSING } }),
    prisma.order.count({ where: { customerId: userId, status: OrderStatus.SHIPPED } }),
    prisma.order.count({ where: { customerId: userId, status: OrderStatus.DELIVERED } }),
    prisma.order.count({ where: { customerId: userId, status: OrderStatus.CANCELLED } }),
    prisma.order.count({ where: { customerId: userId, status: OrderStatus.REFUNDED } }),
    prisma.order.count({ where: { customerId: userId, createdAt: { gte: thisMonthStart, lte: thisMonthEnd } } }),
    prisma.order.count({ where: { customerId: userId, createdAt: { gte: lastMonthStart, lte: lastMonthEnd } } }),
    // Spending (delivered only)
    prisma.order.aggregate({ _sum: { totalPrice: true }, where: { customerId: userId, status: OrderStatus.DELIVERED } }),
    prisma.order.aggregate({ _sum: { totalPrice: true }, where: { customerId: userId, status: OrderStatus.DELIVERED, createdAt: { gte: thisMonthStart, lte: thisMonthEnd } } }),
    prisma.order.aggregate({ _sum: { totalPrice: true }, where: { customerId: userId, status: OrderStatus.DELIVERED, createdAt: { gte: lastMonthStart, lte: lastMonthEnd } } }),
    prisma.order.aggregate({ _sum: { totalPrice: true }, where: { customerId: userId, status: OrderStatus.DELIVERED, createdAt: { gte: todayStart, lte: todayEnd } } }),
    // Payments
    prisma.payment.count({ where: { order: { customerId: userId } } }),
    prisma.payment.count({ where: { order: { customerId: userId }, status: PaymentStatus.SUCCESS } }),
    prisma.payment.count({ where: { order: { customerId: userId }, status: PaymentStatus.PENDING } }),
    prisma.payment.count({ where: { order: { customerId: userId }, status: PaymentStatus.FAILED } }),
    // Reviews
    prisma.review.count({ where: { userId } }),
    prisma.review.aggregate({ _avg: { rating: true }, where: { userId } }),
    // Addresses
    prisma.address.count({ where: { userId } }),
    // Notifications
    prisma.notification.count({ where: { userId } }),
    prisma.notification.count({ where: { userId, isRead: false } }),
    // Top ordered medicines
    prisma.orderItem.groupBy({
      by: ["medicineId", "medicineName"],
      where: { order: { customerId: userId } },
      _sum: { quantity: true, totalPrice: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5
    }),
    // Recent orders
    prisma.order.findMany({
      where: { customerId: userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        items: { select: { medicineName: true, quantity: true, unitPrice: true, medicineImage: true } },
        payment: { select: { method: true, status: true } }
      }
    }),
    // Coupon savings
    prisma.order.aggregate({ _sum: { couponDiscount: true }, where: { customerId: userId } })
  ]);
  const spendingGrowth = (() => {
    const thisM = spentThisMonth._sum.totalPrice || 0;
    const lastM = spentLastMonth._sum.totalPrice || 0;
    if (!lastM) return thisM > 0 ? 100 : 0;
    return Number(((thisM - lastM) / lastM * 100).toFixed(1));
  })();
  return {
    orders: {
      total: totalOrders,
      byStatus: {
        placed: placedOrders,
        confirmed: confirmedOrders,
        processing: processingOrders,
        shipped: shippedOrders,
        delivered: deliveredOrders,
        cancelled: cancelledOrders,
        refunded: refundedOrders
      },
      thisMonth: ordersThisMonth,
      lastMonth: ordersLastMonth,
      active: placedOrders + confirmedOrders + processingOrders + shippedOrders
    },
    spending: {
      total: totalSpent._sum.totalPrice || 0,
      today: spentToday._sum.totalPrice || 0,
      thisMonth: spentThisMonth._sum.totalPrice || 0,
      lastMonth: spentLastMonth._sum.totalPrice || 0,
      growth: spendingGrowth,
      couponSavings: couponSavings._sum.couponDiscount || 0
    },
    payments: {
      total: totalPayments,
      success: successPayments,
      pending: pendingPayments,
      failed: failedPayments
    },
    reviews: {
      total: totalReviews,
      avgRating: Number((avgRatingGiven._avg.rating || 0).toFixed(1))
    },
    addresses: { total: totalAddresses },
    notifications: { total: totalNotifications, unread: unreadNotifications },
    topOrderedMedicines: topOrderedMedicines.map((m) => ({
      medicineId: m.medicineId,
      medicineName: m.medicineName,
      totalQuantity: m._sum.quantity || 0,
      totalSpent: m._sum.totalPrice || 0
    })),
    recentOrders
  };
};
var getSellerStatistics = async (userId) => {
  const now = /* @__PURE__ */ new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);
  const thisMonthStart = startOfMonth(now);
  const thisMonthEnd = endOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));
  const last7Days = subDays(now, 7);
  const [
    // Medicines
    totalMedicines,
    activeMedicines,
    inactiveMedicines,
    outOfStockMedicines,
    lowStockMedicines,
    medicinesAddedThisMonth,
    // Orders through seller's medicines
    totalOrders,
    deliveredOrders,
    processingOrders,
    cancelledOrders,
    ordersThisMonth,
    ordersLastMonth,
    ordersToday,
    // Revenue from delivered orders containing seller's medicines
    topSellingMedicines,
    // Reviews on seller's medicines
    totalReviews,
    avgRating,
    // Batches
    totalBatches,
    activeBatches,
    expiredBatches,
    // Recent orders containing seller's medicines
    recentOrders,
    // Category breakdown
    medicinesByCategory,
    // Revenue raw data for daily chart
    revenueOrders
  ] = await Promise.all([
    // Medicines
    prisma.medicine.count({ where: { sellerId: userId } }),
    prisma.medicine.count({ where: { sellerId: userId, isActive: true } }),
    prisma.medicine.count({ where: { sellerId: userId, isActive: false } }),
    prisma.medicine.count({ where: { sellerId: userId, stock: 0 } }),
    prisma.medicine.count({ where: { sellerId: userId, stock: { gt: 0, lte: 10 } } }),
    prisma.medicine.count({ where: { sellerId: userId, createdAt: { gte: thisMonthStart, lte: thisMonthEnd } } }),
    // Orders via orderItems → medicine → seller
    prisma.order.count({ where: { items: { some: { medicine: { sellerId: userId } } } } }),
    prisma.order.count({ where: { items: { some: { medicine: { sellerId: userId } } }, status: OrderStatus.DELIVERED } }),
    prisma.order.count({ where: { items: { some: { medicine: { sellerId: userId } } }, status: { in: [OrderStatus.PROCESSING, OrderStatus.CONFIRMED, OrderStatus.SHIPPED] } } }),
    prisma.order.count({ where: { items: { some: { medicine: { sellerId: userId } } }, status: OrderStatus.CANCELLED } }),
    prisma.order.count({ where: { items: { some: { medicine: { sellerId: userId } } }, createdAt: { gte: thisMonthStart, lte: thisMonthEnd } } }),
    prisma.order.count({ where: { items: { some: { medicine: { sellerId: userId } } }, createdAt: { gte: lastMonthStart, lte: lastMonthEnd } } }),
    prisma.order.count({ where: { items: { some: { medicine: { sellerId: userId } } }, createdAt: { gte: todayStart, lte: todayEnd } } }),
    // Top selling medicines (by quantity sold)
    prisma.orderItem.groupBy({
      by: ["medicineId", "medicineName"],
      where: { medicine: { sellerId: userId } },
      _sum: { quantity: true, totalPrice: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5
    }),
    // Reviews
    prisma.review.count({ where: { medicine: { sellerId: userId } } }),
    prisma.review.aggregate({ _avg: { rating: true }, where: { medicine: { sellerId: userId } } }),
    // Batches
    prisma.medicineBatch.count({ where: { medicine: { sellerId: userId } } }),
    prisma.medicineBatch.count({ where: { medicine: { sellerId: userId }, isActive: true } }),
    prisma.medicineBatch.count({ where: { medicine: { sellerId: userId }, expiryDate: { lt: now } } }),
    // Recent orders
    prisma.order.findMany({
      where: { items: { some: { medicine: { sellerId: userId } } } },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        customer: { select: { name: true, email: true, image: true } },
        items: {
          where: { medicine: { sellerId: userId } },
          select: { medicineName: true, quantity: true, unitPrice: true, totalPrice: true }
        },
        payment: { select: { method: true, status: true } }
      }
    }),
    // Medicines by category
    prisma.medicine.groupBy({
      by: ["categoryId"],
      where: { sellerId: userId },
      _count: { categoryId: true }
    }),
    // Revenue raw for daily chart (last 7 days, delivered)
    prisma.orderItem.findMany({
      where: {
        medicine: { sellerId: userId },
        order: { status: OrderStatus.DELIVERED, createdAt: { gte: last7Days } }
      },
      select: { totalPrice: true, order: { select: { createdAt: true } } }
    })
  ]);
  const sellerItemsAll = await prisma.orderItem.aggregate({
    _sum: { totalPrice: true },
    where: { medicine: { sellerId: userId }, order: { status: OrderStatus.DELIVERED } }
  });
  const sellerItemsThisMonth = await prisma.orderItem.aggregate({
    _sum: { totalPrice: true },
    where: { medicine: { sellerId: userId }, order: { status: OrderStatus.DELIVERED, createdAt: { gte: thisMonthStart, lte: thisMonthEnd } } }
  });
  const sellerItemsLastMonth = await prisma.orderItem.aggregate({
    _sum: { totalPrice: true },
    where: { medicine: { sellerId: userId }, order: { status: OrderStatus.DELIVERED, createdAt: { gte: lastMonthStart, lte: lastMonthEnd } } }
  });
  const sellerItemsToday = await prisma.orderItem.aggregate({
    _sum: { totalPrice: true },
    where: { medicine: { sellerId: userId }, order: { status: OrderStatus.DELIVERED, createdAt: { gte: todayStart, lte: todayEnd } } }
  });
  const dailyRevenueMap = {};
  for (let i = 6; i >= 0; i--) {
    const d = subDays(now, i);
    dailyRevenueMap[d.toISOString().split("T")[0]] = 0;
  }
  for (const item of revenueOrders) {
    const key = item.order.createdAt.toISOString().split("T")[0];
    if (key in dailyRevenueMap) dailyRevenueMap[key] += item.totalPrice;
  }
  const revenueGrowth = (() => {
    const thisM = sellerItemsThisMonth._sum.totalPrice || 0;
    const lastM = sellerItemsLastMonth._sum.totalPrice || 0;
    if (!lastM) return thisM > 0 ? 100 : 0;
    return Number(((thisM - lastM) / lastM * 100).toFixed(1));
  })();
  const orderGrowth = (() => {
    if (!ordersLastMonth) return ordersThisMonth > 0 ? 100 : 0;
    return Number(((ordersThisMonth - ordersLastMonth) / ordersLastMonth * 100).toFixed(1));
  })();
  const categoryIds = medicinesByCategory.map((m) => m.categoryId);
  const categories = await prisma.category.findMany({
    where: { id: { in: categoryIds } },
    select: { id: true, name: true }
  });
  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));
  return {
    medicines: {
      total: totalMedicines,
      active: activeMedicines,
      inactive: inactiveMedicines,
      outOfStock: outOfStockMedicines,
      lowStock: lowStockMedicines,
      addedThisMonth: medicinesAddedThisMonth,
      byCategory: medicinesByCategory.map((m) => ({
        categoryId: m.categoryId,
        categoryName: categoryMap[m.categoryId] || "Unknown",
        count: m._count.categoryId
      }))
    },
    orders: {
      total: totalOrders,
      delivered: deliveredOrders,
      processing: processingOrders,
      cancelled: cancelledOrders,
      today: ordersToday,
      thisMonth: ordersThisMonth,
      lastMonth: ordersLastMonth,
      growth: orderGrowth
    },
    revenue: {
      total: sellerItemsAll._sum.totalPrice || 0,
      today: sellerItemsToday._sum.totalPrice || 0,
      thisMonth: sellerItemsThisMonth._sum.totalPrice || 0,
      lastMonth: sellerItemsLastMonth._sum.totalPrice || 0,
      growth: revenueGrowth,
      daily: Object.entries(dailyRevenueMap).map(([date, amount]) => ({ date, amount }))
    },
    reviews: {
      total: totalReviews,
      avgRating: Number((avgRating._avg.rating || 0).toFixed(1))
    },
    batches: {
      total: totalBatches,
      active: activeBatches,
      expired: expiredBatches
    },
    topSellingMedicines: topSellingMedicines.map((m) => ({
      medicineId: m.medicineId,
      medicineName: m.medicineName,
      totalQuantity: m._sum.quantity || 0,
      totalRevenue: m._sum.totalPrice || 0
    })),
    recentOrders
  };
};
var userService = {
  getMe,
  updateProfile,
  getAdminStatistics,
  getCustomerStatistics,
  getSellerStatistics
};

// src/modules/user/user.controller.ts
var getMe2 = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return sendResponse_default(res, {
        statusCode: status9.UNAUTHORIZED,
        success: false,
        message: "Not logged in"
      });
    }
    const user = await userService.getMe(token);
    sendResponse_default(res, {
      statusCode: status9.OK,
      success: true,
      message: "Current user fetched",
      data: { user }
    });
  } catch (err) {
    next(err);
  }
};
var updateProfile2 = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return sendResponse_default(res, {
        statusCode: status9.UNAUTHORIZED,
        success: false,
        message: "Not logged in"
      });
    }
    const user = await userService.updateProfile(token, req.body);
    sendResponse_default(res, {
      statusCode: status9.OK,
      success: true,
      message: "Profile updated successfully",
      data: { user }
    });
  } catch (err) {
    next(err);
  }
};
var adminStatistics2 = async (req, res, next) => {
  try {
    const data = await userService.getAdminStatistics();
    sendResponse_default(res, {
      statusCode: status9.OK,
      success: true,
      message: "Statistics Fetched",
      data
    });
  } catch (err) {
    next(err);
  }
};
var customerStatistics = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const data = await userService.getCustomerStatistics(userId);
    sendResponse_default(res, {
      statusCode: status9.OK,
      success: true,
      message: "Statistics Fetched",
      data
    });
  } catch (err) {
    next(err);
  }
};
var sellerStatistics = async (req, res, next) => {
  try {
    const data = await userService.getSellerStatistics(req.user.id);
    sendResponse_default(res, {
      statusCode: status9.OK,
      success: true,
      message: "Statistics Fetched",
      data
    });
  } catch (err) {
    next(err);
  }
};
var userController = {
  getMe: getMe2,
  updateProfile: updateProfile2,
  adminStatistics: adminStatistics2,
  customerStatistics,
  sellerStatistics
};

// src/modules/user/user.route.ts
var router7 = Router7();
router7.get("/me", auth(Role.CUSTOMER, Role.ADMIN, Role.SELLER), userController.getMe);
router7.patch("/me", auth(Role.CUSTOMER, Role.ADMIN, Role.SELLER), userController.updateProfile);
router7.get("/admin/statistics", auth(Role.ADMIN), userController.adminStatistics);
router7.get("/customer/statistics", auth(Role.CUSTOMER), userController.customerStatistics);
router7.get("/seller/statistics", auth(Role.SELLER), userController.sellerStatistics);
var userRouter = router7;

// src/modules/address/address.route.ts
import { Router as Router8 } from "express";

// src/modules/address/address.controller.ts
import status10 from "http-status";

// src/modules/address/address.service.ts
var createAddress = async (userId, payload) => {
  if (payload.isDefault) {
    await prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
  }
  return prisma.address.create({ data: { ...payload, userId } });
};
var getMyAddresses = async (userId) => {
  return prisma.address.findMany({ where: { userId }, orderBy: { isDefault: "desc" } });
};
var updateAddress = async (id, userId, payload) => {
  const address = await prisma.address.findFirst({ where: { id, userId } });
  if (!address) throw new Error("Address not found");
  if (payload.isDefault) {
    await prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
  }
  return prisma.address.update({ where: { id }, data: payload });
};
var deleteAddress = async (id, userId) => {
  const address = await prisma.address.findFirst({ where: { id, userId } });
  if (!address) throw new Error("Address not found");
  return prisma.address.delete({ where: { id } });
};
var addressService = { createAddress, getMyAddresses, updateAddress, deleteAddress };

// src/modules/address/address.controller.ts
var createAddress2 = async (req, res, next) => {
  try {
    const result = await addressService.createAddress(req.user.id, req.body);
    sendResponse_default(res, { statusCode: status10.CREATED, success: true, message: "Address added", data: result });
  } catch (e) {
    next(e);
  }
};
var getMyAddresses2 = async (req, res, next) => {
  try {
    const result = await addressService.getMyAddresses(req.user.id);
    sendResponse_default(res, { statusCode: status10.OK, success: true, message: "Addresses fetched", data: result });
  } catch (e) {
    next(e);
  }
};
var updateAddress2 = async (req, res, next) => {
  try {
    const result = await addressService.updateAddress(req.params.id, req.user.id, req.body);
    sendResponse_default(res, { statusCode: status10.OK, success: true, message: "Address updated", data: result });
  } catch (e) {
    next(e);
  }
};
var deleteAddress2 = async (req, res, next) => {
  try {
    await addressService.deleteAddress(req.params.id, req.user.id);
    sendResponse_default(res, { statusCode: status10.OK, success: true, message: "Address deleted", data: null });
  } catch (e) {
    next(e);
  }
};
var addressController = { createAddress: createAddress2, getMyAddresses: getMyAddresses2, updateAddress: updateAddress2, deleteAddress: deleteAddress2 };

// src/modules/address/address.route.ts
var router8 = Router8();
router8.post("/", auth(Role.CUSTOMER), addressController.createAddress);
router8.get("/", auth(Role.CUSTOMER), addressController.getMyAddresses);
router8.patch("/:id", auth(Role.CUSTOMER), addressController.updateAddress);
router8.delete("/:id", auth(Role.CUSTOMER), addressController.deleteAddress);
var addressRouter = router8;

// src/modules/coupon/coupon.route.ts
import { Router as Router9 } from "express";

// src/modules/coupon/coupon.controller.ts
import status11 from "http-status";

// src/modules/coupon/coupon.service.ts
var createCoupon = async (payload) => {
  return prisma.coupon.create({
    data: {
      ...payload,
      expiresAt: payload.expiresAt ? new Date(payload.expiresAt) : null
    }
  });
};
var getAllCoupons = async () => {
  return prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
};
var updateCoupon = async (id, payload) => {
  return prisma.coupon.update({
    where: { id },
    data: {
      ...payload,
      ...payload.expiresAt !== void 0 && {
        expiresAt: payload.expiresAt ? new Date(payload.expiresAt) : null
      }
    }
  });
};
var deleteCoupon = async (id) => {
  return prisma.coupon.delete({ where: { id } });
};
var validateCoupon = async (code, orderAmount) => {
  const coupon = await prisma.coupon.findFirst({
    where: {
      code,
      isActive: true,
      OR: [{ expiresAt: null }, { expiresAt: { gt: /* @__PURE__ */ new Date() } }]
    }
  });
  if (!coupon) throw new Error("Invalid or expired coupon");
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) throw new Error("Coupon usage limit reached");
  if (coupon.minOrderAmount && orderAmount < coupon.minOrderAmount)
    throw new Error(`Minimum order amount is \u09F3${coupon.minOrderAmount}`);
  const discount = coupon.discountType === "PERCENTAGE" ? Math.min(orderAmount * coupon.discountValue / 100, coupon.maxDiscount ?? Infinity) : coupon.discountValue;
  return { coupon, discount };
};
var couponService = { createCoupon, getAllCoupons, updateCoupon, deleteCoupon, validateCoupon };

// src/modules/coupon/coupon.controller.ts
var createCoupon2 = async (req, res, next) => {
  try {
    const result = await couponService.createCoupon(req.body);
    sendResponse_default(res, { statusCode: status11.CREATED, success: true, message: "Coupon created", data: result });
  } catch (e) {
    next(e);
  }
};
var getAllCoupons2 = async (req, res, next) => {
  try {
    const result = await couponService.getAllCoupons();
    sendResponse_default(res, { statusCode: status11.OK, success: true, message: "Coupons fetched", data: result });
  } catch (e) {
    next(e);
  }
};
var updateCoupon2 = async (req, res, next) => {
  try {
    const result = await couponService.updateCoupon(req.params.id, req.body);
    sendResponse_default(res, { statusCode: status11.OK, success: true, message: "Coupon updated", data: result });
  } catch (e) {
    next(e);
  }
};
var deleteCoupon2 = async (req, res, next) => {
  try {
    await couponService.deleteCoupon(req.params.id);
    sendResponse_default(res, { statusCode: status11.OK, success: true, message: "Coupon deleted", data: null });
  } catch (e) {
    next(e);
  }
};
var validateCoupon2 = async (req, res, next) => {
  try {
    const { code, orderAmount } = req.body;
    const result = await couponService.validateCoupon(code, parseFloat(orderAmount));
    sendResponse_default(res, { statusCode: status11.OK, success: true, message: "Coupon valid", data: result });
  } catch (e) {
    next(e);
  }
};
var couponController = { createCoupon: createCoupon2, getAllCoupons: getAllCoupons2, updateCoupon: updateCoupon2, deleteCoupon: deleteCoupon2, validateCoupon: validateCoupon2 };

// src/modules/coupon/coupon.route.ts
var router9 = Router9();
router9.post("/", auth(Role.ADMIN), couponController.createCoupon);
router9.get("/", auth(Role.ADMIN), couponController.getAllCoupons);
router9.patch("/:id", auth(Role.ADMIN), couponController.updateCoupon);
router9.delete("/:id", auth(Role.ADMIN), couponController.deleteCoupon);
router9.post("/validate", auth(Role.CUSTOMER), couponController.validateCoupon);
var couponRouter = router9;

// src/modules/notification/notification.route.ts
import { Router as Router10 } from "express";

// src/modules/notification/notification.controller.ts
import status12 from "http-status";

// src/modules/notification/notification.service.ts
var getMyNotifications = async (userId) => {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50
  });
};
var markAsRead = async (id, userId) => {
  return prisma.notification.update({ where: { id, userId }, data: { isRead: true } });
};
var markAllAsRead = async (userId) => {
  return prisma.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true } });
};
var getUnreadCount = async (userId) => {
  return prisma.notification.count({ where: { userId, isRead: false } });
};
var notificationService = { getMyNotifications, markAsRead, markAllAsRead, getUnreadCount };

// src/modules/notification/notification.controller.ts
var getMyNotifications2 = async (req, res, next) => {
  try {
    const result = await notificationService.getMyNotifications(req.user.id);
    sendResponse_default(res, { statusCode: status12.OK, success: true, message: "Notifications fetched", data: result });
  } catch (e) {
    next(e);
  }
};
var markAsRead2 = async (req, res, next) => {
  try {
    const result = await notificationService.markAsRead(req.params.id, req.user.id);
    sendResponse_default(res, { statusCode: status12.OK, success: true, message: "Marked as read", data: result });
  } catch (e) {
    next(e);
  }
};
var markAllAsRead2 = async (req, res, next) => {
  try {
    await notificationService.markAllAsRead(req.user.id);
    sendResponse_default(res, { statusCode: status12.OK, success: true, message: "All marked as read", data: null });
  } catch (e) {
    next(e);
  }
};
var getUnreadCount2 = async (req, res, next) => {
  try {
    const count = await notificationService.getUnreadCount(req.user.id);
    sendResponse_default(res, { statusCode: status12.OK, success: true, message: "Unread count", data: { count } });
  } catch (e) {
    next(e);
  }
};
var notificationController = { getMyNotifications: getMyNotifications2, markAsRead: markAsRead2, markAllAsRead: markAllAsRead2, getUnreadCount: getUnreadCount2 };

// src/modules/notification/notification.route.ts
var router10 = Router10();
router10.get("/", auth(Role.CUSTOMER), notificationController.getMyNotifications);
router10.get("/unread-count", auth(Role.CUSTOMER), notificationController.getUnreadCount);
router10.patch("/:id/read", auth(Role.CUSTOMER), notificationController.markAsRead);
router10.patch("/mark-all-read", auth(Role.CUSTOMER), notificationController.markAllAsRead);
var notificationRouter = router10;

// src/modules/payment/payment.route.ts
import { Router as Router11 } from "express";

// src/modules/payment/payment.controller.ts
import status13 from "http-status";

// src/modules/payment/payment.service.ts
import SSLCommerzPayment from "sslcommerz-lts";
var STORE_ID = envVars.SSLCOMMERZ.SSL_STORE_ID;
var STORE_PASS = envVars.SSLCOMMERZ.SSL_STORE_PASS;
var IS_LIVE = envVars.SSLCOMMERZ.SSL_IS_LIVE === "true";
var BACKEND_URL = envVars.BACKEND_URL || "http://localhost:5000";
var FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
var initiatePayment = async (orderId, customerId) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, customerId },
    include: {
      customer: true,
      payment: true,
      address: true
    }
  });
  if (!order) throw new Error("Order not found");
  if (!order.payment) throw new Error("Payment record not found");
  if (order.payment.status === "SUCCESS") throw new Error("Order already paid");
  const tranId = `TXN-${orderId}-${Date.now()}`;
  const data = {
    total_amount: order.totalPrice,
    currency: "BDT",
    tran_id: tranId,
    success_url: `${BACKEND_URL}/api/payment/success`,
    fail_url: `${BACKEND_URL}/api/payment/fail`,
    cancel_url: `${BACKEND_URL}/api/payment/cancel`,
    ipn_url: `${BACKEND_URL}/api/payment/ipn`,
    shipping_method: "Courier",
    product_name: "Medicine Order",
    product_category: "Healthcare",
    product_profile: "general",
    cus_name: order.customer.name,
    cus_email: order.customer.email,
    cus_add1: order.address?.line1 || "N/A",
    cus_city: order.address?.city || "N/A",
    cus_country: "Bangladesh",
    cus_phone: order.customer.phone || "01XXXXXXXXX",
    ship_name: order.customer.name,
    ship_add1: order.address?.line1 || "N/A",
    ship_city: order.address?.city || "N/A",
    ship_country: "Bangladesh",
    ship_postcode: order.address?.postalCode || "1000"
  };
  const sslcz = new SSLCommerzPayment(STORE_ID, STORE_PASS, IS_LIVE);
  const apiResponse = await sslcz.init(data);
  if (!apiResponse?.GatewayPageURL) throw new Error("Failed to initiate payment gateway");
  await prisma.payment.update({
    where: { id: order.payment.id },
    data: {
      tranId,
      sessionKey: apiResponse.sessionkey,
      status: "INITIATED",
      method: "SSLCOMMERZ",
      initiatedAt: /* @__PURE__ */ new Date()
    }
  });
  await prisma.paymentLog.create({
    data: {
      paymentId: order.payment.id,
      event: "INITIATED",
      status: "INITIATED",
      rawPayload: apiResponse
    }
  });
  return { gatewayUrl: apiResponse.GatewayPageURL, tranId };
};
var handleSuccess = async (body) => {
  const { tran_id, val_id, bank_tran_id, card_type, card_no, store_amount, currency_type, currency_amount, currency_rate } = body;
  const payment = await prisma.payment.findFirst({ where: { tranId: tran_id } });
  if (!payment) throw new Error("Payment not found");
  const sslcz = new SSLCommerzPayment(STORE_ID, STORE_PASS, IS_LIVE);
  const validation = await sslcz.validate({ val_id });
  if (validation.status !== "VALID" && validation.status !== "VALIDATED") {
    await prisma.payment.update({ where: { id: payment.id }, data: { status: "FAILED", failedAt: /* @__PURE__ */ new Date() } });
    await prisma.paymentLog.create({ data: { paymentId: payment.id, event: "VALIDATION_FAILED", status: "FAILED", rawPayload: validation } });
    throw new Error("Payment validation failed");
  }
  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: "SUCCESS",
        valId: val_id,
        bankTranId: bank_tran_id,
        cardType: card_type,
        cardNo: card_no,
        storeAmount: parseFloat(store_amount),
        currency_type,
        currency_amount: parseFloat(currency_amount),
        currency_rate: parseFloat(currency_rate),
        paidAt: /* @__PURE__ */ new Date(),
        ipnPayload: body
      }
    });
    await tx.order.update({
      where: { id: payment.orderId },
      data: { status: "CONFIRMED" }
    });
    await tx.paymentLog.create({
      data: { paymentId: payment.id, event: "SUCCESS", status: "SUCCESS", rawPayload: body }
    });
    const order = await tx.order.findUnique({ where: { id: payment.orderId } });
    if (order) {
      await tx.notification.create({
        data: {
          userId: order.customerId,
          type: "PAYMENT_UPDATE",
          title: "Payment Successful",
          message: `Your payment of \u09F3${payment.amount} was successful. Order confirmed!`,
          meta: { orderId: order.id, paymentId: payment.id }
        }
      });
    }
  });
  return payment.orderId;
};
var handleFail = async (body) => {
  const { tran_id } = body;
  const payment = await prisma.payment.findFirst({ where: { tranId: tran_id } });
  if (!payment) return;
  await prisma.payment.update({ where: { id: payment.id }, data: { status: "FAILED", failedAt: /* @__PURE__ */ new Date() } });
  await prisma.paymentLog.create({ data: { paymentId: payment.id, event: "FAILED", status: "FAILED", rawPayload: body } });
};
var handleCancel = async (body) => {
  const { tran_id } = body;
  const payment = await prisma.payment.findFirst({ where: { tranId: tran_id } });
  if (!payment) return;
  await prisma.payment.update({ where: { id: payment.id }, data: { status: "CANCELLED" } });
  await prisma.paymentLog.create({ data: { paymentId: payment.id, event: "CANCELLED", status: "CANCELLED", rawPayload: body } });
};
var handleIPN = async (body) => {
  const { tran_id, status: status18 } = body;
  const payment = await prisma.payment.findFirst({ where: { tranId: tran_id } });
  if (!payment) return;
  await prisma.paymentLog.create({
    data: { paymentId: payment.id, event: "IPN_RECEIVED", status: status18, rawPayload: body }
  });
  if (status18 === "VALID" || status18 === "VALIDATED") {
    await prisma.payment.update({ where: { id: payment.id }, data: { status: "SUCCESS", paidAt: /* @__PURE__ */ new Date(), ipnPayload: body } });
    await prisma.order.update({ where: { id: payment.orderId }, data: { status: "CONFIRMED" } });
  }
};
var getPaymentByOrder = async (orderId, customerId) => {
  const order = await prisma.order.findFirst({ where: { id: orderId, customerId } });
  if (!order) throw new Error("Order not found");
  return prisma.payment.findFirst({
    where: { orderId },
    include: { logs: { orderBy: { createdAt: "desc" } } }
  });
};
var getMyPayments = async (customerId) => {
  return prisma.payment.findMany({
    where: { order: { customerId } },
    include: {
      order: {
        select: {
          id: true,
          status: true,
          totalPrice: true,
          subtotal: true,
          shippingFee: true,
          couponDiscount: true,
          createdAt: true,
          items: {
            select: {
              medicineName: true,
              quantity: true,
              unitPrice: true,
              totalPrice: true
            }
          }
        }
      },
      logs: {
        orderBy: { createdAt: "desc" },
        take: 1
        // latest log only
      }
    },
    orderBy: { createdAt: "desc" }
  });
};
var getSellerPayments = async (sellerId) => {
  return prisma.payment.findMany({
    where: {
      order: {
        items: { some: { medicine: { sellerId } } }
      }
    },
    include: {
      order: {
        select: {
          id: true,
          status: true,
          totalPrice: true,
          subtotal: true,
          shippingFee: true,
          createdAt: true,
          customer: {
            select: { id: true, name: true, phone: true, email: true }
          },
          items: {
            where: { medicine: { sellerId } },
            select: {
              medicineName: true,
              quantity: true,
              unitPrice: true,
              totalPrice: true
            }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
};
var getAllPayments = async () => {
  return prisma.payment.findMany({
    include: {
      order: {
        select: {
          id: true,
          status: true,
          totalPrice: true,
          subtotal: true,
          shippingFee: true,
          createdAt: true,
          customer: {
            select: { id: true, name: true, email: true, phone: true, role: true }
          },
          items: {
            select: {
              medicineName: true,
              quantity: true,
              unitPrice: true,
              totalPrice: true
            }
          }
        }
      },
      logs: { orderBy: { createdAt: "desc" } }
    },
    orderBy: { createdAt: "desc" }
  });
};
var refundPayment = async (paymentId, adminId, ip) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { order: true }
  });
  if (!payment) throw new Error("Payment not found");
  if (payment.status !== "SUCCESS") throw new Error("Only successful payments can be refunded");
  if (payment.refundedAt) throw new Error("Payment already refunded");
  return prisma.$transaction(async (tx) => {
    const updated = await tx.payment.update({
      where: { id: paymentId },
      data: {
        status: "REFUNDED",
        refundAmount: payment.amount,
        refundedAt: /* @__PURE__ */ new Date()
      }
    });
    await tx.order.update({
      where: { id: payment.orderId },
      data: { status: "REFUNDED" }
    });
    await tx.paymentLog.create({
      data: {
        paymentId,
        event: "REFUND_ISSUED",
        status: "REFUNDED",
        note: `Refund issued by admin`,
        ipAddress: ip
      }
    });
    await tx.auditLog.create({
      data: {
        userId: adminId,
        action: "PAYMENT_REFUNDED",
        entity: "Payment",
        entityId: paymentId,
        oldValue: { status: "SUCCESS" },
        newValue: { status: "REFUNDED", refundAmount: payment.amount },
        ipAddress: ip
      }
    });
    await tx.notification.create({
      data: {
        userId: payment.order.customerId,
        type: "PAYMENT_UPDATE",
        title: "Refund Issued",
        message: `Your payment of \u09F3${payment.amount} has been refunded.`,
        meta: { paymentId, orderId: payment.orderId }
      }
    });
    return updated;
  });
};
var paymentService = {
  initiatePayment,
  handleSuccess,
  handleFail,
  handleCancel,
  handleIPN,
  getPaymentByOrder,
  getMyPayments,
  getSellerPayments,
  getAllPayments,
  refundPayment
};

// src/modules/payment/payment.controller.ts
var FRONTEND_URL2 = process.env.FRONTEND_URL;
var initiatePayment2 = async (req, res, next) => {
  try {
    const result = await paymentService.initiatePayment(req.params.orderId, req.user.id);
    sendResponse_default(res, { statusCode: status13.OK, success: true, message: "Payment initiated", data: result });
  } catch (e) {
    next(e);
  }
};
var paymentSuccess = async (req, res, next) => {
  try {
    const orderId = await paymentService.handleSuccess(req.body);
    res.redirect(`${FRONTEND_URL2}/payment/success?orderId=${orderId}`);
  } catch (e) {
    res.redirect(`${FRONTEND_URL2}/payment/fail`);
  }
};
var paymentFail = async (req, res, next) => {
  try {
    await paymentService.handleFail(req.body);
    res.redirect(`${FRONTEND_URL2}/payment/fail`);
  } catch (e) {
    next(e);
  }
};
var paymentCancel = async (req, res, next) => {
  try {
    await paymentService.handleCancel(req.body);
    res.redirect(`${FRONTEND_URL2}/payment/cancel`);
  } catch (e) {
    next(e);
  }
};
var paymentIPN = async (req, res, next) => {
  try {
    await paymentService.handleIPN(req.body);
    res.status(200).send("IPN received");
  } catch (e) {
    next(e);
  }
};
var getPaymentByOrder2 = async (req, res, next) => {
  try {
    const result = await paymentService.getPaymentByOrder(req.params.orderId, req.user.id);
    sendResponse_default(res, { statusCode: status13.OK, success: true, message: "Payment fetched", data: result });
  } catch (e) {
    next(e);
  }
};
var getMyPayments2 = async (req, res, next) => {
  try {
    const result = await paymentService.getMyPayments(req.user.id);
    sendResponse_default(res, { statusCode: status13.OK, success: true, message: "My payments fetched", data: result });
  } catch (e) {
    next(e);
  }
};
var getSellerPayments2 = async (req, res, next) => {
  try {
    const result = await paymentService.getSellerPayments(req.user.id);
    sendResponse_default(res, { statusCode: status13.OK, success: true, message: "Seller payments fetched", data: result });
  } catch (e) {
    next(e);
  }
};
var getAllPayments2 = async (req, res, next) => {
  try {
    const result = await paymentService.getAllPayments();
    sendResponse_default(res, { statusCode: status13.OK, success: true, message: "All payments fetched", data: result });
  } catch (e) {
    next(e);
  }
};
var refundPayment2 = async (req, res, next) => {
  try {
    const ip = req.ip || req.headers["x-forwarded-for"];
    const result = await paymentService.refundPayment(
      req.params.id,
      req.user.id,
      ip
    );
    sendResponse_default(res, { statusCode: status13.OK, success: true, message: "Payment refunded", data: result });
  } catch (e) {
    next(e);
  }
};
var paymentController = {
  initiatePayment: initiatePayment2,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  paymentIPN,
  getPaymentByOrder: getPaymentByOrder2,
  getMyPayments: getMyPayments2,
  getSellerPayments: getSellerPayments2,
  getAllPayments: getAllPayments2,
  refundPayment: refundPayment2
};

// src/modules/payment/payment.route.ts
var router11 = Router11();
router11.post("/initiate/:orderId", auth(Role.CUSTOMER), paymentController.initiatePayment);
router11.post("/success", paymentController.paymentSuccess);
router11.post("/fail", paymentController.paymentFail);
router11.post("/cancel", paymentController.paymentCancel);
router11.post("/ipn", paymentController.paymentIPN);
router11.get("/order/:orderId", auth(Role.CUSTOMER), paymentController.getPaymentByOrder);
router11.get("/my", auth(Role.CUSTOMER), paymentController.getMyPayments);
router11.get("/admin", auth(Role.ADMIN), paymentController.getAllPayments);
router11.patch("/admin/:id/refund", auth(Role.ADMIN), paymentController.refundPayment);
router11.get("/seller", auth(Role.SELLER), paymentController.getSellerPayments);
var paymentRouter = router11;

// src/modules/file/file.route.ts
import { Router as Router12 } from "express";

// src/modules/file/file.controller.ts
import status16 from "http-status";

// src/modules/file/file.service.ts
import status15 from "http-status";

// src/config/cloudinary.config.ts
import { v2 as cloudinary } from "cloudinary";
import status14 from "http-status";
cloudinary.config({
  cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET
});
var allowedExtensions = ["jpg", "jpeg", "png", "webp", "gif", "pdf"];
var uploadFileToCloudinary = async (buffer, fileName) => {
  if (!buffer || !fileName) {
    throw new AppError_default(
      status14.BAD_REQUEST,
      "File buffer and file name are required"
    );
  }
  const extension = fileName.split(".").pop()?.toLowerCase();
  if (!extension || !allowedExtensions.includes(extension)) {
    throw new AppError_default(
      status14.BAD_REQUEST,
      "Only specify files are allowed"
    );
  }
  const fileNameWithoutExtension = fileName.split(".").slice(0, -1).join(".").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const uniqueName = Math.random().toString(36).substring(2) + "-" + Date.now() + "-" + fileNameWithoutExtension;
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "medi-store/images",
        public_id: uniqueName,
        resource_type: "image"
      },
      (error, result) => {
        if (error || !result) {
          return reject(
            new AppError_default(
              status14.INTERNAL_SERVER_ERROR,
              "Failed to upload image to Cloudinary"
            )
          );
        }
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};
var deleteFileFromCloudinary = async (url) => {
  try {
    const regex = /\/v\d+\/(.+?)(?:\.[a-zA-Z0-9]+)+$/;
    const match = url.match(regex);
    if (match?.[1]) {
      const publicId = match[1];
      await cloudinary.uploader.destroy(publicId, {
        resource_type: "image"
      });
    }
  } catch {
    throw new AppError_default(
      status14.INTERNAL_SERVER_ERROR,
      "Failed to delete image from Cloudinary"
    );
  }
};

// src/modules/file/file.service.ts
var uploadImage = async (files) => {
  if (!files || files.length === 0) {
    throw new AppError_default(status15.BAD_REQUEST, "No file uploaded");
  }
  if (files.length === 1) {
    const uploaded = await uploadFileToCloudinary(
      files[0].buffer,
      files[0].originalname
    );
    return {
      url: uploaded.secure_url
    };
  }
  const uploadedImages = await Promise.all(
    files.map(async (file) => {
      const uploaded = await uploadFileToCloudinary(
        file.buffer,
        file.originalname
      );
      return {
        url: uploaded.secure_url
      };
    })
  );
  return uploadedImages;
};
var deleteImage = async (urls) => {
  if (!urls) {
    throw new AppError_default(status15.BAD_REQUEST, "Image URL is required");
  }
  if (Array.isArray(urls)) {
    await Promise.all(urls.map((url) => deleteFileFromCloudinary(url)));
    return null;
  }
  await deleteFileFromCloudinary(urls);
  return null;
};
var FileService = {
  uploadImage,
  deleteImage
};

// src/modules/file/file.controller.ts
var uploadImage2 = async (req, res) => {
  const files = req.files;
  if (!files || files.length === 0) {
    throw new AppError_default(status16.BAD_REQUEST, "No file uploaded");
  }
  if (files.length > 10) {
    throw new AppError_default(status16.BAD_REQUEST, "Maximum 10 images are allowed");
  }
  const result = await FileService.uploadImage(files);
  sendResponse_default(res, {
    statusCode: status16.OK,
    success: true,
    message: "Image uploaded successfully",
    data: result
  });
};
var deleteImage2 = async (req, res, next) => {
  const { url } = req.body;
  const result = await FileService.deleteImage(url);
  sendResponse_default(res, {
    statusCode: status16.OK,
    success: true,
    message: "Image deleted successfully",
    data: result
  });
};
var FileController = {
  uploadImage: uploadImage2,
  deleteImage: deleteImage2
};

// src/config/multer.config.ts
import multer from "multer";
var allowedExtensions2 = ["jpg", "jpeg", "png", "webp", "gif", "pdf"];
var storage = multer.memoryStorage();
var fileFilter = (req, file, cb) => {
  const extension = file.originalname.split(".").pop()?.toLowerCase();
  if (!extension || !allowedExtensions2.includes(extension)) {
    return cb(new AppError_default(400, "Only specify files are allowed"));
  }
  cb(null, true);
};
var multerUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
    // 5MB
  }
});

// src/modules/file/file.route.ts
var router12 = Router12();
router12.post(
  "/upload-image",
  multerUpload.array("file", 10),
  // supports 1 or many
  FileController.uploadImage
);
router12.delete(
  "/delete-image",
  FileController.deleteImage
);
var FileRoutes = router12;

// src/modules/audit/audit.route.ts
import { Router as Router13 } from "express";

// src/modules/audit/audit.controller.ts
import status17 from "http-status";
var getAuditLogs2 = async (req, res, next) => {
  try {
    const result = await auditService.getAuditLogs(req.query);
    sendResponse_default(res, { statusCode: status17.OK, success: true, message: "Audit logs fetched", data: result });
  } catch (e) {
    next(e);
  }
};
var auditController = { getAuditLogs: getAuditLogs2 };

// src/modules/audit/audit.route.ts
var router13 = Router13();
router13.get("/", auth(Role.ADMIN), auditController.getAuditLogs);
var auditRouter = router13;

// src/routes/index.ts
var router14 = Router14();
var moduleRoutes = [
  {
    path: "/file",
    route: FileRoutes
  },
  {
    path: "/auth",
    route: authRouter
  },
  {
    path: "/medicine",
    route: medicineRouter
  },
  {
    path: "/order",
    route: orderRouter
  },
  {
    path: "/category",
    route: categoryRouter
  },
  {
    path: "/admin",
    route: adminRouter
  },
  {
    path: "/user",
    route: userRouter
  },
  {
    path: "/review",
    route: reviewRouter
  },
  {
    path: "/address",
    route: addressRouter
  },
  {
    path: "/coupon",
    route: couponRouter
  },
  {
    path: "/notification",
    route: notificationRouter
  },
  {
    path: "/payment",
    route: paymentRouter
  },
  {
    path: "/audit",
    route: auditRouter
  }
];
moduleRoutes.forEach((route) => router14.use(route.path, route.route));
var routes_default = router14;

// src/app.ts
var app = express2();
app.use(express2.json({ limit: "10mb" }));
app.use(express2.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      envVars.FRONTEND_URL,
      "http://localhost:3000",
      "http://localhost:3001",
      "https://sandbox.sslcommerz.com",
      "https://securepay.sslcommerz.com"
    ];
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true
}));
app.use(cookieParser());
app.use(express2.json());
app.use("/api", routes_default);
app.get("/", (req, res) => {
  res.send("Hello, World!");
});
app.use(notFound);
app.use(globalErrorHandler_default);
var app_default = app;

// src/index.ts
var index_default = app_default;
export {
  index_default as default
};
