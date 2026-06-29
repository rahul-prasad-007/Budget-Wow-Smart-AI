# Budjet Wow - MERN Stack

Expense tracker built with **MongoDB**, **Express**, **React**, and **Node.js**.

## Project Structure

```
Budget_Wow/
├── frontend/     # React + Vite UI
├── backend/      # Express REST API
└── database/     # MongoDB Mongoose models & connection
```

## Prerequisites

- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

## Setup

### 1. Install dependencies

```bash
npm run install:all
```

### 2. Configure environment

**Backend** — copy `backend/.env.example` to `backend/.env` and fill in your values.

**Frontend** — copy `frontend/.env.example` to `frontend/.env`:

```env
VITE_API_URL=/api
```

### 3. Google OAuth setup

Google sign-in uses a backend redirect flow. See [GOOGLE_AUTH_SETUP.md](./GOOGLE_AUTH_SETUP.md) for full setup steps.

### 4. Start MongoDB

Ensure MongoDB is running locally, or use a MongoDB Atlas connection string in `MONGODB_URI`.

### 5. Run the app

Terminal 1 — backend:

```bash
npm run dev:backend
```

Terminal 2 — frontend:

```bash
npm run dev:frontend
```

Open [http://localhost:5173](http://localhost:5173)

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Email/password signup |
| POST | `/api/auth/login` | No | Email/password login |
| GET | `/api/auth/google` | No | Start Google OAuth redirect |
| GET | `/api/auth/me` | Yes | Current user |
| GET | `/api/expenses` | Yes | List user expenses |
| POST | `/api/expenses` | Yes | Create expense |
| PUT | `/api/expenses/:id` | Yes | Update expense |
| DELETE | `/api/expenses/:id` | Yes | Delete expense |
| GET | `/api/settings` | Yes | Get budget limits |
| PUT | `/api/settings` | Yes | Save budget limits |
| POST | `/api/feedback` | No | Submit landing page feedback |
| GET | `/api/feedback` | No | List all feedback |
| POST | `/api/receipts/scan` | Yes | AI receipt scan (Gemini) |
| GET | `/api/insights` | Yes | AI spending insights (Groq) |

## Features

- Email/password and Google authentication (JWT)
- Expense CRUD with categories and charts
- Daily, monthly, and yearly budget limits
- AI receipt scanning and spending insights
- Landing page with feedback form
- Responsive dashboard UI

## Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS, Recharts
- **Backend:** Node.js, Express 5, JWT, Google Auth Library, Gemini, Groq
- **Database:** MongoDB, Mongoose

## Production build

```bash
npm run build
```

Build output is written to `frontend/dist`.
