# HandyHQ

A full-stack local trade-services booking platform connecting customers with verified tradespeople (plumbers, electricians, mechanics, carpenters, painters, and labourers) — built with the MERN stack.

**Live demo:** [handy-hq-tcni.vercel.app](https://handy-hq-tcni.vercel.app) *(hosted on a free tier — first load after inactivity can take 30–50s to wake up)*
**Backend API:** hosted on Render

---

## What it does

- **Customers** search for nearby workers by trade, distance, rating, and verification status, then book them directly.
- **Workers** register, get verified by an admin, set their rate and service area, and manage incoming job requests through to completion.
- **Admins** review and approve/reject worker verification requests.

Every booking moves through a defined lifecycle — `Requested → Accepted → InProgress → Completed → Rated` (or `Cancelled` at several points) — and workers who cancel repeatedly after accepting a job are automatically suspended for a cooldown period.

---

## Features

- **Role-based authentication** — JWT-based auth for three separate roles (customer / worker / admin), with route-level middleware enforcing both "are you logged in" and "are you the right role."
- **Geospatial search** — MongoDB `2dsphere` index + `$geoNear` aggregation returns workers sorted by real distance from the customer, with filters for work type, minimum rating, and verification status, plus pagination.
- **Full booking lifecycle** — state-machine-enforced booking status transitions, with ownership checks (only the assigned worker/customer can act on a booking) and state checks (can't skip or repeat a step).
- **Cancellation & auto-suspension** — a worker who cancels 3 accepted bookings in a row is automatically suspended for 15 days; the streak resets on a successful completion.
- **Ratings** — customers rate completed jobs; the worker's running average rating updates automatically.
- **Photo uploads** — worker profile photos go through Multer → Cloudinary, with the resulting URL stored on the worker's profile.
- **Admin verification queue** — admins review new workers' ID documents and approve or reject them before they're searchable.
- **Client-side validation** — phone, password, name, and email fields are validated in the browser before any request is sent.

---

## Tech stack

**Frontend:** React (Vite), React Router, Tailwind CSS, Axios, lucide-react
**Backend:** Node.js, Express, MongoDB (Mongoose), JWT, bcryptjs
**File storage:** Cloudinary (via Multer)
**Deployment:** Vercel (frontend), Render (backend), MongoDB Atlas (database)

---

## Project structure

```
HandyHQ/
├── backend/
│   ├── config/          # MongoDB + Cloudinary connection setup
│   ├── controllers/      # Route logic — workers, customers, bookings, admin
│   ├── middleware/        # JWT auth, role authorization, Multer upload
│   ├── models/           # Mongoose schemas — Worker, Customer, Booking
│   ├── routes/           # Express route definitions
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/   # Forms, dashboards widgets, search, booking UI
    │   ├── pages/        # Route-level pages (login, signup, dashboards)
    │   └── utils/        # Axios instance, form validators
    └── index.html
```

---

## Running locally

### Prerequisites
- Node.js
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) cluster
- A free [Cloudinary](https://cloudinary.com/users/register_free) account

### 1. Clone and install
```bash
git clone https://github.com/AadityaBansal01/HandyHQ.git
cd HandyHQ

cd backend && npm install
cd ../frontend && npm install
```

### 2. Set up environment variables

Create `backend/.env`:
```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=any_long_random_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
```

### 3. Run both servers
```bash
# terminal 1
cd backend
npm run dev

# terminal 2
cd frontend
npm run dev
```

Frontend runs at `http://localhost:5173`, backend at `http://localhost:5000`.

> Note: `frontend/src/utils/axios.js` currently points at the deployed Render URL. If running the backend locally, change `baseURL` back to `http://localhost:5000/api`.

---

## API overview

| Resource | Routes |
|---|---|
| Workers | register, login, update profile, upload photo, search (geo), get by ID |
| Customers | register, login, view/update profile |
| Bookings | create, accept/reject, start, complete, cancel (customer/worker), rate, list (paginated) |
| Admin | login, list pending workers, approve/reject worker |

---

## Known limitations (MVP scope)

- Search pagination doesn't return a total page count (results just indicate whether another page exists).
- No password reset flow.
- Render's free tier spins down when idle — first request after inactivity is slow.

---

## Author

Built by [Aaditya Bansal](https://github.com/AadityaBansal01) — B.Tech Computer Engineering, Thapar Institute of Engineering and Technology.
