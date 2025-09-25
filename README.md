# Badminton Booking

A personal project for managing badminton court reservations with both user-facing and admin dashboards.  
Demonstrates full-stack skills: frontend (Next.js + React), backend (Node/Express), and database (MongoDB).

## Features
- User registration/login (JWT-based auth)
- Browse courts & available slots
- Make, cancel, or reschedule bookings
- Admin: manage courts, prices, blackout times
- Simple reporting of bookings

## Tech Stack
- **Frontend:** Next.js (user app), React (admin app), Tailwind CSS
- **Backend:** Node.js, Express, JWT, MongoDB (Mongoose)
- **Other:** REST API, Axios/fetch, CORS/Helmet

## Getting Started

### Backend (`my-BEadmin`)
```bash
cd my-BEadmin
npm install
cp .env.example .env

# configure MONGODB_URI and JWT secrets
npm run dev
User app (my-next-app)

cd ../my-next-app
npm install
npm run dev   # http://localhost:3000
Admin app (FE-admin-app)

cd ../FE-admin-app
npm install
npm run dev   # http://localhost:5173

##API Examples
POST /api/auth/login → login user

GET /api/courts → list courts

POST /api/bookings → create booking

GET /api/bookings/me → current user bookings

##Example Code
Booking route (Express)

router.post("/", requireAuth, async (req, res) => {
  const { courtId, date, start, end } = req.body;
  const booking = await Booking.create({
    userId: req.user.id, courtId, date, start, end
  });
  res.status(201).json(booking);
});
Court list (React)


useEffect(() => {
  fetch(`${import.meta.env.VITE_API_BASE}/api/courts`)
    .then(r => r.json()).then(setRows);
}, []);

## Roadmap
Online payments (VNPay/MoMo)

Notifications (email/SMS)

Admin dashboard with analytics
