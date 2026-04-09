
# 💊 MediStore — Backend API

### *RESTful API for the MediStore OTC Medicine Platform*

🔗 **Live API:** [medi-store-teal.vercel.app/api](https://medi-store-teal.vercel.app/api)  
📂 **Backend Repo:** [github.com/MOSHFIQS/MediStoreBackend](https://github.com/MOSHFIQS/MediStoreBackend)  
🖥️ **Frontend:** [medi-store-frontend-sooty.vercel.app](https://medi-store-frontend-sooty.vercel.app)
📂 **Frontend Repo:** [github.com/MOSHFIQS/mediStoreFrontend](https://github.com/MOSHFIQS/mediStoreFrontend)  

</div>

---

## 📖 Overview

MediStore Backend is a **RESTful API** built with Node.js and Express.js, powering the MediStore e-commerce platform. It handles authentication, medicine listings, order processing, seller inventory management, and admin operations — all backed by a PostgreSQL database managed via Prisma ORM.

---

## 🚀 Tech Stack

| Technology | Purpose |
|---|---|
| [Node.js](https://nodejs.org/) | JavaScript runtime |
| [Express.js](https://expressjs.com/) | REST API framework |
| [PostgreSQL (Neon)](https://neon.tech/) | Serverless cloud database |
| [Prisma ORM](https://www.prisma.io/) | Type-safe database client & migrations |
| [JWT](https://jwt.io/) | Stateless authentication |
| [Bcrypt](https://www.npmjs.com/package/bcrypt) | Password hashing |
| [Cloudinary](https://cloudinary.com/) | Image upload & storage |
| [SSLCommerz](https://sslcommerz.com/) | Payment gateway integration |

---

## 🧠 Role System

| Role | Permissions |
|---|---|
| **Customer** | Browse medicines, place orders, leave reviews, manage profile |
| **Seller** | Add / edit / delete medicines, manage stock, update order status |
| **Admin** | Full platform access: manage users, orders, categories, and medicines |

---

## 🗄️ Database Schema

```
Users
 ├── id, name, email, password (hashed), role, image, isBanned
 └── Relations → Orders, Reviews

Categories
 └── id, name, slug

Medicines
 ├── id, name, description, price, stock, image, categoryId, sellerId
 └── Relations → Category, Seller (User), OrderItems, Reviews

Orders
 ├── id, userId, status, totalAmount, paymentMethod, createdAt
 └── Relations → User, OrderItems

OrderItems
 └── id, orderId, medicineId, quantity, unitPrice

Reviews
 └── id, userId, medicineId, rating, comment, createdAt
```

---

## 🔐 Authentication

All protected routes require a `Bearer` token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | ❌ | Register a new user |
| `POST` | `/api/auth/login` | ❌ | Login and receive JWT |
| `GET` | `/api/auth/me` | ✅ | Get current authenticated user |

---

## 💊 Medicines

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/medicines` | ❌ | Get all medicines (filterable) |
| `GET` | `/api/medicines/:id` | ❌ | Get a single medicine by ID |

**Query Parameters for `GET /api/medicines`:**

| Param | Type | Description |
|---|---|---|
| `search` | string | Filter by name |
| `category` | string | Filter by category slug |
| `minPrice` | number | Minimum price filter |
| `maxPrice` | number | Maximum price filter |
| `page` | number | Pagination page |
| `limit` | number | Results per page |

---

## 🛒 Orders

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/orders` | ✅ Customer | Create a new order |
| `GET` | `/api/orders` | ✅ Customer | Get all orders for current user |
| `GET` | `/api/orders/:id` | ✅ Customer | Get order details by ID |

**Order Status Flow:**

```
pending → processing → shipped → delivered
                    ↘ cancelled
```

---

## 🏪 Seller Endpoints

All seller routes require `role: seller`.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/seller/medicines` | ✅ Seller | Get seller's own medicines |
| `POST` | `/api/seller/medicines` | ✅ Seller | Add a new medicine listing |
| `PUT` | `/api/seller/medicines/:id` | ✅ Seller | Update a medicine listing |
| `DELETE` | `/api/seller/medicines/:id` | ✅ Seller | Delete a medicine listing |
| `GET` | `/api/seller/orders` | ✅ Seller | View orders containing seller's medicines |
| `PATCH` | `/api/seller/orders/:id/status` | ✅ Seller | Update order fulfillment status |

---

## 🛡️ Admin Endpoints

All admin routes require `role: admin`.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/admin/users` | ✅ Admin | Get all users |
| `PATCH` | `/api/admin/users/:id` | ✅ Admin | Ban or unban a user |
| `GET` | `/api/admin/orders` | ✅ Admin | Get all platform orders |
| `GET` | `/api/admin/medicines` | ✅ Admin | Get all medicines |
| `GET` | `/api/admin/stats` | ✅ Admin | Get dashboard statistics |

---

## 📦 Categories

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/categories` | ❌ | Get all categories |
| `POST` | `/api/categories` | ✅ Admin | Create a new category |
| `DELETE` | `/api/categories/:id` | ✅ Admin | Delete a category |

---

## ⚙️ Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** or **yarn**
- A **PostgreSQL** database (e.g. [Neon](https://neon.tech/) free tier)
- A **Cloudinary** account for image uploads

### 1. Clone the Repository

```bash
git clone https://github.com/MOSHFIQS/MediStoreBackend.git
cd MediStoreBackend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
# Server
NODE_ENV=development
PORT=5000

# Database (PostgreSQL via Neon or any provider)
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"

# Auth
JWT_SECRET=your_strong_jwt_secret_here

# CORS
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000

# Cloudinary (image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# SSLCommerz (payment gateway)
SSL_STORE_ID=your_store_id
SSL_STORE_PASS=your_store_password
SSL_IS_LIVE=false
```

> ⚠️ Never commit `.env` to version control. Add it to `.gitignore`.

### 4. Set Up the Database

```bash
# Push Prisma schema to your database
npx prisma db push

# (Optional) Open Prisma Studio to view your database
npx prisma studio
```

### 5. Run the Development Server

```bash
npm run dev
```

The API will be available at [http://localhost:5000/api](http://localhost:5000/api).

### 6. Build for Production

```bash
npm run build
npm start
```

---

## 🗂️ Project Structure

```
src/
├── controllers/        # Route handler logic (auth, medicines, orders, etc.)
├── middlewares/        # Auth guard, role check, error handler
├── routes/             # Express router definitions
├── services/           # Business logic layer
├── utils/              # Helpers (JWT, cloudinary upload, etc.)
├── validations/        # Zod / Joi request validation schemas
└── app.ts              # Express app setup

prisma/
└── schema.prisma       # Database schema definition
```

---

## 🔒 Security

- Passwords are hashed with **bcrypt** before storage — plain-text passwords are never saved
- JWT tokens are signed with a secret and verified on every protected request
- Banned users receive a `403 Forbidden` response on all protected routes
- Role-based middleware ensures sellers and admins can only access their respective routes

---

## 🚀 Deployment

This API is deployed on **Vercel** as a serverless Node.js application.

1. Push your fork to GitHub
2. Import the repository on [vercel.com](https://vercel.com)
3. Add all environment variables in the Vercel dashboard
4. Deploy — Vercel auto-detects the Node.js project

> **Database:** Neon PostgreSQL is recommended for Vercel deployments due to its serverless-compatible connection pooling.

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: your feature description'`
4. Push and open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---
