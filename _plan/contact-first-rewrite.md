# DevKofi Contact-First Rewrite — Implementation Plan

## Overview

Transform the app from a mentorship platform into a simple contact-first portfolio site.

**Allowed routes after rewrite:** `/` `/about` `/projects` `/contact`
**Rollout order:** Backend API → Frontend page → Remove auth → Rewrite UI → Cleanup

---

## Phase 1 — Backend: Contact API

### 1.1 Add environment variables

File: `.env` and `.env.example` (project root)

Add to both files (`.env.example` uses placeholder values):

```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@email.com
EMAIL_PASS=your_app_password
CONTACT_TO_EMAIL=your@email.com
```

Note: `EMAIL_USERNAME` and `EMAIL_APP_PASSWORD` already exist in `.env`. Rename them to match the new standard keys above.

---

### 1.2 Create email utility

New file: `server/utils/emailService.js`

```js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendContactEmail({ name, email, subject, message }) {
  await transporter.sendMail({
    from: `"${name}" <${process.env.EMAIL_USER}>`,
    to: process.env.CONTACT_TO_EMAIL,
    replyTo: email,
    subject: `[Contact] ${subject}`,
    text: `From: ${name} <${email}>\n\n${message}`,
    html: `<p><strong>From:</strong> ${name} &lt;${email}&gt;</p><p>${message}</p>`,
  });
}

module.exports = { sendContactEmail };
```

---

### 1.3 Create contact controller

New file: `server/controllers/contactController.js`

```js
const { sendContactEmail } = require("../utils/emailService");

async function postContact(req, res, next) {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, error: "All fields are required." });
    }

    await sendContactEmail({ name, email, subject, message });

    res.status(200).json({ success: true, message: "Message sent." });
  } catch (err) {
    next(err);
  }
}

module.exports = { postContact };
```

---

### 1.4 Create contact route

New file: `server/routes/contactRoutes.js`

```js
const express = require("express");
const router = express.Router();
const { postContact } = require("../controllers/contactController");

router.post("/", postContact);

module.exports = router;
```

---

### 1.5 Register contact route in app.js

File: `server/app.js`

Add one line in the route block:

```js
const contactRoutes = require("./routes/contactRoutes");
// ...
app.use("/api/contact", contactRoutes);
```

---

### 1.6 Add rate limiting to the contact route

Install `express-rate-limit` if not already present:

```
npm install express-rate-limit
```

Apply in `server/routes/contactRoutes.js`:

```js
const rateLimit = require("express-rate-limit");

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: Number(process.env.CONTACT_RATE_LIMIT) || 5,
  message: { success: false, error: "Too many requests. Try again later." },
});

router.post("/", contactLimiter, postContact);
```

Add to `.env` / `.env.example`:

```
CONTACT_RATE_LIMIT=5
```

---

### 1.7 Optional: Persist contact messages to MongoDB

New file: `server/models/ContactMessage.js`

```js
const mongoose = require("mongoose");

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContactMessage", contactMessageSchema);
```

Update `server/controllers/contactController.js` to also save:

```js
const ContactMessage = require("../models/ContactMessage");
// inside postContact, after validation:
await ContactMessage.create({ name, email, subject, message });
```

---

## Phase 2 — Frontend: Contact Page

### 2.1 Create the contact service

New file: `client/src/services/contactService.js`

```js
import api from "../lib/api";

export async function sendContactMessage(data) {
  const res = await api.post("/contact", data);
  return res.data;
}
```

---

### 2.2 Create the contact mutation hook

New file: `client/src/hooks/mutations/useContactMutation.js`

```js
import { useMutation } from "@tanstack/react-query";
import { sendContactMessage } from "../../services/contactService";

export function useContactMutation() {
  return useMutation({ mutationFn: sendContactMessage });
}
```

---

### 2.3 Create the Contact page

New file: `client/src/Pages/Contact/Contact.jsx`

Fields: name, email, subject, message.

States to handle: idle, loading, success, error.

```jsx
import { useState } from "react";
import { useContactMutation } from "../../hooks/mutations/useContactMutation";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const { mutate, isPending, isSuccess, isError, error } = useContactMutation();

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    mutate(form);
  }

  return (
    <main>
      <h1>Contact</h1>

      {isSuccess && <p>Message sent! I'll get back to you soon.</p>}

      {isError && (
        <p>{error?.response?.data?.error ?? "Something went wrong. Please try again."}</p>
      )}

      {!isSuccess && (
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input name="subject" placeholder="Subject" value={form.subject} onChange={handleChange} required />
          <textarea name="message" placeholder="Message" value={form.message} onChange={handleChange} required />
          <button type="submit" disabled={isPending}>
            {isPending ? "Sending…" : "Send Message"}
          </button>
        </form>
      )}
    </main>
  );
}
```

Style with Tailwind CSS. Do not add SCSS.

---

### 2.4 Add /contact route to App.jsx

File: `client/src/App.jsx`

```jsx
import Contact from "./Pages/Contact/Contact";
// ...
<Route path="/contact" element={<Contact />} />
```

---

## Phase 3 — Remove Auth

### 3.1 Remove protected route wrappers

Files to delete:
- `client/src/components/PrivateRoute/PrivateRoute.jsx`
- `client/src/components/AdminRoute/AdminRoute.jsx`

---

### 3.2 Remove auth routes from App.jsx

File: `client/src/App.jsx`

Remove these `<Route>` entries:
- `/login` → `Login`
- `/register` → `Register`
- `/dashboard` → `Dashboard` (and its nested routes)
- `/onboarding` → `Onboarding`
- `/settings` → `Settings`

Keep only:
- `/` → `Home`
- `/about` → `About`
- `/projects` → `Projects`
- `/contact` → `Contact`
- `*` → `NotFound`

Remove all imports of removed pages.

---

### 3.3 Remove auth Redux slice

File to delete: `client/src/redux/auth/authSlice.js`

Update `client/src/redux/store.js`: remove the `auth` reducer.

---

### 3.4 Remove auth hooks

Files to delete:
- `client/src/hooks/useLoginMutation.js`
- `client/src/hooks/useRegisterMuation.js`
- `client/src/hooks/useProfileMeQuery.js`
- `client/src/hooks/useOnboardingStatusQuery.js`
- `client/src/hooks/useOnboardingIntakeMutation.js`
- `client/src/hooks/useUpdateProfileMutation.js`
- `client/src/hooks/useStudentDashboardSummaryQuery.js`
- `client/src/hooks/useMyEnrollmentsQuery.js`
- `client/src/hooks/useMyAccessRequestsQuery.js`
- `client/src/hooks/useJoinEnrollmentMutation.js`
- `client/src/hooks/useAdminUsersQuery.js`
- `client/src/hooks/useApproveEnrollmentMutation.js`
- `client/src/hooks/useApproveTeamEnrollmentMutation.js`
- `client/src/hooks/useRejectEnrollmentMutation.js`
- `client/src/hooks/useActivateEnrollmentMutation.js`
- `client/src/hooks/useTeamAccessRequestMutation.js`

---

### 3.5 Remove auth/mentorship pages

Files to delete:
- `client/src/Pages/Login/Login.jsx`
- `client/src/Pages/Register/Register.jsx`
- `client/src/Pages/Dashboard/` (entire directory)
- `client/src/Pages/Onboarding/Onboarding.jsx`
- `client/src/Pages/Settings/Settings.jsx`
- `client/src/Pages/Join/Join.jsx`
- `client/src/Pages/Enterprise/Enterprise.jsx`
- `client/src/Pages/Playground/Playground.jsx`
- `client/src/Pages/Pricing/Pricing.jsx`
- `client/src/components/EnrollmentStatusCard/EnrollmentStatusCard.jsx`
- `client/src/components/Pricing/Pricing.jsx`

---

### 3.6 Clean up Header navigation

File: `client/src/components/Header/Header.jsx`

Remove navigation links to: login, register, dashboard, pricing, playground, enterprise, join.

Keep links: Home `/`, About `/about`, Projects `/projects`, Contact `/contact`.

Update mobile `SideNav` (`client/src/components/SideNav/SideNav.jsx`) with the same nav items.

---

## Phase 4 — Rewrite UI

### 4.1 Home page

File: `client/src/Pages/Home/Home.jsx`

- Remove: Highlights, FeatureSection, Pricing, mentorship CTAs
- Keep: Landing hero section
- Rewrite hero copy for contact-first positioning (name, tagline, CTA → `/contact`)
- Keep `ScrollToTop` and `Footer`

---

### 4.2 Footer

File: `client/src/Pages/Footer/Footer.jsx`

Remove links to auth, dashboard, pricing, enterprise.
Keep: Home, About, Projects, Contact, and social links.

---

### 4.3 Remove unused components

Files to delete (no longer referenced):
- `client/src/components/Highlights/Highlights.jsx`
- `client/src/components/FeatureSection/FeatureSection.jsx`
- `client/src/components/Pricing/Pricing.jsx` (if not already deleted in 3.5)

---

## Phase 5 — Backend Cleanup

### 5.1 Remove auth, mentorship, and admin backend routes from app.js

File: `server/app.js`

Remove these `app.use()` registrations:
- `/api/auth`
- `/api/enrollments`
- `/api/access-requests`
- `/api/dashboard`
- `/api/profile`
- `/api/onboarding`
- `/api/team`
- `/api/admin`
- `/api/admin/users`
- `/api/pricing` (remove if no longer needed)

Keep:
- `/api/projects`
- `/api/contact`
- `/api/health`
- `/health`

---

### 5.2 Delete removed route files

Files to delete under `server/routes/`:
- `authRoutes.js`
- `enrollmentRoutes.js`
- `accessRequestRoutes.js`
- `dashboardRoutes.js`
- `profileRoutes.js`
- `onboardingRoutes.js`
- `teamRoutes.js`
- `adminRoutes.js`
- `adminUsersRoutes.js`
- `pricingRoutes.js`
- `postRoutes.js`

---

### 5.3 Delete removed controllers

Files to delete under `server/controllers/`:
- `authController.js`
- `enrollmentController.js`
- `accessRequestController.js`
- `dashboardController.js`
- `profileController.js`
- `teamController.js`
- `adminController.js`
- `adminUsersController.js`

Keep:
- `projectsController.js`
- `contactController.js` (new)

---

### 5.4 Delete removed models

Files to delete under `server/models/`:
- `User.js`
- `Enrollment.js`
- `AccessRequest.js`
- `Invite.js`
- `Team.js`
- `TeamEnrollment.js`
- `TeamMember.js`

Keep:
- `ContactMessage.js` (new, optional)

---

### 5.5 Delete removed middleware

Files to delete under `server/middleware/`:
- `requireAuth.js`
- `requireAdmin.js`
- `cleaner.js`

---

### 5.6 Delete removed utilities and scripts

Files to delete:
- `server/utility/helper.js` (JWT + bcrypt, no longer needed)
- `server/utility/entitlement.js`
- `server/scripts/seedUsers.js`

Keep:
- `server/utils/emailService.js` (new)

---

### 5.7 Delete backend tests for removed features

Files to delete under `server/__test__/`:
- `auth.test.js`
- `coreFlows.test.js`
- `authManagement.js`
- `data.js`
- `setup.js`

Write a new contact API test: `server/tests/contact.test.js`

---

### 5.8 Remove unused root-level dependencies

After cleanup, uninstall packages no longer needed:

```
npm uninstall bcryptjs jsonwebtoken express-useragent geoip-lite groq-sdk
```

Verify `nodemailer`, `cors`, `dotenv`, `express`, `mongoose` remain.

---

## Phase 6 — Final Verification

### Checklist

- [ ] `POST /api/contact` returns 200 with valid payload
- [ ] `POST /api/contact` returns 400 when fields are missing
- [ ] `POST /api/contact` returns 429 after rate limit exceeded
- [ ] Email is received at `CONTACT_TO_EMAIL`
- [ ] `/contact` page renders correctly
- [ ] Form shows loading state while submitting
- [ ] Form shows success message after send
- [ ] Form shows error message on failure
- [ ] Header only shows: Home, About, Projects, Contact
- [ ] `/login`, `/register`, `/dashboard` return 404
- [ ] No console errors in the browser
- [ ] No broken imports or missing modules
- [ ] `npm run dev` starts cleanly with no errors

---

## File Impact Summary

| Area | Action | Count |
|------|--------|-------|
| New server files | contactController, contactRoutes, emailService, ContactMessage model | 4 |
| New client files | Contact.jsx, contactService.js, useContactMutation.js | 3 |
| Modified server files | app.js, .env, .env.example | 3 |
| Modified client files | App.jsx, store.js, Header.jsx, SideNav.jsx, Home.jsx, Footer.jsx | 6 |
| Deleted server files | 5 routes, 8 controllers, 7 models, 3 middleware, 2 utilities, 5 tests | ~30 |
| Deleted client files | 15 hooks, 10 pages, 3 components, 1 Redux slice | ~29 |

---

## Environment Variables — Final State

**Root `.env` / `.env.example`**

```
PORT=5000
MONGO_URI=
CLIENT_URL=http://localhost:5173

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASS=
CONTACT_TO_EMAIL=
CONTACT_RATE_LIMIT=5
```

**`client/.env` / `client/.env.example`**

```
VITE_API_URL=http://localhost:5000/api
```
