
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
DATABASE_URL="postgresql://neondb_owner:npg_4QmJfh/medi-store?sslmode=require&channel_binding=require" // your db url
JWT_SECRET=yourjwtsecret
PORT=5000
LOCAL_CLIENT_URL=http://localhost:3000
PROD_CLIENT_URL=https://medi-store.vercel.app
NODE_ENV=development or production




##  Admin Creadiatials
email : admin@gmail.com
password : 12345678