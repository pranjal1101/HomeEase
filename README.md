# HomeEase - Home Services Booking Platform Backend (MVP)

HomeEase is a RESTful API backend service designed to power a home services booking application. It provides complete CRUD capability for managing users, services, and service bookings. 

This backend is built as a clean, modular startup MVP with a robust separation of concerns, featuring pagination, full-text service search, category-based filtering, sorting (newest first), and secure password hashing.

---

## 🛠️ Features

* **User Management:** Standard registration, profile lookups, updates, and account deletion. Includes password hashing with `bcryptjs`.
* **Services Directory:** Service creation, custom listings, updates, and removal.
* **Search & Filters:** Support for case-insensitive regex search on service names, category filtering, and customizable pagination (page & limit).
* **Booking System:** Complete booking lifecycle validation (ensures referenced User and Service documents exist and that services are available) with standard status transition stages.
* **Modular Codebase:** Strictly structured following the **Routes → Controllers → Services → Models** execution flow.
* **Unified API Responses:** Every endpoint adheres to a standardized JSON response format.

---

## 📂 Folder Structure

```text
HomeEase/
│
├── src/
│   ├── config/          # Configurations (database connections)
│   ├── controllers/     # Request handlers (read params, return standardized JSON)
│   ├── docs/            # API documentation assets
│   ├── middlewares/     # Express middleware stack (CORS, global error handlers)
│   ├── models/          # Mongoose collection schemas
│   ├── routes/          # RESTful endpoint definitions
│   ├── seed/            # Seeding scripts for realistic database records
│   ├── services/        # Business logic and database operations (using lean queries)
│   ├── uploads/         # Local static media storage directory
│   ├── utils/           # Helper scripts (such as verification suites)
│   │
│   ├── app.js           # Express app startup and middleware configuration
│   ├── constants.js     # Constant enums (Categories, Booking Statuses)
│   └── index.js         # Entry point (connects DB and starts server listener)
│
├── .env                 # Environment variables config
├── .gitignore           # Git ignore configurations
├── package.json         # Package metadata, start scripts, and dependencies
└── README.md            # Project technical reference guide
```

---

## ⚙️ Installation & Configuration

### 1. Install Dependencies
Restore package dependencies using npm:
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory and configure the variables:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/homeease
```
*Note: You can replace the local MongoDB URI with a MongoDB Atlas cloud connection string if running in a remote container environment.*

---

## 💾 Database Schema

### User Schema
* `name` (String, required)
* `email` (String, required, unique, lowercase)
* `password` (String, required, hashed)
* `phone` (String, required)
* `address` (String, required)
* `timestamps` (createdAt, updatedAt)

### Service Schema
* `serviceName` (String, required)
* `category` (String, required, enum: Plumber, Electrician, Cleaner, Carpenter, Painter, House Helper, AC Repair)
* `description` (String, required)
* `price` (Number, required)
* `availability` (Boolean, default: true)
* `timestamps` (createdAt, updatedAt)

### Booking Schema
* `userId` (ObjectId, ref: 'User', required)
* `serviceId` (ObjectId, ref: 'Service', required)
* `bookingDate` (Date, required)
* `bookingTime` (String, required)
* `address` (String, required)
* `status` (String, enum: Pending, Confirmed, Completed, Cancelled, default: Pending)
* `timestamps` (createdAt, updatedAt)

---

## 🚀 Running the Project

### 1. Seed Database
To populate the database with realistic initial services and mock user records, run:
```bash
npm run seed
```

### 2. Start Dev Server
Run the local hot-reloading development server:
```bash
npm run dev
```
The server will bind and listen on **`http://localhost:5000`**.

### 3. Verification Test Suite
Start the server, then execute the integration test script in a separate terminal:
```bash
npm run test-api
```
This automatically validates all CRUD pathways, search queries, pagination, and response structures.

---

## 📋 API Endpoints

### User Endpoints (`/api/users`)
* `POST /api/users` — Register a new user profile
* `GET /api/users` — Fetch all users (sorted newest first)
* `GET /api/users/:id` — Retrieve user profile by ID
* `PUT /api/users/:id` — Update user profile details
* `DELETE /api/users/:id` — Remove a user profile

### Service Endpoints (`/api/services`)
* `POST /api/services` — Create a new service option
* `GET /api/services` — Retrieve all services (supports filtering by `category`, query `search`, and pagination `page` & `limit`)
* `GET /api/services/:id` — Get service details by ID
* `PUT /api/services/:id` — Modify service pricing or parameters
* `DELETE /api/services/:id` — Delete service from active index

### Booking Endpoints (`/api/bookings`)
* `POST /api/bookings` — Request a service booking (includes validation checks)
* `GET /api/bookings` — Fetch all bookings (sorted newest first, populated with related details)
* `GET /api/bookings/:id` — Retrieve specific booking details
* `PUT /api/bookings/:id` — Update booking status
* `DELETE /api/bookings/:id` — Cancel and delete a booking

---

## 📸 Screenshots

*(Add your application screenshots here to showcase the premium UI design)*

---

## 🚀 Future Improvements

To scale this MVP into a production-ready application, the following features can be added:
* **JWT Authentication:** Secure user logins with JSON Web Tokens and encrypt passwords using bcrypt hooks.
* **Payment Gateway Integration:** Incorporate Stripe or PayPal to accept online credit/debit payments.
* **SMS & Email Notifications:** Implement Twilio (SMS) and SendGrid (Email) to notify users upon booking confirmation.
* **Live Chat Socket.io:** Connect homeowners and service professionals with real-time socket connections for messaging.
* **Service Provider Dashboard:** Allow service professionals to register, set their availability slots, and accept/decline bookings.

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
