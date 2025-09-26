# DevKofi — MERN Stack Mentorship Programme 2025

Landing site and enrollment touchpoints for the DevKofi mentorship. Built with React (Vite) + SCSS modules. Includes pages for Home, Course Outline, About, Contact, Login, and Join.

## Live

- **Prod:** https://devkofi.com
- **(Optional) Staging:** https://devkofi.vercel.app

## Tech Stack

- React + Vite
- React Router
- SCSS Modules (dark theme)
- Axios (API client)
- Deployed on Vercel (frontend)
- Optional companion API: Node.js + Express + MongoDB (Render/Heroku)

## Features

- Hero + CTA ("Join Now")
- Course Outline section
- About Me
- Contact (form-ready)
- Auth routes: `/login`, `/join`
- Reusable Header / Footer / UI components
- Fully responsive, SEO-ready structure

## Getting Started

```bash
# Node 18+ recommended
pnpm i         # or npm i / yarn
pnpm dev       # or npm run dev
pnpm build     # or npm run build
pnpm preview   # or npm run preview
```

### Env (frontend)

Create `.env` (or `.env.local`) with:

```
VITE_API_BASE_URL=https://api.devkofi.com   # your backend base URL (or Render URL)
VITE_ENABLE_ANALYTICS=false                 # true to enable analytics
```

## Folder Structure

```
devkofi/
├─ public/
├─ src/
│  ├─ assets/                 # images, icons
│  ├─ components/
│  │  ├─ Header/
│  │  │  ├─ Header.jsx
│  │  │  └─ header.styles.scss
│  │  ├─ Footer/
│  │  ├─ UI/                  # Button, Container, Section, etc.
│  ├─ pages/
│  │  ├─ Home/
│  │  ├─ CourseOutline/
│  │  ├─ About/
│  │  ├─ Contact/
│  │  ├─ Login/
│  │  └─ Join/
│  ├─ routes/
│  │  └─ index.jsx            # central Router
│  ├─ lib/
│  │  └─ api.js               # axios instance (baseURL from env)
│  ├─ styles/
│  │  ├─ globals.scss
│  │  └─ variables.scss
│  ├─ App.jsx
│  └─ main.jsx
├─ .env.example
├─ package.json
└─ README.md
```

## Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext .js,.jsx"
  }
}
```

## Deployment (Vercel)

- **Build command:** `npm run build`
- **Output dir:** `dist`
- **Env:** `VITE_API_BASE_URL`, `VITE_ENABLE_ANALYTICS`

## API (Optional)

If you use the companion API:

```
MONGODB_URI=...
JWT_SECRET=...
PORT=5000
CORS_ORIGIN=https://devkofi.com
```

Deploy on Render/Heroku and point `VITE_API_BASE_URL` to it.

## Roadmap

- Hook up Join/Login to API
- Contact form (Email provider or API)
- Analytics, meta tags, and OG images
- CI/CD with GitHub → Vercel (frontend) and Render (API)

## License

MIT

## Blog: How to publish
1) Add a new `.md` file to `client/public/blog/`, e.g. `my-post.md`.
2) Append a new entry to `client/public/blog/posts.json`:
   {
     "title": "My Post",
     "slug": "my-post",
     "date": "YYYY-MM-DD",
     "tags": ["tag1","tag2"],
     "excerpt": "Short summary…",
     "cover": "/blog/optional-cover.jpg",
     "file": "/blog/my-post.md",
     "published": true
   }
3) Commit and deploy.
