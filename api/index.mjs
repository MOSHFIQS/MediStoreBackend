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
import { Router as Router7 } from "express";

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
  "inlineSchema": 'enum Role {\n  CUSTOMER\n  SELLER\n  ADMIN\n}\n\nenum UserStatus {\n  ACTIVE\n  BANNED\n}\n\nmodel User {\n  id        String     @id @default(uuid())\n  name      String\n  email     String     @unique\n  password  String\n  image     String?\n  phone     String?\n  role      Role       @default(CUSTOMER)\n  status    UserStatus @default(ACTIVE)\n  createdAt DateTime   @default(now())\n  updatedAt DateTime   @updatedAt\n\n  medicines Medicine[] @relation("SellerMedicines")\n  orders    Order[]    @relation("CustomerOrders")\n  reviews   Review[]\n\n  @@map("user")\n}\n\nmodel Category {\n  id        String     @id @default(uuid())\n  name      String     @unique\n  medicines Medicine[]\n  createdAt DateTime   @default(now())\n  updatedAt DateTime   @updatedAt\n}\n\nmodel Medicine {\n  id           String  @id @default(uuid())\n  name         String\n  description  String\n  price        Float\n  stock        Int\n  image        String?\n  manufacturer String?\n\n  categoryId String\n  category   Category @relation(fields: [categoryId], references: [id])\n\n  sellerId String\n  seller   User   @relation("SellerMedicines", fields: [sellerId], references: [id])\n\n  reviews    Review[]\n  orderItems OrderItem[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nenum OrderStatus {\n  PLACED\n  PROCESSING\n  SHIPPED\n  DELIVERED\n  CANCELLED\n}\n\nmodel Order {\n  id         String @id @default(uuid())\n  customerId String\n  customer   User   @relation("CustomerOrders", fields: [customerId], references: [id])\n\n  status     OrderStatus @default(PLACED)\n  totalPrice Float\n  address    String\n\n  items OrderItem[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel OrderItem {\n  id      String @id @default(uuid())\n  orderId String\n  order   Order  @relation(fields: [orderId], references: [id], onDelete: Cascade)\n\n  medicineId String\n  medicine   Medicine @relation(fields: [medicineId], references: [id])\n\n  quantity Int\n  price    Float\n}\n\nmodel Review {\n  id      String @id @default(uuid())\n  rating  Int\n  comment String\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id])\n\n  medicineId String\n  medicine   Medicine @relation(fields: [medicineId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"medicines","kind":"object","type":"Medicine","relationName":"SellerMedicines"},{"name":"orders","kind":"object","type":"Order","relationName":"CustomerOrders"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"}],"dbName":"user"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"medicines","kind":"object","type":"Medicine","relationName":"CategoryToMedicine"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Medicine":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Float"},{"name":"stock","kind":"scalar","type":"Int"},{"name":"image","kind":"scalar","type":"String"},{"name":"manufacturer","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToMedicine"},{"name":"sellerId","kind":"scalar","type":"String"},{"name":"seller","kind":"object","type":"User","relationName":"SellerMedicines"},{"name":"reviews","kind":"object","type":"Review","relationName":"MedicineToReview"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"MedicineToOrderItem"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Order":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"customer","kind":"object","type":"User","relationName":"CustomerOrders"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"totalPrice","kind":"scalar","type":"Float"},{"name":"address","kind":"scalar","type":"String"},{"name":"items","kind":"object","type":"OrderItem","relationName":"OrderToOrderItem"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"OrderItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToOrderItem"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"medicine","kind":"object","type":"Medicine","relationName":"MedicineToOrderItem"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"price","kind":"scalar","type":"Float"}],"dbName":null},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"medicine","kind":"object","type":"Medicine","relationName":"MedicineToReview"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null}},"enums":{},"types":{}}');
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
  BANNED: "BANNED"
};

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/modules/auth/auth.service.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
var JWT_SECRET = process.env.JWT_SECRET || "supersecret";
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
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");
  const token = jwt.sign(
    { id: user.id, role: user.role, email: user.email, status: user.status },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
  const { password: _, ...safeUser } = user;
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
import status from "http-status";
var signUpUser2 = async (req, res, next) => {
  try {
    const result = await authService.signUpUser(req.body);
    sendResponse_default(res, {
      statusCode: status.CREATED,
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
      statusCode: status.OK,
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

// src/modules/medicines/medicine.route.ts
import { Router as Router2 } from "express";

// src/modules/medicines/medicine.service.ts
var createMedicine = async (userId, payload) => {
  try {
    const category = await prisma.category.findUnique({
      where: { id: payload.categoryId }
    });
    if (!category) {
      throw new Error("This category does not exist");
    }
    return await prisma.medicine.create({
      data: { ...payload, sellerId: userId }
    });
  } catch (err) {
    console.error("Create medicine error:", err);
    throw new Error(err.message || "Failed to create medicine");
  }
};
var updateMedicine = async (userId, id, payload) => {
  try {
    return await prisma.medicine.update({
      where: { id, sellerId: userId },
      data: payload
    });
  } catch (err) {
    console.error("Update medicine error:", err);
    throw new Error(err.message || "Failed to update medicine");
  }
};
var deleteMedicine = async (userId, id) => {
  try {
    const orderItemCount = await prisma.orderItem.count({
      where: { medicineId: id }
    });
    if (orderItemCount > 0) {
      throw new Error("Cannot delete medicine: it has associated orders");
    }
    return await prisma.medicine.delete({
      where: { id, sellerId: userId }
    });
  } catch (err) {
    console.error("Delete medicine error:", err);
    throw new Error(err.message || "Failed to delete medicine");
  }
};
var getSellerMedicines = async (sellerId) => {
  try {
    return await prisma.medicine.findMany({
      where: { sellerId },
      include: { category: true },
      orderBy: { createdAt: "desc" }
    });
  } catch (err) {
    console.error("Get seller medicines error:", err);
    throw new Error(err.message || "Failed to fetch seller medicines");
  }
};
var getAllMedicines = async (query) => {
  try {
    const { categoryId, search } = query;
    const where = {};
    if (categoryId) where.categoryId = String(categoryId);
    if (search) {
      where.name = { contains: String(search), mode: "insensitive" };
    }
    return await prisma.medicine.findMany({
      where,
      include: {
        category: true,
        seller: { select: { id: true, name: true } }
      }
    });
  } catch (err) {
    console.error("Get all medicines error:", err);
    throw new Error(err.message || "Failed to fetch medicines");
  }
};
var getMedicineById = async (id) => {
  try {
    return await prisma.medicine.findUnique({
      where: { id },
      include: {
        category: true,
        seller: { select: { id: true, name: true } }
      }
    });
  } catch (err) {
    console.error("Get medicine by id error:", err);
    throw new Error(err.message || "Failed to fetch medicine");
  }
};
var medicineService = {
  createMedicine,
  updateMedicine,
  deleteMedicine,
  getSellerMedicines,
  getAllMedicines,
  getMedicineById
};

// src/modules/medicines/medicine.controller.ts
import status2 from "http-status";
var createMedicine2 = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("Unauthorized");
    }
    const result = await medicineService.createMedicine(user.id, req.body);
    sendResponse_default(res, {
      statusCode: status2.CREATED,
      success: true,
      message: "Medicine added successfully",
      data: result
    });
  } catch (err) {
    next(err);
  }
};
var updateMedicine2 = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("Unauthorized");
    }
    const result = await medicineService.updateMedicine(user.id, req.params.id, req.body);
    sendResponse_default(res, {
      statusCode: status2.OK,
      success: true,
      message: "Medicine updated",
      data: result
    });
  } catch (err) {
    next(err);
  }
};
var deleteMedicine2 = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("Unauthorized");
    }
    const result = await medicineService.deleteMedicine(user.id, req.params.id);
    sendResponse_default(res, {
      statusCode: status2.OK,
      success: true,
      message: "Medicine removed",
      data: result
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
var getSellerMedicines2 = async (req, res, next) => {
  try {
    const sellerId = req.user.id;
    console.log(sellerId);
    const medicines = await medicineService.getSellerMedicines(sellerId);
    sendResponse_default(res, {
      statusCode: 200,
      success: true,
      message: "Seller medicines retrieved successfully",
      data: medicines
    });
  } catch (err) {
    next(err);
  }
};
var getAllMedicines2 = async (req, res, next) => {
  try {
    const medicines = await medicineService.getAllMedicines(req.query);
    sendResponse_default(res, {
      statusCode: status2.OK,
      success: true,
      message: "Medicines fetched",
      data: medicines
    });
  } catch (err) {
    next(err);
  }
};
var getMedicineById2 = async (req, res, next) => {
  try {
    const medicine = await medicineService.getMedicineById(req.params.id);
    if (!medicine) {
      return sendResponse_default(res, {
        statusCode: status2.NOT_FOUND,
        success: false,
        message: "Medicine not found"
      });
    }
    sendResponse_default(res, {
      statusCode: status2.OK,
      success: true,
      message: "Medicine fetched",
      data: medicine
    });
  } catch (err) {
    next(err);
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
import status3 from "http-status";
var auth = (...allowedRoles) => {
  return (req, res, next) => {
    const token = req.cookies.token;
    console.log("token", token);
    if (!token) {
      return res.status(status3.UNAUTHORIZED).json({
        success: false,
        message: "Not logged in"
      });
    }
    try {
      const decoded = jwt2.verify(token, process.env.JWT_SECRET);
      if (decoded.status === UserStatus.BANNED) {
        return res.status(status3.FORBIDDEN).json({
          success: false,
          message: "Your account has been banned"
        });
      }
      req.user = decoded;
      if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
        return res.status(status3.FORBIDDEN).json({
          success: false,
          message: "You are not authorized"
        });
      }
      next();
    } catch {
      return res.status(status3.UNAUTHORIZED).json({
        success: false,
        message: "Invalid token"
      });
    }
  };
};

// src/modules/medicines/medicine.route.ts
var router2 = Router2();
router2.post("/seller", auth(Role.SELLER), medicineController.createMedicine);
router2.put("/seller/:id", auth(Role.SELLER), medicineController.updateMedicine);
router2.delete("/seller/:id", auth(Role.SELLER), medicineController.deleteMedicine);
router2.get("/seller", auth(Role.SELLER), medicineController.getSellerMedicines);
router2.get("/", medicineController.getAllMedicines);
router2.get("/:id", medicineController.getMedicineById);
var medicineRouter = router2;

// src/modules/orders/order.route.ts
import { Router as Router3 } from "express";

// src/modules/orders/order.controller.ts
import status4 from "http-status";

// src/modules/orders/order.service.ts
var createOrder = async (userId, payload) => {
  const { items, address } = payload;
  if (!address) throw new Error("Delivery address required");
  if (!items || items.length === 0) throw new Error("Order items required");
  const medicineIds = items.map((i) => i.medicineId);
  const medicines = await prisma.medicine.findMany({
    where: { id: { in: medicineIds } }
  });
  if (medicines.length !== items.length) {
    throw new Error("Some medicines not found");
  }
  return prisma.$transaction(
    async (tx) => {
      let totalPrice = 0;
      const orderItemsData = [];
      for (const item of items) {
        const medicine = medicines.find((m) => m.id === item.medicineId);
        const updated = await tx.medicine.updateMany({
          where: {
            id: medicine.id,
            stock: { gte: item.quantity }
          },
          data: {
            stock: { decrement: item.quantity }
          }
        });
        if (updated.count === 0) {
          throw new Error(`${medicine.name} out of stock`);
        }
        totalPrice += medicine.price * item.quantity;
        orderItemsData.push({
          medicineId: medicine.id,
          quantity: item.quantity,
          price: medicine.price
        });
      }
      return tx.order.create({
        data: {
          customerId: userId,
          address,
          totalPrice,
          items: {
            create: orderItemsData
          }
        },
        include: {
          items: { include: { medicine: true } }
        }
      });
    },
    {
      timeout: 15e3
      // ⏱ prevents early transaction timeout
    }
  );
};
var cancelOrder = async (userId, orderId) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, customerId: userId },
    include: { items: true }
  });
  if (!order) throw new Error("Order not found");
  if (!["PLACED", "PROCESSING"].includes(order.status)) {
    throw new Error("Order cannot be cancelled at this stage");
  }
  const stockUpdates = order.items.map((item) => ({
    id: item.medicineId,
    quantity: item.quantity
  }));
  return prisma.$transaction(async (tx) => {
    for (const update of stockUpdates) {
      await tx.medicine.update({
        where: { id: update.id },
        data: { stock: { increment: update.quantity } }
      });
    }
    const updatedOrder = await tx.order.update({
      where: { id: orderId },
      data: { status: "CANCELLED" },
      include: { items: { include: { medicine: true } } }
    });
    return updatedOrder;
  }, { timeout: 15e3 });
};
var getMyOrders = async (userId) => {
  return prisma.order.findMany({
    where: { customerId: userId },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: { medicine: true }
      }
    }
  });
};
var getOrderById = async (userId, orderId) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      customerId: userId
    },
    include: {
      items: {
        include: { medicine: true }
      }
    }
  });
  if (!order) throw new Error("Order not found");
  return order;
};
var getSellerOrders = async (sellerId) => {
  return prisma.order.findMany({
    where: {
      items: {
        some: {
          medicine: {
            sellerId
          }
        }
      }
    },
    orderBy: { createdAt: "desc" },
    include: {
      customer: {
        select: { id: true, name: true, phone: true }
      },
      items: {
        include: {
          medicine: {
            select: { id: true, name: true, price: true }
          }
        }
      }
    }
  });
};
var updateOrderStatus = async (sellerId, orderId, status8) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      items: {
        some: {
          medicine: { sellerId }
        }
      }
    }
  });
  if (!order) throw new Error("Order not found or not yours");
  return prisma.order.update({
    where: { id: orderId },
    data: { status: status8 }
  });
};
var orderService = {
  createOrder,
  cancelOrder,
  getMyOrders,
  getOrderById,
  getSellerOrders,
  updateOrderStatus
};

// src/modules/orders/order.controller.ts
var createOrder2 = async (req, res, next) => {
  try {
    const order = await orderService.createOrder(req.user.id, req.body);
    sendResponse_default(res, {
      statusCode: status4.CREATED,
      success: true,
      message: "Order placed successfully",
      data: order
    });
  } catch (e) {
    next(e);
  }
};
var cancelOrder2 = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const order = await orderService.cancelOrder(
      req.user.id,
      orderId
    );
    sendResponse_default(res, {
      statusCode: status4.OK,
      success: true,
      message: "Order cancelled successfully",
      data: order
    });
  } catch (e) {
    next(e);
  }
};
var getMyOrders2 = async (req, res, next) => {
  try {
    const orders = await orderService.getMyOrders(req.user.id);
    sendResponse_default(res, {
      statusCode: status4.OK,
      success: true,
      message: "Orders fetched",
      data: orders
    });
  } catch (e) {
    next(e);
  }
};
var getOrderById2 = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.user.id, req.params.id);
    sendResponse_default(res, {
      statusCode: status4.OK,
      success: true,
      message: "Order details",
      data: order
    });
  } catch (e) {
    next(e);
  }
};
var getSellerOrders2 = async (req, res, next) => {
  try {
    const orders = await orderService.getSellerOrders(req.user.id);
    console.log(req.user);
    sendResponse_default(res, {
      statusCode: status4.OK,
      success: true,
      message: "Seller orders fetched",
      data: orders
    });
  } catch (e) {
    next(e);
  }
};
var updateOrderStatus2 = async (req, res, next) => {
  try {
    const order = await orderService.updateOrderStatus(
      req.user.id,
      req.params.id,
      req.body.status
    );
    sendResponse_default(res, {
      statusCode: status4.OK,
      success: true,
      message: "Order status updated",
      data: order
    });
  } catch (e) {
    next(e);
  }
};
var orderController = {
  createOrder: createOrder2,
  cancelOrder: cancelOrder2,
  getMyOrders: getMyOrders2,
  getOrderById: getOrderById2,
  getSellerOrders: getSellerOrders2,
  updateOrderStatus: updateOrderStatus2
};

// src/modules/orders/order.route.ts
var router3 = Router3();
router3.post("/", auth(Role.CUSTOMER), orderController.createOrder);
router3.get("/", auth(Role.CUSTOMER), orderController.getMyOrders);
router3.get("/seller/my-orders", auth(Role.SELLER), orderController.getSellerOrders);
router3.get("/:id", auth(Role.CUSTOMER), orderController.getOrderById);
router3.patch("/:id", auth(Role.CUSTOMER), orderController.cancelOrder);
router3.patch("/seller/:id", auth(Role.SELLER), orderController.updateOrderStatus);
var orderRouter = router3;

// src/modules/categories/category.route.ts
import { Router as Router4 } from "express";

// src/modules/categories/category.controller.ts
import status5 from "http-status";

// src/modules/categories/category.service.ts
var createCategory = async (payload) => {
  const { name } = payload;
  const existing = await prisma.category.findFirst({
    where: { name: { equals: name, mode: "insensitive" } }
  });
  if (existing) {
    throw new Error("Category already exists");
  }
  const category = await prisma.category.create({
    data: { name }
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
var categoryService = {
  createCategory,
  getAllCategories
};

// src/modules/categories/category.controller.ts
var createCategory2 = async (req, res, next) => {
  try {
    const result = await categoryService.createCategory(req.body);
    sendResponse_default(res, {
      statusCode: status5.CREATED,
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
      statusCode: status5.OK,
      success: true,
      message: "Categories fetched successfully",
      data: categories
    });
  } catch (err) {
    next(err);
  }
};
var categoryController = {
  createCategory: createCategory2,
  getAllCategories: getAllCategories2
};

// src/modules/categories/category.route.ts
var router4 = Router4();
router4.get("/", categoryController.getAllCategories);
router4.post("/", auth(Role.ADMIN), categoryController.createCategory);
var categoryRouter = router4;

// src/modules/admin/admin.route.ts
import { Router as Router5 } from "express";

// src/modules/admin/admin.controller.ts
import status6 from "http-status";

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
      createdAt: true
    }
  });
};
var updateUserStatus = async (userId, status8) => {
  return prisma.user.update({
    where: { id: userId },
    data: { status: status8 }
  });
};
var adminService = {
  getAllUsers,
  updateUserStatus
};

// src/modules/admin/admin.controller.ts
var getAllUsers2 = async (req, res, next) => {
  try {
    const users = await adminService.getAllUsers();
    sendResponse_default(res, {
      statusCode: status6.OK,
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
    const user = await adminService.updateUserStatus(
      req.params.id,
      req.body.status
    );
    sendResponse_default(res, {
      statusCode: status6.OK,
      success: true,
      message: `User ${req.body.status}`,
      data: user
    });
  } catch (e) {
    next(e);
  }
};
var adminController = {
  getAllUsers: getAllUsers2,
  updateUserStatus: updateUserStatus2
};

// src/modules/admin/admin.route.ts
var router5 = Router5();
router5.get("/users", auth(Role.ADMIN), adminController.getAllUsers);
router5.patch("/users/:id", auth(Role.ADMIN), adminController.updateUserStatus);
var adminRouter = router5;

// src/modules/reviews/review.route.ts
import { Router as Router6 } from "express";

// src/modules/reviews/review.controller.ts
import status7 from "http-status";

// src/modules/reviews/review.service.ts
var reviewService = {
  createReview: async ({
    userId,
    medicineId,
    rating,
    comment
  }) => {
    const review = await prisma.review.create({
      data: {
        userId,
        medicineId,
        rating,
        comment
      }
    });
    return review;
  },
  getAllReviews: async () => {
    const reviews = await prisma.review.findMany({
      include: {
        user: true,
        medicine: true
      },
      orderBy: { createdAt: "desc" }
    });
    return reviews;
  }
};

// src/modules/reviews/review.controller.ts
var createReview = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("Unauthorized");
    }
    const { medicineId, rating, comment } = req.body;
    const result = await reviewService.createReview({
      userId: user.id,
      medicineId,
      rating,
      comment
    });
    sendResponse_default(res, {
      statusCode: status7.OK,
      success: true,
      message: "Review created successfully",
      data: result
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
var getAllReviews = async (req, res, next) => {
  try {
    const result = await reviewService.getAllReviews();
    sendResponse_default(res, {
      statusCode: status7.OK,
      success: true,
      message: "All reviews fetched successfully",
      data: result
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// src/modules/reviews/review.route.ts
var router6 = Router6();
router6.post("/", auth(Role.CUSTOMER), createReview);
router6.get("/", getAllReviews);
var reviewRouter = router6;

// src/routes/index.ts
var router7 = Router7();
var moduleRoutes = [
  {
    path: "/auth",
    route: authRouter
  },
  {
    path: "/medicines",
    route: medicineRouter
  },
  {
    path: "/orders",
    route: orderRouter
  },
  {
    path: "/categories",
    route: categoryRouter
  },
  {
    path: "/admin",
    route: adminRouter
  },
  {
    path: "/review",
    route: reviewRouter
  },
  {
    path: "/user",
    route: reviewRouter
  }
];
moduleRoutes.forEach((route) => router7.use(route.path, route.route));
var routes_default = router7;

// src/app.ts
var app = express2();
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      process.env.LOCAL_CLIENT_URL,
      process.env.PROD_CLIENT_URL
    ];
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
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
