# 🚀 MediStore Backend Vercel Serverless Deployment Guide

This backend has been configured to deploy seamlessly to **Vercel Serverless Functions** following the same modern pattern as `Zero-Label` and `School-College`.

---

## 💡 What Was Fixed & Why `api/` Had So Much Code Previously

### ❌ The Old Problem:
1. Previously, your `package.json` had:
   ```json
   "build": "prisma generate && tsup src/index.ts --format esm --platform node --target node20 --outDir api --external pg-native"
   ```
   This meant `tsup` was compiling the **entire application** into a massive 200KB bundle at `api/index.mjs`.
2. `vercel.json` was pointing directly to that pre-compiled `api/index.mjs`.
3. If you changed any code in `src/` and pushed to GitHub without running `pnpm run build` locally first, **Vercel never received your changes** because it was only running the outdated compiled `api/index.mjs`.

### ✅ The Modern `Zero-Label` Solution:
1. **Deleted the 200KB compiled bundle `api/index.mjs`**.
2. **Created clean 3-line serverless entrypoint ([`api/index.ts`](file:///c:/Users/moshf/OneDrive/Documents/ALL%20PROJECTS%20UPDATE/MediStore/MediStoreBackend/api/index.ts))**:
   ```typescript
   import app from "../src/app";

   export default app;
   ```
3. **Updated [`vercel.json`](file:///c:/Users/moshf/OneDrive/Documents/ALL%20PROJECTS%20UPDATE/MediStore/MediStoreBackend/vercel.json)**:
   ```json
   {
     "version": 2,
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/api"
       }
     ]
   }
   ```
4. **Updated [`package.json`](file:///c:/Users/moshf/OneDrive/Documents/ALL%20PROJECTS%20UPDATE/MediStore/MediStoreBackend/package.json)**:
   - `"build": "prisma generate"`
   - `"postinstall": "prisma generate"`
5. **No Local Build Needed Before Push**:
   - You can just edit any file in `src/`, commit, and push.
   - Vercel automatically runs `postinstall: prisma generate` and executes `api/index.ts` directly on Vercel's Node.js runtime.

---

## 🛠️ PostgreSQL Serverless Connection Pooling

In [`src/lib/prisma.ts`](file:///c:/Users/moshf/OneDrive/Documents/ALL%20PROJECTS%20UPDATE/MediStore/MediStoreBackend/src/lib/prisma.ts):
- Added `ssl: isLocal ? false : { rejectUnauthorized: false }` for cloud databases (Neon, Supabase, Railway, etc.).
- Configured connection pool `max: process.env.VERCEL ? 2 : 10` to prevent database connection exhaustion in serverless environments.

---

## 📋 Vercel Environment Variables Checklist

Ensure these variables are added in **Vercel Dashboard ➔ Project Settings ➔ Environment Variables**:

| Variable | Description / Example |
| :--- | :--- |
| `DATABASE_URL` | Cloud PostgreSQL connection string (with `?sslmode=require`) |
| `JWT_SECRET` | Secret string for JWT authentication |
| `FRONTEND_URL` | `https://your-medistore-frontend.vercel.app` |
| `BACKEND_URL` | `https://your-medistore-backend.vercel.app` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Cloud Name |
| `CLOUDINARY_API_KEY` | Cloudinary API Key |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret |
| `SSL_STORE_ID` | SSLCommerz Store ID |
| `SSL_STORE_PASS` | SSLCommerz Store Password |
| `SSL_IS_LIVE` | `false` (sandbox) or `true` (live) |
