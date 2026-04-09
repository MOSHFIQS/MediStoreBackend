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
  "clientVersion": "7.7.0",
  "engineVersion": "75cbdc1eb7150937890ad5465d861175c6624711",
  "activeProvider": "postgresql",
  "inlineSchema": 'model Address {\n  id         String  @id @default(uuid())\n  userId     String\n  user       User    @relation(fields: [userId], references: [id], onDelete: Cascade)\n  label      String? // e.g. "Home", "Office"\n  line1      String\n  line2      String?\n  city       String\n  district   String\n  postalCode String?\n  isDefault  Boolean @default(false)\n\n  orders Order[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("addresses")\n}\n\nmodel AuditLog {\n  id        String  @id @default(uuid())\n  userId    String?\n  user      User?   @relation(fields: [userId], references: [id])\n  action    String // ORDER_CANCELLED, PAYMENT_REFUNDED, USER_BANNED...\n  entity    String // Order, User, Medicine...\n  entityId  String\n  oldValue  Json?\n  newValue  Json?\n  ipAddress String?\n\n  createdAt DateTime @default(now())\n\n  @@map("audit_logs")\n}\n\nmodel User {\n  id       String     @id @default(uuid())\n  name     String\n  email    String     @unique\n  password String\n  image    String?\n  phone    String?\n  role     Role       @default(CUSTOMER)\n  status   UserStatus @default(ACTIVE)\n\n  isEmailVerified Boolean   @default(false)\n  emailVerifiedAt DateTime?\n  lastLoginAt     DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  medicines     Medicine[]     @relation("SellerMedicines")\n  orders        Order[]        @relation("CustomerOrders")\n  reviews       Review[]\n  addresses     Address[]\n  notifications Notification[]\n  auditLogs     AuditLog[]\n\n  @@map("users")\n}\n\n// model Category {\n//      id          String     @id @default(uuid())\n//      name        String     @unique\n//      slug        String     @unique\n//      description String?\n//      image       String?\n//      parentId    String?\n//      parent      Category?  @relation("SubCategories", fields: [parentId], references: [id])\n//      children    Category[] @relation("SubCategories")\n//      medicines   Medicine[]\n\n//      createdAt DateTime @default(now())\n//      updatedAt DateTime @updatedAt\n\n//      @@map("categories")\n// }\n\nmodel Category {\n  id          String     @id @default(uuid())\n  name        String     @unique\n  description String?\n  image       String?\n  medicines   Medicine[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("categories")\n}\n\nmodel Coupon {\n  id             String    @id @default(uuid())\n  code           String    @unique\n  description    String?\n  discountType   String // PERCENTAGE | FIXED\n  discountValue  Float\n  minOrderAmount Float?\n  maxDiscount    Float?\n  usageLimit     Int?\n  usedCount      Int       @default(0)\n  isActive       Boolean   @default(true)\n  expiresAt      DateTime?\n\n  orders Order[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("coupons")\n}\n\nenum Role {\n  CUSTOMER\n  SELLER\n  ADMIN\n}\n\nenum UserStatus {\n  ACTIVE\n  BANNED\n  SUSPENDED\n}\n\nenum OrderStatus {\n  PLACED\n  CONFIRMED\n  PROCESSING\n  SHIPPED\n  DELIVERED\n  CANCELLED\n  REFUNDED\n}\n\nenum PaymentStatus {\n  PENDING\n  INITIATED\n  SUCCESS\n  FAILED\n  CANCELLED\n  REFUNDED\n}\n\nenum PaymentMethod {\n  SSLCOMMERZ\n  CASH_ON_DELIVERY\n  BANK_TRANSFER\n}\n\nenum PrescriptionStatus {\n  PENDING\n  APPROVED\n  REJECTED\n}\n\nenum NotificationType {\n  ORDER_UPDATE\n  PAYMENT_UPDATE\n  PRESCRIPTION_STATUS\n  SYSTEM\n  PROMOTION\n}\n\nmodel Medicine {\n  id            String   @id @default(uuid())\n  name          String\n  genericName   String?\n  slug          String   @unique\n  description   String\n  price         Float\n  discountPrice Float?\n  stock         Int      @default(0)\n  images        String[] // additional gallery images\n  manufacturer  String?\n  brand         String?\n  dosageForm    String? // Tablet, Syrup, Injection...\n  strength      String? // 500mg, 5ml...\n  unit          String   @default("piece")\n  isActive      Boolean  @default(true)\n  sku           String?  @unique\n\n  categoryId String\n  category   Category @relation(fields: [categoryId], references: [id])\n\n  sellerId String\n  seller   User   @relation("SellerMedicines", fields: [sellerId], references: [id])\n\n  reviews    Review[]\n  orderItems OrderItem[]\n  batches    MedicineBatch[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("medicines")\n}\n\nmodel MedicineBatch {\n  id          String   @id @default(uuid())\n  medicineId  String\n  medicine    Medicine @relation(fields: [medicineId], references: [id], onDelete: Cascade)\n  batchNumber String\n  quantity    Int\n  expiryDate  DateTime\n  costPrice   Float\n  isActive    Boolean  @default(true)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("medicine_batches")\n}\n\nmodel Notification {\n  id      String           @id @default(uuid())\n  userId  String\n  user    User             @relation(fields: [userId], references: [id], onDelete: Cascade)\n  type    NotificationType\n  title   String\n  message String\n  isRead  Boolean          @default(false)\n  meta    Json? // extra data, e.g. { orderId, paymentId }\n\n  createdAt DateTime @default(now())\n\n  @@map("notifications")\n}\n\nmodel Order {\n  id         String @id @default(uuid())\n  customerId String\n  customer   User   @relation("CustomerOrders", fields: [customerId], references: [id])\n\n  addressId String?\n  address   Address? @relation(fields: [addressId], references: [id])\n\n  // Snapshot address in case Address is deleted later\n  addressSnapshot Json?\n\n  couponId       String?\n  coupon         Coupon? @relation(fields: [couponId], references: [id])\n  couponDiscount Float   @default(0)\n\n  status      OrderStatus @default(PLACED)\n  subtotal    Float\n  shippingFee Float       @default(0)\n  tax         Float       @default(0)\n  totalPrice  Float\n  notes       String?\n\n  items   OrderItem[]\n  payment Payment?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("orders")\n}\n\nmodel OrderItem {\n  id         String   @id @default(uuid())\n  orderId    String\n  order      Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)\n  medicineId String\n  medicine   Medicine @relation(fields: [medicineId], references: [id])\n\n  // Snapshot at time of purchase\n  medicineName  String\n  medicineImage String?\n  quantity      Int\n  unitPrice     Float\n  totalPrice    Float\n\n  @@map("order_items")\n}\n\nmodel Payment {\n  id      String @id @default(uuid())\n  orderId String @unique\n  order   Order  @relation(fields: [orderId], references: [id])\n\n  method   PaymentMethod @default(SSLCOMMERZ)\n  status   PaymentStatus @default(PENDING)\n  amount   Float\n  currency String        @default("BDT")\n\n  // SSLCommerz specific fields\n  tranId          String? @unique // your generated transaction ID sent to SSLCommerz\n  sessionKey      String? // returned by SSLCommerz on init\n  valId           String? // returned on successful IPN/redirect\n  bankTranId      String? // bank-level transaction ID\n  cardType        String? // VISA, MASTER, bKash, Nagad...\n  cardNo          String? // masked card number\n  storeAmount     Float? // amount after SSLCommerz fee deduction\n  currency_type   String? // currency type returned\n  currency_amount Float?\n  currency_rate   Float?\n  gatewayFee      Float?\n\n  // IPN raw payload (store for audit/reconciliation)\n  ipnPayload Json?\n\n  // Refund\n  refundAmount Float?\n  refundedAt   DateTime?\n  refundRef    String?\n\n  initiatedAt DateTime?\n  paidAt      DateTime?\n  failedAt    DateTime?\n\n  logs PaymentLog[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("payments")\n}\n\nmodel PaymentLog {\n  id        String  @id @default(uuid())\n  paymentId String\n  payment   Payment @relation(fields: [paymentId], references: [id], onDelete: Cascade)\n\n  event      String // INITIATED, IPN_RECEIVED, SUCCESS, FAILED, REFUND_REQUESTED...\n  status     String\n  rawPayload Json? // raw data from SSLCommerz at this event\n  ipAddress  String?\n  note       String?\n\n  createdAt DateTime @default(now())\n\n  @@map("payment_logs")\n}\n\nmodel Review {\n  id                 String  @id @default(uuid())\n  rating             Int // 1\u20135\n  title              String?\n  comment            String\n  isVerifiedPurchase Boolean @default(false)\n\n  userId     String\n  user       User     @relation(fields: [userId], references: [id])\n  medicineId String\n  medicine   Medicine @relation(fields: [medicineId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("reviews")\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"Address":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AddressToUser"},{"name":"label","kind":"scalar","type":"String"},{"name":"line1","kind":"scalar","type":"String"},{"name":"line2","kind":"scalar","type":"String"},{"name":"city","kind":"scalar","type":"String"},{"name":"district","kind":"scalar","type":"String"},{"name":"postalCode","kind":"scalar","type":"String"},{"name":"isDefault","kind":"scalar","type":"Boolean"},{"name":"orders","kind":"object","type":"Order","relationName":"AddressToOrder"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"addresses"},"AuditLog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AuditLogToUser"},{"name":"action","kind":"scalar","type":"String"},{"name":"entity","kind":"scalar","type":"String"},{"name":"entityId","kind":"scalar","type":"String"},{"name":"oldValue","kind":"scalar","type":"Json"},{"name":"newValue","kind":"scalar","type":"Json"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"audit_logs"},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"isEmailVerified","kind":"scalar","type":"Boolean"},{"name":"emailVerifiedAt","kind":"scalar","type":"DateTime"},{"name":"lastLoginAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"medicines","kind":"object","type":"Medicine","relationName":"SellerMedicines"},{"name":"orders","kind":"object","type":"Order","relationName":"CustomerOrders"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"addresses","kind":"object","type":"Address","relationName":"AddressToUser"},{"name":"notifications","kind":"object","type":"Notification","relationName":"NotificationToUser"},{"name":"auditLogs","kind":"object","type":"AuditLog","relationName":"AuditLogToUser"}],"dbName":"users"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"medicines","kind":"object","type":"Medicine","relationName":"CategoryToMedicine"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"categories"},"Coupon":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"code","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"discountType","kind":"scalar","type":"String"},{"name":"discountValue","kind":"scalar","type":"Float"},{"name":"minOrderAmount","kind":"scalar","type":"Float"},{"name":"maxDiscount","kind":"scalar","type":"Float"},{"name":"usageLimit","kind":"scalar","type":"Int"},{"name":"usedCount","kind":"scalar","type":"Int"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"orders","kind":"object","type":"Order","relationName":"CouponToOrder"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"coupons"},"Medicine":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"genericName","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Float"},{"name":"discountPrice","kind":"scalar","type":"Float"},{"name":"stock","kind":"scalar","type":"Int"},{"name":"images","kind":"scalar","type":"String"},{"name":"manufacturer","kind":"scalar","type":"String"},{"name":"brand","kind":"scalar","type":"String"},{"name":"dosageForm","kind":"scalar","type":"String"},{"name":"strength","kind":"scalar","type":"String"},{"name":"unit","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"sku","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToMedicine"},{"name":"sellerId","kind":"scalar","type":"String"},{"name":"seller","kind":"object","type":"User","relationName":"SellerMedicines"},{"name":"reviews","kind":"object","type":"Review","relationName":"MedicineToReview"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"MedicineToOrderItem"},{"name":"batches","kind":"object","type":"MedicineBatch","relationName":"MedicineToMedicineBatch"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"medicines"},"MedicineBatch":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"medicine","kind":"object","type":"Medicine","relationName":"MedicineToMedicineBatch"},{"name":"batchNumber","kind":"scalar","type":"String"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"expiryDate","kind":"scalar","type":"DateTime"},{"name":"costPrice","kind":"scalar","type":"Float"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"medicine_batches"},"Notification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"NotificationToUser"},{"name":"type","kind":"enum","type":"NotificationType"},{"name":"title","kind":"scalar","type":"String"},{"name":"message","kind":"scalar","type":"String"},{"name":"isRead","kind":"scalar","type":"Boolean"},{"name":"meta","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"notifications"},"Order":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"customer","kind":"object","type":"User","relationName":"CustomerOrders"},{"name":"addressId","kind":"scalar","type":"String"},{"name":"address","kind":"object","type":"Address","relationName":"AddressToOrder"},{"name":"addressSnapshot","kind":"scalar","type":"Json"},{"name":"couponId","kind":"scalar","type":"String"},{"name":"coupon","kind":"object","type":"Coupon","relationName":"CouponToOrder"},{"name":"couponDiscount","kind":"scalar","type":"Float"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"subtotal","kind":"scalar","type":"Float"},{"name":"shippingFee","kind":"scalar","type":"Float"},{"name":"tax","kind":"scalar","type":"Float"},{"name":"totalPrice","kind":"scalar","type":"Float"},{"name":"notes","kind":"scalar","type":"String"},{"name":"items","kind":"object","type":"OrderItem","relationName":"OrderToOrderItem"},{"name":"payment","kind":"object","type":"Payment","relationName":"OrderToPayment"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"orders"},"OrderItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToOrderItem"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"medicine","kind":"object","type":"Medicine","relationName":"MedicineToOrderItem"},{"name":"medicineName","kind":"scalar","type":"String"},{"name":"medicineImage","kind":"scalar","type":"String"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"unitPrice","kind":"scalar","type":"Float"},{"name":"totalPrice","kind":"scalar","type":"Float"}],"dbName":"order_items"},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToPayment"},{"name":"method","kind":"enum","type":"PaymentMethod"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"currency","kind":"scalar","type":"String"},{"name":"tranId","kind":"scalar","type":"String"},{"name":"sessionKey","kind":"scalar","type":"String"},{"name":"valId","kind":"scalar","type":"String"},{"name":"bankTranId","kind":"scalar","type":"String"},{"name":"cardType","kind":"scalar","type":"String"},{"name":"cardNo","kind":"scalar","type":"String"},{"name":"storeAmount","kind":"scalar","type":"Float"},{"name":"currency_type","kind":"scalar","type":"String"},{"name":"currency_amount","kind":"scalar","type":"Float"},{"name":"currency_rate","kind":"scalar","type":"Float"},{"name":"gatewayFee","kind":"scalar","type":"Float"},{"name":"ipnPayload","kind":"scalar","type":"Json"},{"name":"refundAmount","kind":"scalar","type":"Float"},{"name":"refundedAt","kind":"scalar","type":"DateTime"},{"name":"refundRef","kind":"scalar","type":"String"},{"name":"initiatedAt","kind":"scalar","type":"DateTime"},{"name":"paidAt","kind":"scalar","type":"DateTime"},{"name":"failedAt","kind":"scalar","type":"DateTime"},{"name":"logs","kind":"object","type":"PaymentLog","relationName":"PaymentToPaymentLog"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"payments"},"PaymentLog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"paymentId","kind":"scalar","type":"String"},{"name":"payment","kind":"object","type":"Payment","relationName":"PaymentToPaymentLog"},{"name":"event","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"},{"name":"rawPayload","kind":"scalar","type":"Json"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"note","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"payment_logs"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"title","kind":"scalar","type":"String"},{"name":"comment","kind":"scalar","type":"String"},{"name":"isVerifiedPurchase","kind":"scalar","type":"Boolean"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"medicine","kind":"object","type":"Medicine","relationName":"MedicineToReview"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"reviews"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","medicines","_count","category","seller","user","medicine","reviews","customer","address","orders","coupon","items","order","payment","logs","orderItems","batches","addresses","notifications","auditLogs","Address.findUnique","Address.findUniqueOrThrow","Address.findFirst","Address.findFirstOrThrow","Address.findMany","data","Address.createOne","Address.createMany","Address.createManyAndReturn","Address.updateOne","Address.updateMany","Address.updateManyAndReturn","create","update","Address.upsertOne","Address.deleteOne","Address.deleteMany","having","_min","_max","Address.groupBy","Address.aggregate","AuditLog.findUnique","AuditLog.findUniqueOrThrow","AuditLog.findFirst","AuditLog.findFirstOrThrow","AuditLog.findMany","AuditLog.createOne","AuditLog.createMany","AuditLog.createManyAndReturn","AuditLog.updateOne","AuditLog.updateMany","AuditLog.updateManyAndReturn","AuditLog.upsertOne","AuditLog.deleteOne","AuditLog.deleteMany","AuditLog.groupBy","AuditLog.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","Category.findUnique","Category.findUniqueOrThrow","Category.findFirst","Category.findFirstOrThrow","Category.findMany","Category.createOne","Category.createMany","Category.createManyAndReturn","Category.updateOne","Category.updateMany","Category.updateManyAndReturn","Category.upsertOne","Category.deleteOne","Category.deleteMany","Category.groupBy","Category.aggregate","Coupon.findUnique","Coupon.findUniqueOrThrow","Coupon.findFirst","Coupon.findFirstOrThrow","Coupon.findMany","Coupon.createOne","Coupon.createMany","Coupon.createManyAndReturn","Coupon.updateOne","Coupon.updateMany","Coupon.updateManyAndReturn","Coupon.upsertOne","Coupon.deleteOne","Coupon.deleteMany","_avg","_sum","Coupon.groupBy","Coupon.aggregate","Medicine.findUnique","Medicine.findUniqueOrThrow","Medicine.findFirst","Medicine.findFirstOrThrow","Medicine.findMany","Medicine.createOne","Medicine.createMany","Medicine.createManyAndReturn","Medicine.updateOne","Medicine.updateMany","Medicine.updateManyAndReturn","Medicine.upsertOne","Medicine.deleteOne","Medicine.deleteMany","Medicine.groupBy","Medicine.aggregate","MedicineBatch.findUnique","MedicineBatch.findUniqueOrThrow","MedicineBatch.findFirst","MedicineBatch.findFirstOrThrow","MedicineBatch.findMany","MedicineBatch.createOne","MedicineBatch.createMany","MedicineBatch.createManyAndReturn","MedicineBatch.updateOne","MedicineBatch.updateMany","MedicineBatch.updateManyAndReturn","MedicineBatch.upsertOne","MedicineBatch.deleteOne","MedicineBatch.deleteMany","MedicineBatch.groupBy","MedicineBatch.aggregate","Notification.findUnique","Notification.findUniqueOrThrow","Notification.findFirst","Notification.findFirstOrThrow","Notification.findMany","Notification.createOne","Notification.createMany","Notification.createManyAndReturn","Notification.updateOne","Notification.updateMany","Notification.updateManyAndReturn","Notification.upsertOne","Notification.deleteOne","Notification.deleteMany","Notification.groupBy","Notification.aggregate","Order.findUnique","Order.findUniqueOrThrow","Order.findFirst","Order.findFirstOrThrow","Order.findMany","Order.createOne","Order.createMany","Order.createManyAndReturn","Order.updateOne","Order.updateMany","Order.updateManyAndReturn","Order.upsertOne","Order.deleteOne","Order.deleteMany","Order.groupBy","Order.aggregate","OrderItem.findUnique","OrderItem.findUniqueOrThrow","OrderItem.findFirst","OrderItem.findFirstOrThrow","OrderItem.findMany","OrderItem.createOne","OrderItem.createMany","OrderItem.createManyAndReturn","OrderItem.updateOne","OrderItem.updateMany","OrderItem.updateManyAndReturn","OrderItem.upsertOne","OrderItem.deleteOne","OrderItem.deleteMany","OrderItem.groupBy","OrderItem.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","PaymentLog.findUnique","PaymentLog.findUniqueOrThrow","PaymentLog.findFirst","PaymentLog.findFirstOrThrow","PaymentLog.findMany","PaymentLog.createOne","PaymentLog.createMany","PaymentLog.createManyAndReturn","PaymentLog.updateOne","PaymentLog.updateMany","PaymentLog.updateManyAndReturn","PaymentLog.upsertOne","PaymentLog.deleteOne","PaymentLog.deleteMany","PaymentLog.groupBy","PaymentLog.aggregate","Review.findUnique","Review.findUniqueOrThrow","Review.findFirst","Review.findFirstOrThrow","Review.findMany","Review.createOne","Review.createMany","Review.createManyAndReturn","Review.updateOne","Review.updateMany","Review.updateManyAndReturn","Review.upsertOne","Review.deleteOne","Review.deleteMany","Review.groupBy","Review.aggregate","AND","OR","NOT","id","rating","title","comment","isVerifiedPurchase","userId","medicineId","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","paymentId","event","status","rawPayload","ipAddress","note","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","orderId","PaymentMethod","method","PaymentStatus","amount","currency","tranId","sessionKey","valId","bankTranId","cardType","cardNo","storeAmount","currency_type","currency_amount","currency_rate","gatewayFee","ipnPayload","refundAmount","refundedAt","refundRef","initiatedAt","paidAt","failedAt","every","some","none","medicineName","medicineImage","quantity","unitPrice","totalPrice","customerId","addressId","addressSnapshot","couponId","couponDiscount","OrderStatus","subtotal","shippingFee","tax","notes","NotificationType","type","message","isRead","meta","batchNumber","expiryDate","costPrice","isActive","name","genericName","slug","description","price","discountPrice","stock","images","manufacturer","brand","dosageForm","strength","unit","sku","categoryId","sellerId","has","hasEvery","hasSome","code","discountType","discountValue","minOrderAmount","maxDiscount","usageLimit","usedCount","expiresAt","image","email","password","phone","Role","role","UserStatus","isEmailVerified","emailVerifiedAt","lastLoginAt","action","entity","entityId","oldValue","newValue","label","line1","line2","city","district","postalCode","isDefault","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide","push"]'),
  graph: "4QZ-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-QFAAJkDACG9AgAAxgO9AiK-AgEAlAMAIb8CIACuAwAhwAIAAJcDACACBwAAgQYAIMACAADYAwAgDAcAAMcDACDvAQAAxQMAMPABAAAuABDxAQAAxQMAMPIBAQAAAAH0AQEAlAMAIfcBAQCUAwAh-QFAAJkDACG9AgAAxgO9AiK-AgEAlAMAIb8CIACuAwAhwAIAAJcDACADAAAALgAgAQAALwAwAgAAMAAgDQcAAMQDACDvAQAAwwMAMPABAAAyABDxAQAAwwMAMPIBAQCUAwAh9wEBAJUDACH5AUAAmQMAIYoCAQCVAwAh6gIBAJQDACHrAgEAlAMAIewCAQCUAwAh7QIAAJcDACDuAgAAlwMAIAUHAACBBgAg9wEAANgDACCKAgAA2AMAIO0CAADYAwAg7gIAANgDACANBwAAxAMAIO8BAADDAwAw8AEAADIAEPEBAADDAwAw8gEBAAAAAfcBAQCVAwAh-QFAAJkDACGKAgEAlQMAIeoCAQCUAwAh6wIBAJQDACHsAgEAlAMAIe0CAACXAwAg7gIAAJcDACADAAAAMgAgAQAAMwAwAgAANAAgFgMAALIDACAJAAC9AwAgDAAArwMAIBQAAL4DACAVAAC_AwAgFgAAwAMAIO8BAAC6AwAw8AEAADYAEPEBAAC6AwAw8gEBAJQDACH5AUAAmQMAIfoBQACZAwAhiAIAALwD5wIixQIBAJQDACHgAgEAlQMAIeECAQCUAwAh4gIBAJQDACHjAgEAlQMAIeUCAAC7A-UCIucCIACuAwAh6AJAAJgDACHpAkAAmAMAIQEAAAA2ACABAAAAAwAgAQAAABUAIAEAAAAJACABAAAAEQAgAQAAAC4AIAEAAAAyACADAAAAFQAgAQAAFgAwAgAAFwAgAQAAABUAIAEAAAABACADAAAAEQAgAQAALAAwAgAAAQAgAwAAABEAIAEAACwAMAIAAAEAIAMAAAARACABAAAsADACAAABACANBwAAgAYAIAwAANEFACDyAQEAAAAB9wEBAAAAAfkBQAAAAAH6AUAAAAAB7wIBAAAAAfACAQAAAAHxAgEAAAAB8gIBAAAAAfMCAQAAAAH0AgEAAAAB9QIgAAAAAQEcAABEACAL8gEBAAAAAfcBAQAAAAH5AUAAAAAB-gFAAAAAAe8CAQAAAAHwAgEAAAAB8QIBAAAAAfICAQAAAAHzAgEAAAAB9AIBAAAAAfUCIAAAAAEBHAAARgAwARwAAEYAMA0HAAD_BQAgDAAAxgUAIPIBAQDeAwAh9wEBAN4DACH5AUAA4gMAIfoBQADiAwAh7wIBAOADACHwAgEA3gMAIfECAQDgAwAh8gIBAN4DACHzAgEA3gMAIfQCAQDgAwAh9QIgAOEDACECAAAAAQAgHAAASQAgC_IBAQDeAwAh9wEBAN4DACH5AUAA4gMAIfoBQADiAwAh7wIBAOADACHwAgEA3gMAIfECAQDgAwAh8gIBAN4DACHzAgEA3gMAIfQCAQDgAwAh9QIgAOEDACECAAAAEQAgHAAASwAgAgAAABEAIBwAAEsAIAMAAAABACAjAABEACAkAABJACABAAAAAQAgAQAAABEAIAYEAAD8BQAgKQAA_gUAICoAAP0FACDvAgAA2AMAIPECAADYAwAg9AIAANgDACAO7wEAAMIDADDwAQAAUgAQ8QEAAMIDADDyAQEA7QIAIfcBAQDtAgAh-QFAAPECACH6AUAA8QIAIe8CAQDvAgAh8AIBAO0CACHxAgEA7wIAIfICAQDtAgAh8wIBAO0CACH0AgEA7wIAIfUCIADwAgAhAwAAABEAIAEAAFEAMCgAAFIAIAMAAAARACABAAAsADACAAABACABAAAANAAgAQAAADQAIAMAAAAyACABAAAzADACAAA0ACADAAAAMgAgAQAAMwAwAgAANAAgAwAAADIAIAEAADMAMAIAADQAIAoHAAD7BQAg8gEBAAAAAfcBAQAAAAH5AUAAAAABigIBAAAAAeoCAQAAAAHrAgEAAAAB7AIBAAAAAe0CgAAAAAHuAoAAAAABARwAAFoAIAnyAQEAAAAB9wEBAAAAAfkBQAAAAAGKAgEAAAAB6gIBAAAAAesCAQAAAAHsAgEAAAAB7QKAAAAAAe4CgAAAAAEBHAAAXAAwARwAAFwAMAEAAAA2ACAKBwAA-gUAIPIBAQDeAwAh9wEBAOADACH5AUAA4gMAIYoCAQDgAwAh6gIBAN4DACHrAgEA3gMAIewCAQDeAwAh7QKAAAAAAe4CgAAAAAECAAAANAAgHAAAYAAgCfIBAQDeAwAh9wEBAOADACH5AUAA4gMAIYoCAQDgAwAh6gIBAN4DACHrAgEA3gMAIewCAQDeAwAh7QKAAAAAAe4CgAAAAAECAAAAMgAgHAAAYgAgAgAAADIAIBwAAGIAIAEAAAA2ACADAAAANAAgIwAAWgAgJAAAYAAgAQAAADQAIAEAAAAyACAHBAAA9wUAICkAAPkFACAqAAD4BQAg9wEAANgDACCKAgAA2AMAIO0CAADYAwAg7gIAANgDACAM7wEAAMEDADDwAQAAagAQ8QEAAMEDADDyAQEA7QIAIfcBAQDvAgAh-QFAAPECACGKAgEA7wIAIeoCAQDtAgAh6wIBAO0CACHsAgEA7QIAIe0CAAD_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_BAAgKQAAwgQAICoAAMEEACBrAADABAAgbAAAwwQAIMYCAADYAwAgygIAANgDACDNAgAA2AMAIM4CAADYAwAgzwIAANgDACDQAgAA2AMAINICAADYAwAgF-8BAACmAwAw8AEAAMkBABDxAQAApgMAMPIBAQDtAgAh-QFAAPECACH6AUAA8QIAIcQCIADwAgAhxQIBAO0CACHGAgEA7wIAIccCAQDtAgAhyAIBAO0CACHJAggAhAMAIcoCCACFAwAhywICAO4CACHMAgAApwMAIM0CAQDvAgAhzgIBAO8CACHPAgEA7wIAIdACAQDvAgAh0QIBAO0CACHSAgEA7wIAIdMCAQDtAgAh1AIBAO0CACEDAAAAAwAgAQAAyAEAMCgAAMkBACADAAAAAwAgAQAABAAwAgAABQAgAQAAACUAIAEAAAAlACADAAAAIwAgAQAAJAAwAgAAJQAgAwAAACMAIAEAACQAMAIAACUAIAMAAAAjACABAAAkADACAAAlACAKCAAAvgQAIPIBAQAAAAH4AQEAAAAB-QFAAAAAAfoBQAAAAAGvAgIAAAABwQIBAAAAAcICQAAAAAHDAggAAAABxAIgAAAAAQEcAADRAQAgCfIBAQAAAAH4AQEAAAAB-QFAAAAAAfoBQAAAAAGvAgIAAAABwQIBAAAAAcICQAAAAAHDAggAAAABxAIgAAAAAQEcAADTAQAwARwAANMBADAKCAAAvQQAIPIBAQDeAwAh-AEBAN4DACH5AUAA4gMAIfoBQADiAwAhrwICAN8DACHBAgEA3gMAIcICQADiAwAhwwIIAPMDACHEAiAA4QMAIQIAAAAlACAcAADWAQAgCfIBAQDeAwAh-AEBAN4DACH5AUAA4gMAIfoBQADiAwAhrwICAN8DACHBAgEA3gMAIcICQADiAwAhwwIIAPMDACHEAiAA4QMAIQIAAAAjACAcAADYAQAgAgAAACMAIBwAANgBACADAAAAJQAgIwAA0QEAICQAANYBACABAAAAJQAgAQAAACMAIAUEAAC4BAAgKQAAuwQAICoAALoEACBrAAC5BAAgbAAAvAQAIAzvAQAApQMAMPABAADfAQAQ8QEAAKUDADDyAQEA7QIAIfgBAQDtAgAh-QFAAPECACH6AUAA8QIAIa8CAgDuAgAhwQIBAO0CACHCAkAA8QIAIcMCCACEAwAhxAIgAPACACEDAAAAIwAgAQAA3gEAMCgAAN8BACADAAAAIwAgAQAAJAAwAgAAJQAgAQAAADAAIAEAAAAwACADAAAALgAgAQAALwAwAgAAMAAgAwAAAC4AIAEAAC8AMAIAADAAIAMAAAAuACABAAAvADACAAAwACAJBwAAtwQAIPIBAQAAAAH0AQEAAAAB9wEBAAAAAfkBQAAAAAG9AgAAAL0CAr4CAQAAAAG_AiAAAAABwAKAAAAAAQEcAADnAQAgCPIBAQAAAAH0AQEAAAAB9wEBAAAAAfkBQAAAAAG9AgAAAL0CAr4CAQAAAAG_AiAAAAABwAKAAAAAAQEcAADpAQAwARwAAOkBADAJBwAAtgQAIPIBAQDeAwAh9AEBAN4DACH3AQEA3gMAIfkBQADiAwAhvQIAALUEvQIivgIBAN4DACG_AiAA4QMAIcACgAAAAAECAAAAMAAgHAAA7AEAIAjyAQEA3gMAIfQBAQDeAwAh9wEBAN4DACH5AUAA4gMAIb0CAAC1BL0CIr4CAQDeAwAhvwIgAOEDACHAAoAAAAABAgAAAC4AIBwAAO4BACACAAAALgAgHAAA7gEAIAMAAAAwACAjAADnAQAgJAAA7AEAIAEAAAAwACABAAAALgAgBAQAALIEACApAAC0BAAgKgAAswQAIMACAADYAwAgC-8BAAChAwAw8AEAAPUBABDxAQAAoQMAMPIBAQDtAgAh9AEBAO0CACH3AQEA7QIAIfkBQADxAgAhvQIAAKIDvQIivgIBAO0CACG_AiAA8AIAIcACAAD_AgAgAwAAAC4AIAEAAPQBADAoAAD1AQAgAwAAAC4AIAEAAC8AMAIAADAAIAEAAAAXACABAAAAFwAgAwAAABUAIAEAABYAMAIAABcAIAMAAAAVACABAAAWADACAAAXACADAAAAFQAgAQAAFgAwAgAAFwAgEwoAAK0EACALAACuBAAgDQAArwQAIA4AALAEACAQAACxBAAg8gEBAAAAAfkBQAAAAAH6AUAAAAABiAIAAAC4AgKxAggAAAABsgIBAAAAAbMCAQAAAAG0AoAAAAABtQIBAAAAAbYCCAAAAAG4AggAAAABuQIIAAAAAboCCAAAAAG7AgEAAAABARwAAP0BACAO8gEBAAAAAfkBQAAAAAH6AUAAAAABiAIAAAC4AgKxAggAAAABsgIBAAAAAbMCAQAAAAG0AoAAAAABtQIBAAAAAbYCCAAAAAG4AggAAAABuQIIAAAAAboCCAAAAAG7AgEAAAABARwAAP8BADABHAAA_wEAMAEAAAARACABAAAAEwAgEwoAAJcEACALAACYBAAgDQAAmQQAIA4AAJoEACAQAACbBAAg8gEBAN4DACH5AUAA4gMAIfoBQADiAwAhiAIAAJYEuAIisQIIAPMDACGyAgEA3gMAIbMCAQDgAwAhtAKAAAAAAbUCAQDgAwAhtgIIAPMDACG4AggA8wMAIbkCCADzAwAhugIIAPMDACG7AgEA4AMAIQIAAAAXACAcAACEAgAgDvIBAQDeAwAh-QFAAOIDACH6AUAA4gMAIYgCAACWBLgCIrECCADzAwAhsgIBAN4DACGzAgEA4AMAIbQCgAAAAAG1AgEA4AMAIbYCCADzAwAhuAIIAPMDACG5AggA8wMAIboCCADzAwAhuwIBAOADACECAAAAFQAgHAAAhgIAIAIAAAAVACAcAACGAgAgAQAAABEAIAEAAAATACADAAAAFwAgIwAA_QEAICQAAIQCACABAAAAFwAgAQAAABUAIAkEAACRBAAgKQAAlAQAICoAAJMEACBrAACSBAAgbAAAlQQAILMCAADYAwAgtAIAANgDACC1AgAA2AMAILsCAADYAwAgEe8BAACdAwAw8AEAAI8CABDxAQAAnQMAMPIBAQDtAgAh-QFAAPECACH6AUAA8QIAIYgCAACeA7gCIrECCACEAwAhsgIBAO0CACGzAgEA7wIAIbQCAAD_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_AgAgigIBAO8CACGLAgEA7wIAIQMAAAAdACABAADSAgAwKAAA0wIAIAMAAAAdACABAAAeADACAAAfACABAAAACwAgAQAAAAsAIAMAAAAJACABAAAKADACAAALACADAAAACQAgAQAACgAwAgAACwAgAwAAAAkAIAEAAAoAMAIAAAsAIAsHAADlAwAgCAAA5gMAIPIBAQAAAAHzAQIAAAAB9AEBAAAAAfUBAQAAAAH2ASAAAAAB9wEBAAAAAfgBAQAAAAH5AUAAAAAB-gFAAAAAAQEcAADbAgAgCfIBAQAAAAHzAQIAAAAB9AEBAAAAAfUBAQAAAAH2ASAAAAAB9wEBAAAAAfgBAQAAAAH5AUAAAAAB-gFAAAAAAQEcAADdAgAwARwAAN0CADALBwAA4wMAIAgAAOQDACDyAQEA3gMAIfMBAgDfAwAh9AEBAOADACH1AQEA3gMAIfYBIADhAwAh9wEBAN4DACH4AQEA3gMAIfkBQADiAwAh-gFAAOIDACECAAAACwAgHAAA4AIAIAnyAQEA3gMAIfMBAgDfAwAh9AEBAOADACH1AQEA3gMAIfYBIADhAwAh9wEBAN4DACH4AQEA3gMAIfkBQADiAwAh-gFAAOIDACECAAAACQAgHAAA4gIAIAIAAAAJACAcAADiAgAgAwAAAAsAICMAANsCACAkAADgAgAgAQAAAAsAIAEAAAAJACAGBAAA2QMAICkAANwDACAqAADbAwAgawAA2gMAIGwAAN0DACD0AQAA2AMAIAzvAQAA7AIAMPABAADpAgAQ8QEAAOwCADDyAQEA7QIAIfMBAgDuAgAh9AEBAO8CACH1AQEA7QIAIfYBIADwAgAh9wEBAO0CACH4AQEA7QIAIfkBQADxAgAh-gFAAPECACEDAAAACQAgAQAA6AIAMCgAAOkCACADAAAACQAgAQAACgAwAgAACwAgDO8BAADsAgAw8AEAAOkCABDxAQAA7AIAMPIBAQDtAgAh8wECAO4CACH0AQEA7wIAIfUBAQDtAgAh9gEgAPACACH3AQEA7QIAIfgBAQDtAgAh-QFAAPECACH6AUAA8QIAIQ4EAADzAgAgKQAA_QIAICoAAP0CACD7AQEAAAAB_AEBAAAABP0BAQAAAAT-AQEAAAAB_wEBAAAAAYACAQAAAAGBAgEAAAABggIBAPwCACGDAgEAAAABhAIBAAAAAYUCAQAAAAENBAAA8wIAICkAAPMCACAqAADzAgAgawAA-wIAIGwAAPMCACD7AQIAAAAB_AECAAAABP0BAgAAAAT-AQIAAAAB_wECAAAAAYACAgAAAAGBAgIAAAABggICAPoCACEOBAAA-AIAICkAAPkCACAqAAD5AgAg-wEBAAAAAfwBAQAAAAX9AQEAAAAF_gEBAAAAAf8BAQAAAAGAAgEAAAABgQIBAAAAAYICAQD3AgAhgwIBAAAAAYQCAQAAAAGFAgEAAAABBQQAAPMCACApAAD2AgAgKgAA9gIAIPsBIAAAAAGCAiAA9QIAIQsEAADzAgAgKQAA9AIAICoAAPQCACD7AUAAAAAB_AFAAAAABP0BQAAAAAT-AUAAAAAB_wFAAAAAAYACQAAAAAGBAkAAAAABggJAAPICACELBAAA8wIAICkAAPQCACAqAAD0AgAg-wFAAAAAAfwBQAAAAAT9AUAAAAAE_gFAAAAAAf8BQAAAAAGAAkAAAAABgQJAAAAAAYICQADyAgAhCPsBAgAAAAH8AQIAAAAE_QECAAAABP4BAgAAAAH_AQIAAAABgAICAAAAAYECAgAAAAGCAgIA8wIAIQj7AUAAAAAB_AFAAAAABP0BQAAAAAT-AUAAAAAB_wFAAAAAAYACQAAAAAGBAkAAAAABggJAAPQCACEFBAAA8wIAICkAAPYCACAqAAD2AgAg-wEgAAAAAYICIAD1AgAhAvsBIAAAAAGCAiAA9gIAIQ4EAAD4AgAgKQAA-QIAICoAAPkCACD7AQEAAAAB_AEBAAAABf0BAQAAAAX-AQEAAAAB_wEBAAAAAYACAQAAAAGBAgEAAAABggIBAPcCACGDAgEAAAABhAIBAAAAAYUCAQAAAAEI-wECAAAAAfwBAgAAAAX9AQIAAAAF_gECAAAAAf8BAgAAAAGAAgIAAAABgQICAAAAAYICAgD4AgAhC_sBAQAAAAH8AQEAAAAF_QEBAAAABf4BAQAAAAH_AQEAAAABgAIBAAAAAYECAQAAAAGCAgEA-QIAIYMCAQAAAAGEAgEAAAABhQIBAAAAAQ0EAADzAgAgKQAA8wIAICoAAPMCACBrAAD7AgAgbAAA8wIAIPsBAgAAAAH8AQIAAAAE_QECAAAABP4BAgAAAAH_AQIAAAABgAICAAAAAYECAgAAAAGCAgIA-gIAIQj7AQgAAAAB_AEIAAAABP0BCAAAAAT-AQgAAAAB_wEIAAAAAYACCAAAAAGBAggAAAABggIIAPsCACEOBAAA8wIAICkAAP0CACAqAAD9AgAg-wEBAAAAAfwBAQAAAAT9AQEAAAAE_gEBAAAAAf8BAQAAAAGAAgEAAAABgQIBAAAAAYICAQD8AgAhgwIBAAAAAYQCAQAAAAGFAgEAAAABC_sBAQAAAAH8AQEAAAAE_QEBAAAABP4BAQAAAAH_AQEAAAABgAIBAAAAAYECAQAAAAGCAgEA_QIAIYMCAQAAAAGEAgEAAAABhQIBAAAAAQvvAQAA_gIAMPABAADTAgAQ8QEAAP4CADDyAQEA7QIAIfkBQADxAgAhhgIBAO0CACGHAgEA7QIAIYgCAQDtAgAhiQIAAP8CACCKAgEA7wIAIYsCAQDvAgAhDwQAAPgCACApAACAAwAgKgAAgAMAIPsBgAAAAAH-AYAAAAAB_wGAAAAAAYACgAAAAAGBAoAAAAABggKAAAAAAYwCAQAAAAGNAgEAAAABjgIBAAAAAY8CgAAAAAGQAoAAAAABkQKAAAAAAQz7AYAAAAAB_gGAAAAAAf8BgAAAAAGAAoAAAAABgQKAAAAAAYICgAAAAAGMAgEAAAABjQIBAAAAAY4CAQAAAAGPAoAAAAABkAKAAAAAAZECgAAAAAEd7wEAAIEDADDwAQAAvQIAEPEBAACBAwAw8gEBAO0CACH5AUAA8QIAIfoBQADxAgAhiAIAAIMDlgIikgIBAO0CACGUAgAAggOUAiKWAggAhAMAIZcCAQDtAgAhmAIBAO8CACGZAgEA7wIAIZoCAQDvAgAhmwIBAO8CACGcAgEA7wIAIZ0CAQDvAgAhngIIAIUDACGfAgEA7wIAIaACCACFAwAhoQIIAIUDACGiAggAhQMAIaMCAAD_AgAgpAIIAIUDACGlAkAAhgMAIaYCAQDvAgAhpwJAAIYDACGoAkAAhgMAIakCQACGAwAhBwQAAPMCACApAACPAwAgKgAAjwMAIPsBAAAAlAIC_AEAAACUAgj9AQAAAJQCCIICAACOA5QCIgcEAADzAgAgKQAAjQMAICoAAI0DACD7AQAAAJYCAvwBAAAAlgII_QEAAACWAgiCAgAAjAOWAiINBAAA8wIAICkAAPsCACAqAAD7AgAgawAA-wIAIGwAAPsCACD7AQgAAAAB_AEIAAAABP0BCAAAAAT-AQgAAAAB_wEIAAAAAYACCAAAAAGBAggAAAABggIIAIsDACENBAAA-AIAICkAAIoDACAqAACKAwAgawAAigMAIGwAAIoDACD7AQgAAAAB_AEIAAAABf0BCAAAAAX-AQgAAAAB_wEIAAAAAYACCAAAAAGBAggAAAABggIIAIkDACELBAAA-AIAICkAAIgDACAqAACIAwAg-wFAAAAAAfwBQAAAAAX9AUAAAAAF_gFAAAAAAf8BQAAAAAGAAkAAAAABgQJAAAAAAYICQACHAwAhCwQAAPgCACApAACIAwAgKgAAiAMAIPsBQAAAAAH8AUAAAAAF_QFAAAAABf4BQAAAAAH_AUAAAAABgAJAAAAAAYECQAAAAAGCAkAAhwMAIQj7AUAAAAAB_AFAAAAABf0BQAAAAAX-AUAAAAAB_wFAAAAAAYACQAAAAAGBAkAAAAABggJAAIgDACENBAAA-AIAICkAAIoDACAqAACKAwAgawAAigMAIGwAAIoDACD7AQgAAAAB_AEIAAAABf0BCAAAAAX-AQgAAAAB_wEIAAAAAYACCAAAAAGBAggAAAABggIIAIkDACEI-wEIAAAAAfwBCAAAAAX9AQgAAAAF_gEIAAAAAf8BCAAAAAGAAggAAAABgQIIAAAAAYICCACKAwAhDQQAAPMCACApAAD7AgAgKgAA-wIAIGsAAPsCACBsAAD7AgAg-wEIAAAAAfwBCAAAAAT9AQgAAAAE_gEIAAAAAf8BCAAAAAGAAggAAAABgQIIAAAAAYICCACLAwAhBwQAAPMCACApAACNAwAgKgAAjQMAIPsBAAAAlgIC_AEAAACWAgj9AQAAAJYCCIICAACMA5YCIgT7AQAAAJYCAvwBAAAAlgII_QEAAACWAgiCAgAAjQOWAiIHBAAA8wIAICkAAI8DACAqAACPAwAg-wEAAACUAgL8AQAAAJQCCP0BAAAAlAIIggIAAI4DlAIiBPsBAAAAlAIC_AEAAACUAgj9AQAAAJQCCIICAACPA5QCIh8PAACaAwAgEQAAmwMAIO8BAACQAwAw8AEAABsAEPEBAACQAwAw8gEBAJQDACH5AUAAmQMAIfoBQACZAwAhiAIAAJIDlgIikgIBAJQDACGUAgAAkQOUAiKWAggAkwMAIZcCAQCUAwAhmAIBAJUDACGZAgEAlQMAIZoCAQCVAwAhmwIBAJUDACGcAgEAlQMAIZ0CAQCVAwAhngIIAJYDACGfAgEAlQMAIaACCACWAwAhoQIIAJYDACGiAggAlgMAIaMCAACXAwAgpAIIAJYDACGlAkAAmAMAIaYCAQCVAwAhpwJAAJgDACGoAkAAmAMAIakCQACYAwAhBPsBAAAAlAIC_AEAAACUAgj9AQAAAJQCCIICAACPA5QCIgT7AQAAAJYCAvwBAAAAlgII_QEAAACWAgiCAgAAjQOWAiII-wEIAAAAAfwBCAAAAAT9AQgAAAAE_gEIAAAAAf8BCAAAAAGAAggAAAABgQIIAAAAAYICCAD7AgAhC_sBAQAAAAH8AQEAAAAE_QEBAAAABP4BAQAAAAH_AQEAAAABgAIBAAAAAYECAQAAAAGCAgEA_QIAIYMCAQAAAAGEAgEAAAABhQIBAAAAAQv7AQEAAAAB_AEBAAAABf0BAQAAAAX-AQEAAAAB_wEBAAAAAYACAQAAAAGBAgEAAAABggIBAPkCACGDAgEAAAABhAIBAAAAAYUCAQAAAAEI-wEIAAAAAfwBCAAAAAX9AQgAAAAF_gEIAAAAAf8BCAAAAAGAAggAAAABgQIIAAAAAYICCACKAwAhDPsBgAAAAAH-AYAAAAAB_wGAAAAAAYACgAAAAAGBAoAAAAABggKAAAAAAYwCAQAAAAGNAgEAAAABjgIBAAAAAY8CgAAAAAGQAoAAAAABkQKAAAAAAQj7AUAAAAAB_AFAAAAABf0BQAAAAAX-AUAAAAAB_wFAAAAAAYACQAAAAAGBAkAAAAABggJAAIgDACEI-wFAAAAAAfwBQAAAAAT9AUAAAAAE_gFAAAAAAf8BQAAAAAGAAkAAAAABgQJAAAAAAYICQAD0AgAhGAoAAMcDACALAADOAwAgDQAAzwMAIA4AANADACAQAADRAwAg7wEAAMwDADDwAQAAFQAQ8QEAAMwDADDyAQEAlAMAIfkBQACZAwAh-gFAAJkDACGIAgAAzQO4AiKxAggAkwMAIbICAQCUAwAhswIBAJUDACG0AgAAlwMAILUCAQCVAwAhtgIIAJMDACG4AggAkwMAIbkCCACTAwAhugIIAJMDACG7AgEAlQMAIfYCAAAVACD3AgAAFQAgA6oCAAAdACCrAgAAHQAgrAIAAB0AIAvvAQAAnAMAMPABAAClAgAQ8QEAAJwDADDyAQEA7QIAIfgBAQDtAgAhkgIBAO0CACGtAgEA7QIAIa4CAQDvAgAhrwICAO4CACGwAggAhAMAIbECCACEAwAhEe8BAACdAwAw8AEAAI8CABDxAQAAnQMAMPIBAQDtAgAh-QFAAPECACH6AUAA8QIAIYgCAACeA7gCIrECCACEAwAhsgIBAO0CACGzAgEA7wIAIbQCAAD_AgAgtQIBAO8CACG2AggAhAMAIbgCCACEAwAhuQIIAIQDACG6AggAhAMAIbsCAQDvAgAhBwQAAPMCACApAACgAwAgKgAAoAMAIPsBAAAAuAIC_AEAAAC4Agj9AQAAALgCCIICAACfA7gCIgcEAADzAgAgKQAAoAMAICoAAKADACD7AQAAALgCAvwBAAAAuAII_QEAAAC4AgiCAgAAnwO4AiIE-wEAAAC4AgL8AQAAALgCCP0BAAAAuAIIggIAAKADuAIiC-8BAAChAwAw8AEAAPUBABDxAQAAoQMAMPIBAQDtAgAh9AEBAO0CACH3AQEA7QIAIfkBQADxAgAhvQIAAKIDvQIivgIBAO0CACG_AiAA8AIAIcACAAD_AgAgBwQAAPMCACApAACkAwAgKgAApAMAIPsBAAAAvQIC_AEAAAC9Agj9AQAAAL0CCIICAACjA70CIgcEAADzAgAgKQAApAMAICoAAKQDACD7AQAAAL0CAvwBAAAAvQII_QEAAAC9AgiCAgAAowO9AiIE-wEAAAC9AgL8AQAAAL0CCP0BAAAAvQIIggIAAKQDvQIiDO8BAAClAwAw8AEAAN8BABDxAQAApQMAMPIBAQDtAgAh-AEBAO0CACH5AUAA8QIAIfoBQADxAgAhrwICAO4CACHBAgEA7QIAIcICQADxAgAhwwIIAIQDACHEAiAA8AIAIRfvAQAApgMAMPABAADJAQAQ8QEAAKYDADDyAQEA7QIAIfkBQADxAgAh-gFAAPECACHEAiAA8AIAIcUCAQDtAgAhxgIBAO8CACHHAgEA7QIAIcgCAQDtAgAhyQIIAIQDACHKAggAhQMAIcsCAgDuAgAhzAIAAKcDACDNAgEA7wIAIc4CAQDvAgAhzwIBAO8CACHQAgEA7wIAIdECAQDtAgAh0gIBAO8CACHTAgEA7QIAIdQCAQDtAgAhBPsBAQAAAAXVAgEAAAAB1gIBAAAABNcCAQAAAAQQ7wEAAKgDADDwAQAAswEAEPEBAACoAwAw8gEBAO0CACH5AUAA8QIAIfoBQADxAgAhxAIgAPACACHIAgEA7wIAIdgCAQDtAgAh2QIBAO0CACHaAggAhAMAIdsCCACFAwAh3AIIAIUDACHdAgIAqQMAId4CAgDuAgAh3wJAAIYDACENBAAA-AIAICkAAPgCACAqAAD4AgAgawAAigMAIGwAAPgCACD7AQIAAAAB_AECAAAABf0BAgAAAAX-AQIAAAAB_wECAAAAAYACAgAAAAGBAgIAAAABggICAKoDACENBAAA-AIAICkAAPgCACAqAAD4AgAgawAAigMAIGwAAPgCACD7AQIAAAAB_AECAAAABf0BAgAAAAX-AQIAAAAB_wECAAAAAYACAgAAAAGBAgIAAAABggICAKoDACERDAAArwMAIO8BAACrAwAw8AEAABMAEPEBAACrAwAw8gEBAJQDACH5AUAAmQMAIfoBQACZAwAhxAIgAK4DACHIAgEAlQMAIdgCAQCUAwAh2QIBAJQDACHaAggAkwMAIdsCCACWAwAh3AIIAJYDACHdAgIArAMAId4CAgCtAwAh3wJAAJgDACEI-wECAAAAAfwBAgAAAAX9AQIAAAAF_gECAAAAAf8BAgAAAAGAAgIAAAABgQICAAAAAYICAgD4AgAhCPsBAgAAAAH8AQIAAAAE_QECAAAABP4BAgAAAAH_AQIAAAABgAICAAAAAYECAgAAAAGCAgIA8wIAIQL7ASAAAAABggIgAPYCACEDqgIAABUAIKsCAAAVACCsAgAAFQAgCe8BAACwAwAw8AEAAJsBABDxAQAAsAMAMPIBAQDtAgAh-QFAAPECACH6AUAA8QIAIcUCAQDtAgAhyAIBAO8CACHgAgEA7wIAIQoDAACyAwAg7wEAALEDADDwAQAAiAEAEPEBAACxAwAw8gEBAJQDACH5AUAAmQMAIfoBQACZAwAhxQIBAJQDACHIAgEAlQMAIeACAQCVAwAhA6oCAAADACCrAgAAAwAgrAIAAAMAIBDvAQAAswMAMPABAACCAQAQ8QEAALMDADDyAQEA7QIAIfkBQADxAgAh-gFAAPECACGIAgAAtQPnAiLFAgEA7QIAIeACAQDvAgAh4QIBAO0CACHiAgEA7QIAIeMCAQDvAgAh5QIAALQD5QIi5wIgAPACACHoAkAAhgMAIekCQACGAwAhBwQAAPMCACApAAC5AwAgKgAAuQMAIPsBAAAA5QIC_AEAAADlAgj9AQAAAOUCCIICAAC4A-UCIgcEAADzAgAgKQAAtwMAICoAALcDACD7AQAAAOcCAvwBAAAA5wII_QEAAADnAgiCAgAAtgPnAiIHBAAA8wIAICkAALcDACAqAAC3AwAg-wEAAADnAgL8AQAAAOcCCP0BAAAA5wIIggIAALYD5wIiBPsBAAAA5wIC_AEAAADnAgj9AQAAAOcCCIICAAC3A-cCIgcEAADzAgAgKQAAuQMAICoAALkDACD7AQAAAOUCAvwBAAAA5QII_QEAAADlAgiCAgAAuAPlAiIE-wEAAADlAgL8AQAAAOUCCP0BAAAA5QIIggIAALkD5QIiFgMAALIDACAJAAC9AwAgDAAArwMAIBQAAL4DACAVAAC_AwAgFgAAwAMAIO8BAAC6AwAw8AEAADYAEPEBAAC6AwAw8gEBAJQDACH5AUAAmQMAIfoBQACZAwAhiAIAALwD5wIixQIBAJQDACHgAgEAlQMAIeECAQCUAwAh4gIBAJQDACHjAgEAlQMAIeUCAAC7A-UCIucCIACuAwAh6AJAAJgDACHpAkAAmAMAIQT7AQAAAOUCAvwBAAAA5QII_QEAAADlAgiCAgAAuQPlAiIE-wEAAADnAgL8AQAAAOcCCP0BAAAA5wIIggIAALcD5wIiA6oCAAAJACCrAgAACQAgrAIAAAkAIAOqAgAAEQAgqwIAABEAIKwCAAARACADqgIAAC4AIKsCAAAuACCsAgAALgAgA6oCAAAyACCrAgAAMgAgrAIAADIAIAzvAQAAwQMAMPABAABqABDxAQAAwQMAMPIBAQDtAgAh9wEBAO8CACH5AUAA8QIAIYoCAQDvAgAh6gIBAO0CACHrAgEA7QIAIewCAQDtAgAh7QIAAP8CACDuAgAA_wIAIA7vAQAAwgMAMPABAABSABDxAQAAwgMAMPIBAQDtAgAh9wEBAO0CACH5AUAA8QIAIfoBQADxAgAh7wIBAO8CACHwAgEA7QIAIfECAQDvAgAh8gIBAO0CACHzAgEA7QIAIfQCAQDvAgAh9QIgAPACACENBwAAxAMAIO8BAADDAwAw8AEAADIAEPEBAADDAwAw8gEBAJQDACH3AQEAlQMAIfkBQACZAwAhigIBAJUDACHqAgEAlAMAIesCAQCUAwAh7AIBAJQDACHtAgAAlwMAIO4CAACXAwAgGAMAALIDACAJAAC9AwAgDAAArwMAIBQAAL4DACAVAAC_AwAgFgAAwAMAIO8BAAC6AwAw8AEAADYAEPEBAAC6AwAw8gEBAJQDACH5AUAAmQMAIfoBQACZAwAhiAIAALwD5wIixQIBAJQDACHgAgEAlQMAIeECAQCUAwAh4gIBAJQDACHjAgEAlQMAIeUCAAC7A-UCIucCIACuAwAh6AJAAJgDACHpAkAAmAMAIfYCAAA2ACD3AgAANgAgDAcAAMcDACDvAQAAxQMAMPABAAAuABDxAQAAxQMAMPIBAQCUAwAh9AEBAJQDACH3AQEAlAMAIfkBQACZAwAhvQIAAMYDvQIivgIBAJQDACG_AiAArgMAIcACAACXAwAgBPsBAAAAvQIC_AEAAAC9Agj9AQAAAL0CCIICAACkA70CIhgDAACyAwAgCQAAvQMAIAwAAK8DACAUAAC-AwAgFQAAvwMAIBYAAMADACDvAQAAugMAMPABAAA2ABDxAQAAugMAMPIBAQCUAwAh-QFAAJkDACH6AUAAmQMAIYgCAAC8A-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-gFAAJkDACEcBQAA1gMAIAYAAMcDACAJAAC9AwAgEgAA0AMAIBMAANcDACDvAQAA1QMAMPABAAADABDxAQAA1QMAMPIBAQCUAwAh-QFAAJkDACH6AUAAmQMAIcQCIACuAwAhxQIBAJQDACHGAgEAlQMAIccCAQCUAwAhyAIBAJQDACHJAggAkwMAIcoCCACWAwAhywICAK0DACHMAgAApwMAIM0CAQCVAwAhzgIBAJUDACHPAgEAlQMAIdACAQCVAwAh0QIBAJQDACHSAgEAlQMAIdMCAQCUAwAh1AIBAJQDACEMAwAAsgMAIO8BAACxAwAw8AEAAIgBABDxAQAAsQMAMPIBAQCUAwAh-QFAAJkDACH6AUAAmQMAIcUCAQCUAwAhyAIBAJUDACHgAgEAlQMAIfYCAACIAQAg9wIAAIgBACADqgIAACMAIKsCAAAjACCsAgAAIwAgAAAAAAAAAfsCAQAAAAEF-wICAAAAAYEDAgAAAAGCAwIAAAABgwMCAAAAAYQDAgAAAAEB-wIBAAAAAQH7AiAAAAABAfsCQAAAAAEFIwAA2gYAICQAAOAGACD4AgAA2wYAIPkCAADfBgAg_gIAAG0AIAUjAADYBgAgJAAA3QYAIPgCAADZBgAg-QIAANwGACD-AgAABQAgAyMAANoGACD4AgAA2wYAIP4CAABtACADIwAA2AYAIPgCAADZBgAg_gIAAAUAIAAAAAUjAADTBgAgJAAA1gYAIPgCAADUBgAg-QIAANUGACD-AgAAqAIAIAMjAADTBgAg-AIAANQGACD-AgAAqAIAIAAAAAAAAfsCAAAAlAICAfsCAAAAlgICBfsCCAAAAAGBAwgAAAABggMIAAAAAYMDCAAAAAGEAwgAAAABBfsCCAAAAAGBAwgAAAABggMIAAAAAYMDCAAAAAGEAwgAAAABAfsCQAAAAAEFIwAAzQYAICQAANEGACD4AgAAzgYAIPkCAADQBgAg_gIAABcAIAsjAAD4AwAwJAAA_QMAMPgCAAD5AwAw-QIAAPoDADD6AgAA-wMAIPsCAAD8AwAw_AIAAPwDADD9AgAA_AMAMP4CAAD8AwAw_wIAAP4DADCAAwAA_wMAMAfyAQEAAAAB-QFAAAAAAYcCAQAAAAGIAgEAAAABiQKAAAAAAYoCAQAAAAGLAgEAAAABAgAAAB8AICMAAIMEACADAAAAHwAgIwAAgwQAICQAAIIEACABHAAAzwYAMAwQAADLAwAg7wEAAMoDADDwAQAAHQAQ8QEAAMoDADDyAQEAAAAB-QFAAJkDACGGAgEAlAMAIYcCAQCUAwAhiAIBAJQDACGJAgAAlwMAIIoCAQCVAwAhiwIBAJUDACECAAAAHwAgHAAAggQAIAIAAACABAAgHAAAgQQAIAvvAQAA_wMAMPABAACABAAQ8QEAAP8DADDyAQEAlAMAIfkBQACZAwAhhgIBAJQDACGHAgEAlAMAIYgCAQCUAwAhiQIAAJcDACCKAgEAlQMAIYsCAQCVAwAhC-8BAAD_AwAw8AEAAIAEABDxAQAA_wMAMPIBAQCUAwAh-QFAAJkDACGGAgEAlAMAIYcCAQCUAwAhiAIBAJQDACGJAgAAlwMAIIoCAQCVAwAhiwIBAJUDACEH8gEBAN4DACH5AUAA4gMAIYcCAQDeAwAhiAIBAN4DACGJAoAAAAABigIBAOADACGLAgEA4AMAIQfyAQEA3gMAIfkBQADiAwAhhwIBAN4DACGIAgEA3gMAIYkCgAAAAAGKAgEA4AMAIYsCAQDgAwAhB_IBAQAAAAH5AUAAAAABhwIBAAAAAYgCAQAAAAGJAoAAAAABigIBAAAAAYsCAQAAAAEDIwAAzQYAIPgCAADOBgAg_gIAABcAIAQjAAD4AwAw-AIAAPkDADD6AgAA-wMAIP4CAAD8AwAwCQoAAIEGACALAACEBgAgDQAAhQYAIA4AAIYGACAQAACDBgAgswIAANgDACC0AgAA2AMAILUCAADYAwAguwIAANgDACAAAAAAAAAFIwAAxQYAICQAAMsGACD4AgAAxgYAIPkCAADKBgAg_gIAABcAIAUjAADDBgAgJAAAyAYAIPgCAADEBgAg-QIAAMcGACD-AgAABQAgAyMAAMUGACD4AgAAxgYAIP4CAAAXACADIwAAwwYAIPgCAADEBgAg_gIAAAUAIAAAAAAAAfsCAAAAuAICBSMAALcGACAkAADBBgAg-AIAALgGACD5AgAAwAYAIP4CAABtACAHIwAAtQYAICQAAL4GACD4AgAAtgYAIPkCAAC9BgAg_AIAABEAIP0CAAARACD-AgAAAQAgByMAALMGACAkAAC7BgAg-AIAALQGACD5AgAAugYAIPwCAAATACD9AgAAEwAg_gIAAJ4BACALIwAAoQQAMCQAAKYEADD4AgAAogQAMPkCAACjBAAw-gIAAKQEACD7AgAApQQAMPwCAAClBAAw_QIAAKUEADD-AgAApQQAMP8CAACnBAAwgAMAAKgEADAHIwAAnAQAICQAAJ8EACD4AgAAnQQAIPkCAACeBAAg_AIAABsAIP0CAAAbACD-AgAAqAIAIBoRAACFBAAg8gEBAAAAAfkBQAAAAAH6AUAAAAABiAIAAACWAgKUAgAAAJQCApYCCAAAAAGXAgEAAAABmAIBAAAAAZkCAQAAAAGaAgEAAAABmwIBAAAAAZwCAQAAAAGdAgEAAAABngIIAAAAAZ8CAQAAAAGgAggAAAABoQIIAAAAAaICCAAAAAGjAoAAAAABpAIIAAAAAaUCQAAAAAGmAgEAAAABpwJAAAAAAagCQAAAAAGpAkAAAAABAgAAAKgCACAjAACcBAAgAwAAABsAICMAAJwEACAkAACgBAAgHAAAABsAIBEAAPcDACAcAACgBAAg8gEBAN4DACH5AUAA4gMAIfoBQADiAwAhiAIAAPIDlgIilAIAAPEDlAIilgIIAPMDACGXAgEA3gMAIZgCAQDgAwAhmQIBAOADACGaAgEA4AMAIZsCAQDgAwAhnAIBAOADACGdAgEA4AMAIZ4CCAD0AwAhnwIBAOADACGgAggA9AMAIaECCAD0AwAhogIIAPQDACGjAoAAAAABpAIIAPQDACGlAkAA9QMAIaYCAQDgAwAhpwJAAPUDACGoAkAA9QMAIakCQAD1AwAhGhEAAPcDACDyAQEA3gMAIfkBQADiAwAh-gFAAOIDACGIAgAA8gOWAiKUAgAA8QOUAiKWAggA8wMAIZcCAQDeAwAhmAIBAOADACGZAgEA4AMAIZoCAQDgAwAhmwIBAOADACGcAgEA4AMAIZ0CAQDgAwAhngIIAPQDACGfAgEA4AMAIaACCAD0AwAhoQIIAPQDACGiAggA9AMAIaMCgAAAAAGkAggA9AMAIaUCQAD1AwAhpgIBAOADACGnAkAA9QMAIagCQAD1AwAhqQJAAPUDACEICAAAkAQAIPIBAQAAAAH4AQEAAAABrQIBAAAAAa4CAQAAAAGvAgIAAAABsAIIAAAAAbECCAAAAAECAAAADwAgIwAArAQAIAMAAAAPACAjAACsBAAgJAAAqwQAIAEcAAC5BgAwDQgAAMkDACAPAACaAwAg7wEAANMDADDwAQAADQAQ8QEAANMDADDyAQEAAAAB-AEBAJQDACGSAgEAlAMAIa0CAQCUAwAhrgIBAJUDACGvAgIArQMAIbACCACTAwAhsQIIAJMDACECAAAADwAgHAAAqwQAIAIAAACpBAAgHAAAqgQAIAvvAQAAqAQAMPABAACpBAAQ8QEAAKgEADDyAQEAlAMAIfgBAQCUAwAhkgIBAJQDACGtAgEAlAMAIa4CAQCVAwAhrwICAK0DACGwAggAkwMAIbECCACTAwAhC-8BAACoBAAw8AEAAKkEABDxAQAAqAQAMPIBAQCUAwAh-AEBAJQDACGSAgEAlAMAIa0CAQCUAwAhrgIBAJUDACGvAgIArQMAIbACCACTAwAhsQIIAJMDACEH8gEBAN4DACH4AQEA3gMAIa0CAQDeAwAhrgIBAOADACGvAgIA3wMAIbACCADzAwAhsQIIAPMDACEICAAAjgQAIPIBAQDeAwAh-AEBAN4DACGtAgEA3gMAIa4CAQDgAwAhrwICAN8DACGwAggA8wMAIbECCADzAwAhCAgAAJAEACDyAQEAAAAB-AEBAAAAAa0CAQAAAAGuAgEAAAABrwICAAAAAbACCAAAAAGxAggAAAABAyMAALcGACD4AgAAuAYAIP4CAABtACADIwAAtQYAIPgCAAC2BgAg_gIAAAEAIAMjAACzBgAg-AIAALQGACD-AgAAngEAIAQjAAChBAAw-AIAAKIEADD6AgAApAQAIP4CAAClBAAwAyMAAJwEACD4AgAAnQQAIP4CAACoAgAgAAAAAfsCAAAAvQICBSMAAK4GACAkAACxBgAg-AIAAK8GACD5AgAAsAYAIP4CAABtACADIwAArgYAIPgCAACvBgAg_gIAAG0AIAAAAAAABSMAAKkGACAkAACsBgAg-AIAAKoGACD5AgAAqwYAIP4CAAAFACADIwAAqQYAIPgCAACqBgAg_gIAAAUAIAAAAAAAAvsCAQAAAASFAwEAAAAFBSMAAJ4GACAkAACnBgAg-AIAAJ8GACD5AgAApgYAIP4CAACFAQAgBSMAAJwGACAkAACkBgAg-AIAAJ0GACD5AgAAowYAIP4CAABtACALIwAA3wQAMCQAAOQEADD4AgAA4AQAMPkCAADhBAAw-gIAAOIEACD7AgAA4wQAMPwCAADjBAAw_QIAAOMEADD-AgAA4wQAMP8CAADlBAAwgAMAAOYEADALIwAA1gQAMCQAANoEADD4AgAA1wQAMPkCAADYBAAw-gIAANkEACD7AgAApQQAMPwCAAClBAAw_QIAAKUEADD-AgAApQQAMP8CAADbBAAwgAMAAKgEADALIwAAygQAMCQAAM8EADD4AgAAywQAMPkCAADMBAAw-gIAAM0EACD7AgAAzgQAMPwCAADOBAAw_QIAAM4EADD-AgAAzgQAMP8CAADQBAAwgAMAANEEADAI8gEBAAAAAfkBQAAAAAH6AUAAAAABrwICAAAAAcECAQAAAAHCAkAAAAABwwIIAAAAAcQCIAAAAAECAAAAJQAgIwAA1QQAIAMAAAAlACAjAADVBAAgJAAA1AQAIAEcAACiBgAwDQgAAMkDACDvAQAAyAMAMPABAAAjABDxAQAAyAMAMPIBAQAAAAH4AQEAlAMAIfkBQACZAwAh-gFAAJkDACGvAgIArQMAIcECAQCUAwAhwgJAAJkDACHDAggAkwMAIcQCIACuAwAhAgAAACUAIBwAANQEACACAAAA0gQAIBwAANMEACAM7wEAANEEADDwAQAA0gQAEPEBAADRBAAw8gEBAJQDACH4AQEAlAMAIfkBQACZAwAh-gFAAJkDACGvAgIArQMAIcECAQCUAwAhwgJAAJkDACHDAggAkwMAIcQCIACuAwAhDO8BAADRBAAw8AEAANIEABDxAQAA0QQAMPIBAQCUAwAh-AEBAJQDACH5AUAAmQMAIfoBQACZAwAhrwICAK0DACHBAgEAlAMAIcICQACZAwAhwwIIAJMDACHEAiAArgMAIQjyAQEA3gMAIfkBQADiAwAh-gFAAOIDACGvAgIA3wMAIcECAQDeAwAhwgJAAOIDACHDAggA8wMAIcQCIADhAwAhCPIBAQDeAwAh-QFAAOIDACH6AUAA4gMAIa8CAgDfAwAhwQIBAN4DACHCAkAA4gMAIcMCCADzAwAhxAIgAOEDACEI8gEBAAAAAfkBQAAAAAH6AUAAAAABrwICAAAAAcECAQAAAAHCAkAAAAABwwIIAAAAAcQCIAAAAAEIDwAAjwQAIPIBAQAAAAGSAgEAAAABrQIBAAAAAa4CAQAAAAGvAgIAAAABsAIIAAAAAbECCAAAAAECAAAADwAgIwAA3gQAIAMAAAAPACAjAADeBAAgJAAA3QQAIAEcAAChBgAwAgAAAA8AIBwAAN0EACACAAAAqQQAIBwAANwEACAH8gEBAN4DACGSAgEA3gMAIa0CAQDeAwAhrgIBAOADACGvAgIA3wMAIbACCADzAwAhsQIIAPMDACEIDwAAjQQAIPIBAQDeAwAhkgIBAN4DACGtAgEA3gMAIa4CAQDgAwAhrwICAN8DACGwAggA8wMAIbECCADzAwAhCA8AAI8EACDyAQEAAAABkgIBAAAAAa0CAQAAAAGuAgEAAAABrwICAAAAAbACCAAAAAGxAggAAAABCQcAAOUDACDyAQEAAAAB8wECAAAAAfQBAQAAAAH1AQEAAAAB9gEgAAAAAfcBAQAAAAH5AUAAAAAB-gFAAAAAAQIAAAALACAjAADqBAAgAwAAAAsAICMAAOoEACAkAADpBAAgARwAAKAGADAOBwAAxwMAIAgAAMkDACDvAQAA1AMAMPABAAAJABDxAQAA1AMAMPIBAQAAAAHzAQIArQMAIfQBAQCVAwAh9QEBAJQDACH2ASAArgMAIfcBAQCUAwAh-AEBAJQDACH5AUAAmQMAIfoBQACZAwAhAgAAAAsAIBwAAOkEACACAAAA5wQAIBwAAOgEACAM7wEAAOYEADDwAQAA5wQAEPEBAADmBAAw8gEBAJQDACHzAQIArQMAIfQBAQCVAwAh9QEBAJQDACH2ASAArgMAIfcBAQCUAwAh-AEBAJQDACH5AUAAmQMAIfoBQACZAwAhDO8BAADmBAAw8AEAAOcEABDxAQAA5gQAMPIBAQCUAwAh8wECAK0DACH0AQEAlQMAIfUBAQCUAwAh9gEgAK4DACH3AQEAlAMAIfgBAQCUAwAh-QFAAJkDACH6AUAAmQMAIQjyAQEA3gMAIfMBAgDfAwAh9AEBAOADACH1AQEA3gMAIfYBIADhAwAh9wEBAN4DACH5AUAA4gMAIfoBQADiAwAhCQcAAOMDACDyAQEA3gMAIfMBAgDfAwAh9AEBAOADACH1AQEA3gMAIfYBIADhAwAh9wEBAN4DACH5AUAA4gMAIfoBQADiAwAhCQcAAOUDACDyAQEAAAAB8wECAAAAAfQBAQAAAAH1AQEAAAAB9gEgAAAAAfcBAQAAAAH5AUAAAAAB-gFAAAAAAQH7AgEAAAAEAyMAAJ4GACD4AgAAnwYAIP4CAACFAQAgAyMAAJwGACD4AgAAnQYAIP4CAABtACAEIwAA3wQAMPgCAADgBAAw-gIAAOIEACD-AgAA4wQAMAQjAADWBAAw-AIAANcEADD6AgAA2QQAIP4CAAClBAAwBCMAAMoEADD4AgAAywQAMPoCAADNBAAg_gIAAM4EADAAAAAAAAX7AgIAAAABgQMCAAAAAYIDAgAAAAGDAwIAAAABhAMCAAAAAQsjAAD4BAAwJAAA_QQAMPgCAAD5BAAw-QIAAPoEADD6AgAA-wQAIPsCAAD8BAAw_AIAAPwEADD9AgAA_AQAMP4CAAD8BAAw_wIAAP4EADCAAwAA_wQAMBEKAACtBAAgCwAArgQAIA4AALAEACAQAACxBAAg8gEBAAAAAfkBQAAAAAH6AUAAAAABiAIAAAC4AgKxAggAAAABsgIBAAAAAbMCAQAAAAG0AoAAAAABtgIIAAAAAbgCCAAAAAG5AggAAAABugIIAAAAAbsCAQAAAAECAAAAFwAgIwAAgwUAIAMAAAAXACAjAACDBQAgJAAAggUAIAEcAACbBgAwFgoAAMcDACALAADOAwAgDQAAzwMAIA4AANADACAQAADRAwAg7wEAAMwDADDwAQAAFQAQ8QEAAMwDADDyAQEAAAAB-QFAAJkDACH6AUAAmQMAIYgCAADNA7gCIrECCACTAwAhsgIBAJQDACGzAgEAlQMAIbQCAACXAwAgtQIBAJUDACG2AggAkwMAIbgCCACTAwAhuQIIAJMDACG6AggAkwMAIbsCAQCVAwAhAgAAABcAIBwAAIIFACACAAAAgAUAIBwAAIEFACAR7wEAAP8EADDwAQAAgAUAEPEBAAD_BAAw8gEBAJQDACH5AUAAmQMAIfoBQACZAwAhiAIAAM0DuAIisQIIAJMDACGyAgEAlAMAIbMCAQCVAwAhtAIAAJcDACC1AgEAlQMAIbYCCACTAwAhuAIIAJMDACG5AggAkwMAIboCCACTAwAhuwIBAJUDACER7wEAAP8EADDwAQAAgAUAEPEBAAD_BAAw8gEBAJQDACH5AUAAmQMAIfoBQACZAwAhiAIAAM0DuAIisQIIAJMDACGyAgEAlAMAIbMCAQCVAwAhtAIAAJcDACC1AgEAlQMAIbYCCACTAwAhuAIIAJMDACG5AggAkwMAIboCCACTAwAhuwIBAJUDACEN8gEBAN4DACH5AUAA4gMAIfoBQADiAwAhiAIAAJYEuAIisQIIAPMDACGyAgEA3gMAIbMCAQDgAwAhtAKAAAAAAbYCCADzAwAhuAIIAPMDACG5AggA8wMAIboCCADzAwAhuwIBAOADACERCgAAlwQAIAsAAJgEACAOAACaBAAgEAAAmwQAIPIBAQDeAwAh-QFAAOIDACH6AUAA4gMAIYgCAACWBLgCIrECCADzAwAhsgIBAN4DACGzAgEA4AMAIbQCgAAAAAG2AggA8wMAIbgCCADzAwAhuQIIAPMDACG6AggA8wMAIbsCAQDgAwAhEQoAAK0EACALAACuBAAgDgAAsAQAIBAAALEEACDyAQEAAAAB-QFAAAAAAfoBQAAAAAGIAgAAALgCArECCAAAAAGyAgEAAAABswIBAAAAAbQCgAAAAAG2AggAAAABuAIIAAAAAbkCCAAAAAG6AggAAAABuwIBAAAAAQQjAAD4BAAw-AIAAPkEADD6AgAA-wQAIP4CAAD8BAAwAAAAAAsjAACKBQAwJAAAjwUAMPgCAACLBQAw-QIAAIwFADD6AgAAjQUAIPsCAACOBQAw_AIAAI4FADD9AgAAjgUAMP4CAACOBQAw_wIAAJAFADCAAwAAkQUAMBcGAADtBAAgCQAA7gQAIBIAAO8EACATAADwBAAg8gEBAAAAAfkBQAAAAAH6AUAAAAABxAIgAAAAAcUCAQAAAAHGAgEAAAABxwIBAAAAAcgCAQAAAAHJAggAAAABygIIAAAAAcsCAgAAAAHMAgAA6wQAIM0CAQAAAAHOAgEAAAABzwIBAAAAAdACAQAAAAHRAgEAAAAB0gIBAAAAAdQCAQAAAAECAAAABQAgIwAAlQUAIAMAAAAFACAjAACVBQAgJAAAlAUAIAEcAACaBgAwHAUAANYDACAGAADHAwAgCQAAvQMAIBIAANADACATAADXAwAg7wEAANUDADDwAQAAAwAQ8QEAANUDADDyAQEAAAAB-QFAAJkDACH6AUAAmQMAIcQCIACuAwAhxQIBAJQDACHGAgEAlQMAIccCAQAAAAHIAgEAlAMAIckCCACTAwAhygIIAJYDACHLAgIArQMAIcwCAACnAwAgzQIBAJUDACHOAgEAlQMAIc8CAQCVAwAh0AIBAJUDACHRAgEAlAMAIdICAQAAAAHTAgEAlAMAIdQCAQCUAwAhAgAAAAUAIBwAAJQFACACAAAAkgUAIBwAAJMFACAX7wEAAJEFADDwAQAAkgUAEPEBAACRBQAw8gEBAJQDACH5AUAAmQMAIfoBQACZAwAhxAIgAK4DACHFAgEAlAMAIcYCAQCVAwAhxwIBAJQDACHIAgEAlAMAIckCCACTAwAhygIIAJYDACHLAgIArQMAIcwCAACnAwAgzQIBAJUDACHOAgEAlQMAIc8CAQCVAwAh0AIBAJUDACHRAgEAlAMAIdICAQCVAwAh0wIBAJQDACHUAgEAlAMAIRfvAQAAkQUAMPABAACSBQAQ8QEAAJEFADDyAQEAlAMAIfkBQACZAwAh-gFAAJkDACHEAiAArgMAIcUCAQCUAwAhxgIBAJUDACHHAgEAlAMAIcgCAQCUAwAhyQIIAJMDACHKAggAlgMAIcsCAgCtAwAhzAIAAKcDACDNAgEAlQMAIc4CAQCVAwAhzwIBAJUDACHQAgEAlQMAIdECAQCUAwAh0gIBAJUDACHTAgEAlAMAIdQCAQCUAwAhE_IBAQDeAwAh-QFAAOIDACH6AUAA4gMAIcQCIADhAwAhxQIBAN4DACHGAgEA4AMAIccCAQDeAwAhyAIBAN4DACHJAggA8wMAIcoCCAD0AwAhywICAN8DACHMAgAAxAQAIM0CAQDgAwAhzgIBAOADACHPAgEA4AMAIdACAQDgAwAh0QIBAN4DACHSAgEA4AMAIdQCAQDeAwAhFwYAAMYEACAJAADHBAAgEgAAyAQAIBMAAMkEACDyAQEA3gMAIfkBQADiAwAh-gFAAOIDACHEAiAA4QMAIcUCAQDeAwAhxgIBAOADACHHAgEA3gMAIcgCAQDeAwAhyQIIAPMDACHKAggA9AMAIcsCAgDfAwAhzAIAAMQEACDNAgEA4AMAIc4CAQDgAwAhzwIBAOADACHQAgEA4AMAIdECAQDeAwAh0gIBAOADACHUAgEA3gMAIRcGAADtBAAgCQAA7gQAIBIAAO8EACATAADwBAAg8gEBAAAAAfkBQAAAAAH6AUAAAAABxAIgAAAAAcUCAQAAAAHGAgEAAAABxwIBAAAAAcgCAQAAAAHJAggAAAABygIIAAAAAcsCAgAAAAHMAgAA6wQAIM0CAQAAAAHOAgEAAAABzwIBAAAAAdACAQAAAAHRAgEAAAAB0gIBAAAAAdQCAQAAAAEEIwAAigUAMPgCAACLBQAw-gIAAI0FACD-AgAAjgUAMAAAAAAB-wIAAADlAgIB-wIAAADnAgILIwAA5AUAMCQAAOgFADD4AgAA5QUAMPkCAADmBQAw-gIAAOcFACD7AgAAjgUAMPwCAACOBQAw_QIAAI4FADD-AgAAjgUAMP8CAADpBQAwgAMAAJEFADALIwAA2wUAMCQAAN8FADD4AgAA3AUAMPkCAADdBQAw-gIAAN4FACD7AgAA_AQAMPwCAAD8BAAw_QIAAPwEADD-AgAA_AQAMP8CAADgBQAwgAMAAP8EADALIwAA0gUAMCQAANYFADD4AgAA0wUAMPkCAADUBQAw-gIAANUFACD7AgAA4wQAMPwCAADjBAAw_QIAAOMEADD-AgAA4wQAMP8CAADXBQAwgAMAAOYEADALIwAAuwUAMCQAAMAFADD4AgAAvAUAMPkCAAC9BQAw-gIAAL4FACD7AgAAvwUAMPwCAAC_BQAw_QIAAL8FADD-AgAAvwUAMP8CAADBBQAwgAMAAMIFADALIwAArwUAMCQAALQFADD4AgAAsAUAMPkCAACxBQAw-gIAALIFACD7AgAAswUAMPwCAACzBQAw_QIAALMFADD-AgAAswUAMP8CAAC1BQAwgAMAALYFADALIwAAowUAMCQAAKgFADD4AgAApAUAMPkCAAClBQAw-gIAAKYFACD7AgAApwUAMPwCAACnBQAw_QIAAKcFADD-AgAApwUAMP8CAACpBQAwgAMAAKoFADAI8gEBAAAAAfkBQAAAAAGKAgEAAAAB6gIBAAAAAesCAQAAAAHsAgEAAAAB7QKAAAAAAe4CgAAAAAECAAAANAAgIwAArgUAIAMAAAA0ACAjAACuBQAgJAAArQUAIAEcAACZBgAwDQcAAMQDACDvAQAAwwMAMPABAAAyABDxAQAAwwMAMPIBAQAAAAH3AQEAlQMAIfkBQACZAwAhigIBAJUDACHqAgEAlAMAIesCAQCUAwAh7AIBAJQDACHtAgAAlwMAIO4CAACXAwAgAgAAADQAIBwAAK0FACACAAAAqwUAIBwAAKwFACAM7wEAAKoFADDwAQAAqwUAEPEBAACqBQAw8gEBAJQDACH3AQEAlQMAIfkBQACZAwAhigIBAJUDACHqAgEAlAMAIesCAQCUAwAh7AIBAJQDACHtAgAAlwMAIO4CAACXAwAgDO8BAACqBQAw8AEAAKsFABDxAQAAqgUAMPIBAQCUAwAh9wEBAJUDACH5AUAAmQMAIYoCAQCVAwAh6gIBAJQDACHrAgEAlAMAIewCAQCUAwAh7QIAAJcDACDuAgAAlwMAIAjyAQEA3gMAIfkBQADiAwAhigIBAOADACHqAgEA3gMAIesCAQDeAwAh7AIBAN4DACHtAoAAAAAB7gKAAAAAAQjyAQEA3gMAIfkBQADiAwAhigIBAOADACHqAgEA3gMAIesCAQDeAwAh7AIBAN4DACHtAoAAAAAB7gKAAAAAAQjyAQEAAAAB-QFAAAAAAYoCAQAAAAHqAgEAAAAB6wIBAAAAAewCAQAAAAHtAoAAAAAB7gKAAAAAAQfyAQEAAAAB9AEBAAAAAfkBQAAAAAG9AgAAAL0CAr4CAQAAAAG_AiAAAAABwAKAAAAAAQIAAAAwACAjAAC6BQAgAwAAADAAICMAALoFACAkAAC5BQAgARwAAJgGADAMBwAAxwMAIO8BAADFAwAw8AEAAC4AEPEBAADFAwAw8gEBAAAAAfQBAQCUAwAh9wEBAJQDACH5AUAAmQMAIb0CAADGA70CIr4CAQCUAwAhvwIgAK4DACHAAgAAlwMAIAIAAAAwACAcAAC5BQAgAgAAALcFACAcAAC4BQAgC-8BAAC2BQAw8AEAALcFABDxAQAAtgUAMPIBAQCUAwAh9AEBAJQDACH3AQEAlAMAIfkBQACZAwAhvQIAAMYDvQIivgIBAJQDACG_AiAArgMAIcACAACXAwAgC-8BAAC2BQAw8AEAALcFABDxAQAAtgUAMPIBAQCUAwAh9AEBAJQDACH3AQEAlAMAIfkBQACZAwAhvQIAAMYDvQIivgIBAJQDACG_AiAArgMAIcACAACXAwAgB_IBAQDeAwAh9AEBAN4DACH5AUAA4gMAIb0CAAC1BL0CIr4CAQDeAwAhvwIgAOEDACHAAoAAAAABB_IBAQDeAwAh9AEBAN4DACH5AUAA4gMAIb0CAAC1BL0CIr4CAQDeAwAhvwIgAOEDACHAAoAAAAABB_IBAQAAAAH0AQEAAAAB-QFAAAAAAb0CAAAAvQICvgIBAAAAAb8CIAAAAAHAAoAAAAABCwwAANEFACDyAQEAAAAB-QFAAAAAAfoBQAAAAAHvAgEAAAAB8AIBAAAAAfECAQAAAAHyAgEAAAAB8wIBAAAAAfQCAQAAAAH1AiAAAAABAgAAAAEAICMAANAFACADAAAAAQAgIwAA0AUAICQAAMUFACABHAAAlwYAMBAHAADHAwAgDAAArwMAIO8BAADSAwAw8AEAABEAEPEBAADSAwAw8gEBAAAAAfcBAQCUAwAh-QFAAJkDACH6AUAAmQMAIe8CAQCVAwAh8AIBAJQDACHxAgEAlQMAIfICAQCUAwAh8wIBAJQDACH0AgEAlQMAIfUCIACuAwAhAgAAAAEAIBwAAMUFACACAAAAwwUAIBwAAMQFACAO7wEAAMIFADDwAQAAwwUAEPEBAADCBQAw8gEBAJQDACH3AQEAlAMAIfkBQACZAwAh-gFAAJkDACHvAgEAlQMAIfACAQCUAwAh8QIBAJUDACHyAgEAlAMAIfMCAQCUAwAh9AIBAJUDACH1AiAArgMAIQ7vAQAAwgUAMPABAADDBQAQ8QEAAMIFADDyAQEAlAMAIfcBAQCUAwAh-QFAAJkDACH6AUAAmQMAIe8CAQCVAwAh8AIBAJQDACHxAgEAlQMAIfICAQCUAwAh8wIBAJQDACH0AgEAlQMAIfUCIACuAwAhCvIBAQDeAwAh-QFAAOIDACH6AUAA4gMAIe8CAQDgAwAh8AIBAN4DACHxAgEA4AMAIfICAQDeAwAh8wIBAN4DACH0AgEA4AMAIfUCIADhAwAhCwwAAMYFACDyAQEA3gMAIfkBQADiAwAh-gFAAOIDACHvAgEA4AMAIfACAQDeAwAh8QIBAOADACHyAgEA3gMAIfMCAQDeAwAh9AIBAOADACH1AiAA4QMAIQsjAADHBQAwJAAAywUAMPgCAADIBQAw-QIAAMkFADD6AgAAygUAIPsCAAD8BAAw_AIAAPwEADD9AgAA_AQAMP4CAAD8BAAw_wIAAMwFADCAAwAA_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_gIAAPwEADAEIwAA0gUAMPgCAADTBQAw-gIAANUFACD-AgAA4wQAMAQjAAC7BQAw-AIAALwFADD6AgAAvgUAIP4CAAC_BQAwBCMAAK8FADD4AgAAsAUAMPoCAACyBQAg_gIAALMFADAEIwAAowUAMPgCAACkBQAw-gIAAKYFACD-AgAApwUAMAAAAAAAAAAHIwAAjgYAICQAAJEGACD4AgAAjwYAIPkCAACQBgAg_AIAADYAIP0CAAA2ACD-AgAAbQAgAyMAAI4GACD4AgAAjwYAIP4CAABtACAAAAAFIwAAiQYAICQAAIwGACD4AgAAigYAIPkCAACLBgAg_gIAAG0AIAMjAACJBgAg-AIAAIoGACD-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_AiAAAAABwAKAAAAAAQjyAQEAAAAB-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_BQAgHAAAvwYAIPIBAQDeAwAh9wEBAN4DACH5AUAA4gMAIfoBQADiAwAh7wIBAOADACHwAgEA3gMAIfECAQDgAwAh8gIBAN4DACHzAgEA3gMAIfQCAQDgAwAh9QIgAOEDACEMBwAA_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-QFAAOIDACH6AUAA4gMAIYgCAADyA5YCIpICAQDeAwAhlAIAAPEDlAIilgIIAPMDACGXAgEA3gMAIZgCAQDgAwAhmQIBAOADACGaAgEA4AMAIZsCAQDgAwAhnAIBAOADACGdAgEA4AMAIZ4CCAD0AwAhnwIBAOADACGgAggA9AMAIaECCAD0AwAhogIIAPQDACGjAoAAAAABpAIIAPQDACGlAkAA9QMAIaYCAQDgAwAhpwJAAPUDACGoAkAA9QMAIakCQAD1AwAhGw8AAPYDACDyAQEA3gMAIfkBQADiAwAh-gFAAOIDACGIAgAA8gOWAiKSAgEA3gMAIZQCAADxA5QCIpYCCADzAwAhlwIBAN4DACGYAgEA4AMAIZkCAQDgAwAhmgIBAOADACGbAgEA4AMAIZwCAQDgAwAhnQIBAOADACGeAggA9AMAIZ8CAQDgAwAhoAIIAPQDACGhAggA9AMAIaICCAD0AwAhowKAAAAAAaQCCAD0AwAhpQJAAPUDACGmAgEA4AMAIacCQAD1AwAhqAJAAPUDACGpAkAA9QMAIRgFAADsBAAgBgAA7QQAIBIAAO8EACATAADwBAAg8gEBAAAAAfkBQAAAAAH6AUAAAAABxAIgAAAAAcUCAQAAAAHGAgEAAAABxwIBAAAAAcgCAQAAAAHJAggAAAABygIIAAAAAcsCAgAAAAHMAgAA6wQAIM0CAQAAAAHOAgEAAAABzwIBAAAAAdACAQAAAAHRAgEAAAAB0gIBAAAAAdMCAQAAAAHUAgEAAAABAgAAAAUAICMAANgGACASAwAA7QUAIAwAAO4FACAUAADwBQAgFQAA8QUAIBYAAPIFACDyAQEAAAAB-QFAAAAAAfoBQAAAAAGIAgAAAOcCAsUCAQAAAAHgAgEAAAAB4QIBAAAAAeICAQAAAAHjAgEAAAAB5QIAAADlAgLnAiAAAAAB6AJAAAAAAekCQAAAAAECAAAAbQAgIwAA2gYAIAMAAAADACAjAADYBgAgJAAA3gYAIBoAAAADACAFAADFBAAgBgAAxgQAIBIAAMgEACATAADJBAAgHAAA3gYAIPIBAQDeAwAh-QFAAOIDACH6AUAA4gMAIcQCIADhAwAhxQIBAN4DACHGAgEA4AMAIccCAQDeAwAhyAIBAN4DACHJAggA8wMAIcoCCAD0AwAhywICAN8DACHMAgAAxAQAIM0CAQDgAwAhzgIBAOADACHPAgEA4AMAIdACAQDgAwAh0QIBAN4DACHSAgEA4AMAIdMCAQDeAwAh1AIBAN4DACEYBQAAxQQAIAYAAMYEACASAADIBAAgEwAAyQQAIPIBAQDeAwAh-QFAAOIDACH6AUAA4gMAIcQCIADhAwAhxQIBAN4DACHGAgEA4AMAIccCAQDeAwAhyAIBAN4DACHJAggA8wMAIcoCCAD0AwAhywICAN8DACHMAgAAxAQAIM0CAQDgAwAhzgIBAOADACHPAgEA4AMAIdACAQDgAwAh0QIBAN4DACHSAgEA4AMAIdMCAQDeAwAh1AIBAN4DACEDAAAANgAgIwAA2gYAICQAAOEGACAUAAAANgAgAwAAnQUAIAwAAJ4FACAUAACgBQAgFQAAoQUAIBYAAKIFACAcAADhBgAg8gEBAN4DACH5AUAA4gMAIfoBQADiAwAhiAIAAJwF5wIixQIBAN4DACHgAgEA4AMAIeECAQDeAwAh4gIBAN4DACHjAgEA4AMAIeUCAACbBeUCIucCIADhAwAh6AJAAPUDACHpAkAA9QMAIRIDAACdBQAgDAAAngUAIBQAAKAFACAVAAChBQAgFgAAogUAIPIBAQDeAwAh-QFAAOIDACH6AUAA4gMAIYgCAACcBecCIsUCAQDeAwAh4AIBAOADACHhAgEA3gMAIeICAQDeAwAh4wIBAOADACHlAgAAmwXlAiLnAiAA4QMAIegCQAD1AwAh6QJAAPUDACEDBAAUBwACDD4IBwMGAwQAEwkrBgwqCBQtARUxERY1EgYEABAFAAQGAAIJDAYSEAcTJg8CAwcDBAAFAQMIAAIHAAIIAAMCCAADDwAIBgQADgoAAgsSAQ0UCQ4aBxAcCwIEAAoMGAgBDBkAAwQADQ8ACBEgDAEQAAsBESEAAQ4iAAEIAAMDCScAEigAEykAAQcAAgEHNwIGAzgACToADDkAFDsAFTwAFj0AAQw_AAABBwACAQcAAgMEABkpABoqABsAAAADBAAZKQAaKgAbAQdfAgEHZQIDBAAgKQAhKgAiAAAAAwQAICkAISoAIgAAAwQAJykAKCoAKQAAAAMEACcpACgqACkAAAMEAC4pAC8qADAAAAADBAAuKQAvKgAwAAAFBAA1KQA4KgA5awA2bAA3AAAAAAAFBAA1KQA4KgA5awA2bAA3AgUABAYAAgIFAAQGAAIFBAA-KQBBKgBCawA_bABAAAAAAAAFBAA-KQBBKgBCawA_bABAAQgAAwEIAAMFBABHKQBKKgBLawBIbABJAAAAAAAFBABHKQBKKgBLawBIbABJAQcAAgEHAAIDBABQKQBRKgBSAAAAAwQAUCkAUSoAUgMKAAILggIBDYMCCQMKAAILiQIBDYoCCQUEAFcpAFoqAFtrAFhsAFkAAAAAAAUEAFcpAFoqAFtrAFhsAFkCCAADDwAIAggAAw8ACAUEAGApAGMqAGRrAGFsAGIAAAAAAAUEAGApAGMqAGRrAGFsAGIBDwAIAQ8ACAUEAGkpAGwqAG1rAGpsAGsAAAAAAAUEAGkpAGwqAG1rAGpsAGsBEAALARAACwMEAHIpAHMqAHQAAAADBAByKQBzKgB0AgcAAggAAwIHAAIIAAMFBAB5KQB8KgB9awB6bAB7AAAAAAAFBAB5KQB8KgB9awB6bAB7FwIBGEABGUEBGkIBG0MBHUUBHkcVH0gWIEoBIUwVIk0XJU4BJk8BJ1AVK1MYLFQcLVUSLlYSL1cSMFgSMVkSMlsSM10VNF4dNWESNmMVN2QeOGYSOWcSOmgVO2sfPGwjPW4CPm8CP3ECQHICQXMCQnUCQ3cVRHgkRXoCRnwVR30lSH4CSX8CSoABFUuDASZMhAEqTYYBBE6HAQRPigEEUIsBBFGMAQRSjgEEU5ABFVSRAStVkwEEVpUBFVeWASxYlwEEWZgBBFqZARVbnAEtXJ0BMV2fAQleoAEJX6IBCWCjAQlhpAEJYqYBCWOoARVkqQEyZasBCWatARVnrgEzaK8BCWmwAQlqsQEVbbQBNG61ATpvtgEDcLcBA3G4AQNyuQEDc7oBA3S8AQN1vgEVdr8BO3fBAQN4wwEVecQBPHrFAQN7xgEDfMcBFX3KAT1-ywFDf8wBD4ABzQEPgQHOAQ-CAc8BD4MB0AEPhAHSAQ-FAdQBFYYB1QFEhwHXAQ-IAdkBFYkB2gFFigHbAQ-LAdwBD4wB3QEVjQHgAUaOAeEBTI8B4gERkAHjARGRAeQBEZIB5QERkwHmARGUAegBEZUB6gEVlgHrAU2XAe0BEZgB7wEVmQHwAU6aAfEBEZsB8gERnAHzARWdAfYBT54B9wFTnwH4AQigAfkBCKEB-gEIogH7AQijAfwBCKQB_gEIpQGAAhWmAYECVKcBhQIIqAGHAhWpAYgCVaoBiwIIqwGMAgisAY0CFa0BkAJWrgGRAlyvAZICB7ABkwIHsQGUAgeyAZUCB7MBlgIHtAGYAge1AZoCFbYBmwJdtwGdAge4AZ8CFbkBoAJeugGhAge7AaICB7wBowIVvQGmAl--AacCZb8BqQILwAGqAgvBAawCC8IBrQILwwGuAgvEAbACC8UBsgIVxgGzAmbHAbUCC8gBtwIVyQG4AmfKAbkCC8sBugILzAG7AhXNAb4CaM4BvwJuzwHAAgzQAcECDNEBwgIM0gHDAgzTAcQCDNQBxgIM1QHIAhXWAckCb9cBywIM2AHNAhXZAc4CcNoBzwIM2wHQAgzcAdECFd0B1AJx3gHVAnXfAdYCBuAB1wIG4QHYAgbiAdkCBuMB2gIG5AHcAgblAd4CFeYB3wJ25wHhAgboAeMCFekB5AJ36gHlAgbrAeYCBuwB5wIV7QHqAnjuAesCfg"
};
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
var deleteFileFromCloudinary = async (url) => {
  try {
    const regex = /\/v\d+\/(.+?)(?:\.[a-zA-Z0-9]+)+$/;
    const match = url.match(regex);
    if (match && match[1]) {
      const publicId = match[1];
      await cloudinary.uploader.destroy(
        publicId,
        {
          resource_type: "image"
        }
      );
    }
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error);
    throw new AppError_default(status14.INTERNAL_SERVER_ERROR, "Failed to delete file from Cloudinary");
  }
};
var cloudinaryUpload = cloudinary;

// src/modules/file/file.service.ts
var uploadImage = async (files) => {
  if (!files || files.length === 0) {
    throw new AppError_default(status15.BAD_REQUEST, "No file uploaded");
  }
  if (files.length === 1) {
    return {
      url: files[0].path
    };
  }
  return files.map((file) => ({
    url: file.path
  }));
};
var deleteImage = async (urls) => {
  if (!urls) {
    throw new AppError_default(status15.BAD_REQUEST, "Image URL is required");
  }
  if (Array.isArray(urls)) {
    await Promise.all(
      urls.map((url) => deleteFileFromCloudinary(url))
    );
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
  if (files?.length > 10) {
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
import { CloudinaryStorage } from "multer-storage-cloudinary";
var storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: async (req, file) => {
    const originalName = file.originalname;
    const extension = originalName.split(".").pop()?.toLocaleLowerCase();
    const fileNameWithoutExtension = originalName.split(".").slice(0, -1).join(".").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");
    const uniqueName = Math.random().toString(36).substring(2) + "-" + Date.now() + "-" + fileNameWithoutExtension;
    const folder = extension === "pdf" ? "pdfs" : "images";
    return {
      folder: `medi-store/${folder}`,
      public_id: uniqueName,
      resource_type: "auto"
    };
  }
});
var multerUpload = multer({ storage });

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
