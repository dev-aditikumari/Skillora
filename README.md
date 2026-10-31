# Skillora

A full-stack learning management system. Students discover and buy courses, instructors build and publish them, and admins run the platform.

**Stack:** React 19 · Redux Toolkit · Tailwind CSS 4 (Vite) · Node.js · Express 5 · MongoDB (Mongoose) · JWT · Cloudinary · Razorpay

## Features

**Students**
- Browse the catalog by category, view course details, syllabus, ratings and reviews
- Buy courses with Razorpay (payment signature verified on the server) or enroll in free courses
- Watch lectures, track progress, leave a review

**Instructors**
- Create courses with a thumbnail, sections and video lectures (uploaded to Cloudinary)
- Save drafts, publish, edit and delete courses
- Dashboard with enrollment and revenue stats

**Admins**
- Platform stats and revenue
- Create categories
- View all users and courses, activate or deactivate accounts

**Platform**
- Email OTP signup, login, change password, and password reset by email link
- Role-based access control (Student, Instructor, Admin) on both API and UI routes
- Security: Helmet, rate limiting, NoSQL-injection sanitising, OTP attempt limits, hashed reset tokens, upload type validation

## Project structure

```
Skillora/
├── client/              React app (Vite)
│   └── src/
│       ├── components/  auth guards, dashboard, course UI
│       ├── pages/       Home, Catalog, CourseDetails, ViewCourse, auth pages
│       ├── services/    axios connector, endpoint map, API operations
│       └── slices/      Redux Toolkit state (auth, profile)
├── server/              Express API
│   ├── controllers/     Auth, Course, Payment, Profile, Rating, Admin ...
│   ├── middlewares/     JWT auth and role checks
│   ├── models/          Mongoose schemas
│   ├── routes/          Route definitions under /api/v1
│   └── scripts/         seed.js, dev-memory.js
├── render.yaml          Render (API) deployment
└── .env.example
```

## Getting started

**Requirements:** Node.js 20.19 or newer (`server/.nvmrc`). A MongoDB database is optional for a first run (see below).

```bash
git clone https://github.com/dev-aditikumari/Skillora.git
cd Skillora
cp .env.example .env        # the server reads the .env in the repo root
```

**Option A: try it without installing MongoDB**

```bash
cd server && npm install
npm run dev:memory          # API on :4000 with a throwaway in-memory database
```

This seeds categories, a dev admin (`admin@skillora.dev` / `Admin1234`) and 12 demo courses with instructors, students and reviews (all demo accounts use password `Demo1234`, for example `aarav.mehta@skillora.dev` as an instructor and `ananya.rao@skillora.dev` as a student). Data is lost when the process stops.

**Option B: use your own MongoDB**

Set `MONGODB_URL` and `JWT_SECRET` in `.env`, then:

```bash
cd server && npm install
ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='Strong#Pass1' npm run seed
npm run dev
```

**Start the client**

```bash
cd client && npm install
npm run dev                 # http://localhost:5173
```

In development without SMTP credentials, emails (OTPs, reset links) are printed in the API console instead of being sent.

## Environment variables

Server (root `.env`):

| Variable | Required | Purpose |
| --- | --- | --- |
| `MONGODB_URL` | yes | MongoDB connection string |
| `JWT_SECRET` | yes | Secret used to sign tokens |
| `CLIENT_URL` | yes in production | Allowed frontend origin(s), comma separated. Supports `https://*.vercel.app` |
| `CLOUD_NAME`, `API_KEY`, `API_SECRET`, `FOLDER_NAME` | for uploads | Cloudinary |
| `MAIL_HOST`, `MAIL_USER`, `MAIL_PASS` | yes in production | SMTP for OTP and reset emails (`MAIL_PORT`, `MAIL_FROM` optional) |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` | for paid courses | Razorpay keys; payments return 503 when unset |
| `PORT`, `NODE_ENV` | no | Defaults to `4000` and development |

Client (`client/.env`):

| Variable | Purpose |
| --- | --- |
| `VITE_API_URL` | API base URL, for example `https://<api>.onrender.com/api/v1`. Defaults to `http://localhost:4000/api/v1` |

## API overview

All routes are under `/api/v1`. Protected routes expect `Authorization: Bearer <token>`.

| Area | Routes |
| --- | --- |
| Auth | `POST /auth/sendotp`, `/auth/signup`, `/auth/login`, `/auth/logout`, `/auth/changepassword`, `/auth/reset-password-token`, `/auth/reset-password` |
| Profile | `GET /profile/get-user-details`, `PUT /profile/updateprofile`, `PUT /profile/update-display-picture`, `DELETE /profile/delete-profile`, `GET /profile/enrolled-courses` |
| Courses | `GET /course/show-all-categories`, `GET /course/published-courses`, `POST /course/course-details`, instructor routes for courses, sections and lectures, `POST /course/full-course-details`, `POST /course/update-progress` |
| Payment | `POST /payment/capture-payment`, `/payment/verify-payment`, `/payment/enroll-free` |
| Ratings | `POST /rating/create-rating`, `/rating/average-rating`, `/rating/all-ratings` |
| Admin | `GET /admin/stats`, `/admin/users`, `/admin/courses`, `PUT /admin/user-status`, `POST /course/create-category` |

`GET /health` reports API and database status.

## Deployment

**API on Render** (`render.yaml`)
1. Create a web service from the repo; it picks up `render.yaml` (Node 20.19, `server` root).
2. Set the environment variables above, especially `CLIENT_URL` (exact frontend origin), `MONGODB_URL`, `JWT_SECRET`, Cloudinary and `MAIL_*`.
3. Run `npm run seed` once with `ADMIN_EMAIL` and `ADMIN_PASSWORD` to create categories and the first admin.

**Client on Vercel**
1. Import the repo with `client` as the root directory.
2. Set `VITE_API_URL` to the Render API URL ending in `/api/v1`.

Notes:
- Render's free plan sleeps after about 15 minutes idle, so the first request can take up to a minute.
- If the UI cannot reach the API, first check that `CLIENT_URL` matches the frontend origin exactly. A mismatch makes the browser block requests (it does not return 403).

## Scripts

| Command | Where | What it does |
| --- | --- | --- |
| `npm run dev` | server | API with nodemon |
| `npm run dev:memory` | server | API with in-memory MongoDB, seeded |
| `npm start` | server | Production start |
| `npm run seed` | server | Create default categories and the admin |
| `npm run seed:demo` | server | Add demo courses, instructors, students and reviews (for demos only, not production) |
| `npm run dev` / `build` / `lint` | client | Vite dev server, production build, oxlint |

## Roadmap

- Stripe as an alternative payment provider (only Razorpay is implemented)
- Automated tests and CI
- Refunds and a Razorpay webhook as a fallback for dropped verification calls
