# Admin Dashboard Implementation Spec (MERN)

## Overview
This document defines the implementation of a private admin dashboard for a MERN application. The dashboard allows a single admin user to:

- Log in securely
- View contact form submissions
- View newsletter subscribers

This system is **not public-facing** and does not include user registration.

---

## Goals

- Provide secure admin-only access
- Reuse existing MongoDB collections (ContactMessage, NewsletterSubscriber)
- Keep implementation simple and maintainable
- Ensure production-grade security

---

## Architecture

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication (stored in HTTP-only cookies)

### Frontend
- React (Vite)
- Protected admin routes
- Fetch API for requests

---

## Data Models

### Admin
```
email: string (unique, required)
password: string (hashed, required)
role: string (default: "admin")
createdAt, updatedAt
```

### Existing Models (already implemented)
- ContactMessage
- NewsletterSubscriber

---

## Authentication Flow

### Login
- Endpoint: POST /api/admin/auth/login
- Input: email, password
- Output: Sets HTTP-only cookie with JWT

### Session Check
- Endpoint: GET /api/admin/auth/me
- Verifies JWT from cookie

### Logout
- Endpoint: POST /api/admin/auth/logout
- Clears cookie

---

## Middleware

### requireAdminAuth
- Verifies JWT from cookie
- Ensures role === "admin"
- Returns 401/403 if invalid

---

## Admin Routes

### Auth Routes
- POST /api/admin/auth/login
- POST /api/admin/auth/logout
- GET /api/admin/auth/me

### Dashboard Routes (Protected)
- GET /api/admin/contact-messages
- GET /api/admin/newsletter-subscribers

---

## Controllers

### adminAuthController
- loginAdmin
- logoutAdmin
- getAdminSession

### adminDashboardController
- getContactMessages
- getNewsletterSubscribers

---

## Security

- No public admin signup
- One admin user seeded manually
- Password hashed with bcrypt
- JWT stored in HTTP-only cookie
- CORS restricted to frontend domain
- Rate limiting on login endpoint

---

## Environment Variables

```
JWT_SECRET=your_secret
ADMIN_EMAIL=your_email
ADMIN_PASSWORD=your_password
CLIENT_URL=http://localhost:5173
```

---

## Seed Script

- File: server/scripts/seedAdmin.js
- Creates or updates admin user
- Run once:
```
node server/scripts/seedAdmin.js
```

---

## Frontend

### Routes
- /admin/login
- /admin/dashboard

### Components
- AdminLogin.jsx
- AdminDashboard.jsx
- ProtectedAdminRoute.jsx

### Services
- adminService.js (handles API calls)

---

## API Usage (Frontend)

```
POST /api/admin/auth/login
GET /api/admin/auth/me
GET /api/admin/contact-messages
GET /api/admin/newsletter-subscribers
POST /api/admin/auth/logout
```

All requests must include:
```
credentials: "include"
```

---

## Dashboard Features (v1)

- View contact messages
- View newsletter subscribers

Optional:
- Delete records
- Mark messages as read
- Export data

---

## Deployment Notes

- Use HTTPS in production
- Set cookies:
  - httpOnly: true
  - secure: true
  - sameSite: "none" (if cross-domain)
- Restrict CORS to actual frontend domain
- Do not expose admin routes publicly

---

## Best Practices

- Keep admin system isolated
- Do not mix with public user auth
- Do not store tokens in localStorage
- Protect all admin routes on backend

---

## Summary

This implementation adds a secure, private admin layer on top of existing data without modifying public functionality.

The system is minimal, secure, and production-ready for a single admin user.
