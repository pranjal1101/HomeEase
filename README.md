# HomeEase 🏠

HomeEase is a full-stack home services booking platform that allows users to discover trusted home service professionals, browse services, and create and manage bookings.

## 🚀 Features

### User Features
- Browse available home services
- Search services
- Filter services by category
- Sort services
- View service details
- Book a service
- View booking history
- View and manage profile information

### Service Features
- Service listing
- Service categories
- Full-text service search
- Category filtering
- Sorting by newest services
- Pagination
- Service details

### Booking Features
- Create bookings
- View bookings
- Update booking status
- Cancel bookings
- Booking history

### Backend Features
- RESTful API
- CRUD operations
- MongoDB database
- Mongoose models
- Password hashing with bcrypt
- Error handling middleware
- Environment variable configuration
- Modular project structure

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- React Router
- Axios
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- bcryptjs
- dotenv
- CORS

## 📁 Project Structure

```text
HomeEase/
├── client/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── App.jsx
│       ├── index.css
│       └── main.jsx
│
├── src/
│   ├── config/
│   ├── constants.js
│   ├── controllers/
│   ├── docs/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── seed/
│   ├── services/
│   ├── uploads/
│   ├── utils/
│   ├── app.js
│   └── index.js
│
├── .gitignore
├── package.json
└── README.md
