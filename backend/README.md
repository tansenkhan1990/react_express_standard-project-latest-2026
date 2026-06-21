# Backend — Express + MongoDB API

REST API server for the React Pro application. Handles user authentication with JWT-based HTTP-only cookies and stores data in MongoDB.

## Tech Stack

- **Runtime:** Node.js (ES modules)
- **Framework:** Express 4
- **Database:** MongoDB with Mongoose 9
- **Auth:** JWT (`jsonwebtoken`) via HTTP-only cookies
- **Password Hashing:** `bcryptjs`
- **Dev:** `node --watch` for auto-restart

## Project Structure

```
backend/
├── src/
│   ├── server.js            # App entry point, middleware, routes, MongoDB connect
│   ├── seed.js              # Seed script for demo user
│   ├── config/
│   │   └── index.js         # Environment config (dotenv)
│   ├── models/
│   │   └── userModel.js     # Mongoose User schema & model
│   ├── controllers/
│   │   ├── authController.js    # Register, login, logout, getMe
│   │   └── userController.js    # Get user by ID
│   ├── routes/
│   │   ├── auth.js          # POST /api/auth/register|login|logout, GET /api/auth/me
│   │   └── users.js         # GET /api/users/:id (protected)
│   ├── middleware/
│   │   ├── auth.js          # JWT cookie verification middleware
│   │   ├── errorHandler.js  # AppError class + global error handler
│   │   └── validate.js      # Input validation (required fields, email, password)
│   └── utils/
│       ├── jwt.js           # JWT token generation & verification
│       └── helpers.js       # asyncWrapper for route handlers
├── .env                     # Environment variables (gitignored)
├── .env.example             # Environment variable template
└── package.json
```

## Getting Started

### Prerequisites

- **Node.js 18+** (for `--watch` support)
- **MongoDB** — either a local instance or an Atlas connection string

### Setup

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Copy the environment template and edit with your values
cp .env.example .env

# 3. Install dependencies
npm install

# 4. Seed the demo user (run once)
npm run seed

# 5. Start the dev server
npm run dev
```

The API server starts at **http://localhost:3001**.

### Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3001` | Server port |
| `CORS_ORIGIN` | `http://localhost:5173` | Allowed origin for CORS |
| `JWT_SECRET` | `dev-secret-change-in-production` | Secret key for signing JWT tokens |
| `JWT_EXPIRES_IN` | `7d` | JWT token expiration duration |
| `MONGODB_URI` | `mongodb://localhost:27017/test` | MongoDB connection string |

## API Reference

### Authentication

All auth endpoints return a **SafeUser** object (without the `password` field). Login and register also set an HTTP-only `auth_token` cookie.

#### `POST /api/auth/register`

Create a new user account.

**Body (JSON):**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response `201`:**
```json
{
  "id": "661f...",
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2026-06-21T..."
}
```

**Errors:** `409` — email already exists, `400` — missing/invalid fields

---

#### `POST /api/auth/login`

Authenticate with existing credentials.

**Body (JSON):**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response `200`:**
```json
{
  "id": "661f...",
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2026-06-21T..."
}
```

**Errors:** `401` — invalid email or password

---

#### `POST /api/auth/logout`

Clear the auth cookie.

**Response `200`:**
```json
{
  "message": "Logged out successfully"
}
```

---

#### `GET /api/auth/me`

Get the currently authenticated user (requires valid auth cookie).

**Response `200`:** SafeUser object
**Errors:** `401` — no valid cookie, `404` — user not found

### Users

#### `GET /api/users/:id`

Get a user by MongoDB ID (requires valid auth cookie).

**Response `200`:** SafeUser object
**Errors:** `401` — no valid cookie, `404` — user not found

### Health

#### `GET /api/health`

Simple health check (no auth required).

**Response `200`:**
```json
{
  "status": "ok",
  "timestamp": "2026-06-21T..."
}
```

## Authentication Flow

1. **Register/Login** — Server validates credentials, creates a JWT, and sets it as an HTTP-only cookie (`auth_token`) on the response
2. **Subsequent requests** — The browser automatically sends the cookie. Protected endpoints verify the JWT via the `authenticate` middleware
3. **Logout** — Server clears the cookie
4. **Page refresh** — The frontend calls `GET /api/auth/me` on mount; the cookie is sent automatically, restoring the session

### Cookie Security

| Property | Value |
|---|---|
| `httpOnly` | `true` (not accessible via JavaScript) |
| `sameSite` | `lax` (CSRF protection) |
| `secure` | `true` in production |
| `maxAge` | 7 days |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with `--watch` (auto-restart on changes) |
| `npm start` | Start server without watch |
| `npm run seed` | Seed the demo user (`demo@example.com` / `password123`) |

## Running with the Frontend

```bash
# From the project root, start the backend
cd backend && npm run dev

# In another terminal, start the frontend
cd .. && npm run dev
```

The Vite dev server proxies `/api/*` requests to `http://localhost:3001`, so the frontend at `http://localhost:5173` can make API calls without CORS issues during development.
