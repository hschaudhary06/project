# Stock Management App (React + Node + MySQL)

A full-stack stock management application with:
- **Login-only authentication** (no signup)
- **Dashboard** for stock visibility
- **Raw material management**
- **Purchase/inward stock updates**
- **Production + sales flow** where selling a finished product reduces raw materials based on flexible per-product recipes
- **Reporting** for current stock and transactions

## Tech Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MySQL

---

## Project Structure

- `backend/` → Express API
- `frontend/` → React UI
- `database/schema.sql` → MySQL schema + seed data

---

## 1) Database Setup (MySQL)

1. Create a database:
```sql
CREATE DATABASE stock_management;
```

2. Run schema:
```bash
mysql -u root -p stock_management < database/schema.sql
```

---

## 2) Backend Setup

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Backend runs on: `http://localhost:5000`

### Default Login
Use the seeded user from schema:
- username: `admin`
- password: `admin123`

---

## 3) Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## Core Workflow

1. Login as existing user (no signup).
2. Add raw materials (`/materials`).
3. Record purchases/inward quantities for raw materials.
4. Define finished products (e.g., Battery) with recipe consumption ratios.
5. Sell finished products; raw materials automatically decrease as per recipe.
6. Generate and view stock + transaction reports.

---

## Quick API Overview

- `POST /api/auth/login`
- `GET /api/dashboard/summary`
- `GET /api/materials`
- `POST /api/materials`
- `POST /api/materials/:id/purchase`
- `GET /api/products`
- `POST /api/products`
- `POST /api/products/:id/sell`
- `GET /api/reports/stock`
- `GET /api/reports/transactions`

All non-auth routes require `Authorization: Bearer <token>`.
