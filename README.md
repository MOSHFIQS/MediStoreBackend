
---

# 🗄️ **Backend README.md** (MediStoreBackend)

```md
# MediStore 💊 Backend API
Backend server for MediStore — an OTC medicine e-commerce platform.

🔗 **Live API:** https://medi-store-teal.vercel.app/api  
📂 **Repository:** https://github.com/MOSHFIQS/MediStoreBackend  

---

## 🚀 Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express.js | REST API |
| PostgreSQL (Neon) | Database |
| Prisma ORM | Database management |
| JWT | Authentication |
| Bcrypt | Password hashing |

---

## 🧠 System Roles

| Role | Permissions |
|------|-------------|
| Customer | Place orders, reviews |
| Seller | Manage medicines & orders |
| Admin | Manage users, orders, categories |

---

## 🗂️ Database Tables

- Users
- Categories
- Medicines
- Orders
- OrderItems
- Reviews

---

## 🔐 Authentication

JWT-based authentication.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Current user |

---

## 💊 Medicines

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/medicines` | Get all medicines |
| GET | `/api/medicines/:id` | Get single medicine |

---

## 🛒 Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Create order |
| GET | `/api/orders` | User orders |
| GET | `/api/orders/:id` | Order details |

---

## 🏪 Seller

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/seller/medicines` | Add medicine |
| PUT | `/api/seller/medicines/:id` | Update medicine |
| DELETE | `/api/seller/medicines/:id` | Delete medicine |

---

## 🛡️ Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | All users |
| PATCH | `/api/admin/users/:id` | Ban/Unban user |

---

## ⚙️ Environment Variables

Create a `.env` file:

```env





































































































enum Role {
     CUSTOMER
     SELLER
     ADMIN
}

enum UserStatus {
     ACTIVE
     BANNED
}

model User {
     id        String     @id @default(uuid())
     name      String
     email     String     @unique
     password  String
     image     String?
     phone     String?
     role      Role       @default(CUSTOMER)
     status    UserStatus @default(ACTIVE)
     createdAt DateTime   @default(now())
     updatedAt DateTime   @updatedAt

     medicines Medicine[] @relation("SellerMedicines")
     orders    Order[]    @relation("CustomerOrders")
     reviews   Review[]

     @@map("user")
}



model Category {
     id        String     @id @default(uuid())
     name      String     @unique
     medicines Medicine[]
     createdAt DateTime   @default(now())
     updatedAt DateTime   @updatedAt
}

model Medicine {
     id           String  @id @default(uuid())
     name         String
     description  String
     price        Float
     stock        Int
     image        String?
     manufacturer String?

     categoryId String
     category   Category @relation(fields: [categoryId], references: [id])

     sellerId String
     seller   User   @relation("SellerMedicines", fields: [sellerId], references: [id])

     reviews    Review[]
     orderItems OrderItem[]

     createdAt DateTime @default(now())
     updatedAt DateTime @updatedAt
}

enum OrderStatus {
     PLACED
     PROCESSING
     SHIPPED
     DELIVERED
     CANCELLED
}

model Order {
     id         String @id @default(uuid())
     customerId String
     customer   User   @relation("CustomerOrders", fields: [customerId], references: [id])

     status     OrderStatus @default(PLACED)
     totalPrice Float
     address    String

     items OrderItem[]

     createdAt DateTime @default(now())
     updatedAt DateTime @updatedAt
}

model OrderItem {
     id      String @id @default(uuid())
     orderId String
     order   Order  @relation(fields: [orderId], references: [id], onDelete: Cascade)

     medicineId String
     medicine   Medicine @relation(fields: [medicineId], references: [id])

     quantity Int
     price    Float
}

model Review {
     id      String @id @default(uuid())
     rating  Int
     comment String

     userId String
     user   User   @relation(fields: [userId], references: [id])

     medicineId String
     medicine   Medicine @relation(fields: [medicineId], references: [id])

     createdAt DateTime @default(now())
     updatedAt DateTime @updatedAt
}

// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
     provider = "prisma-client"
     output   = "../../generated/prisma"
}

datasource db {
     provider = "postgresql"
}
