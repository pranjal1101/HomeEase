# HomeEase REST API Endpoints Specification

This document outlines the API endpoints, request bodies, and response structures for the HomeEase Backend Service.

All API endpoints return JSON. Every response follows the standard format:
* **Success:** `{"success": true, "message": "...", "data": ...}`
* **Failure:** `{"success": false, "message": "..."}`

---

## 1. User Endpoints (`/api/users`)

### Create User
* **HTTP Method:** `POST`
* **URL Path:** `/api/users`
* **Request Body (JSON):**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "9876543210",
    "address": "123, Baker Street, London"
  }
  ```
* **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "_id": "60d5ec4b1a2c3d4e5f6g7h8i",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "address": "123, Baker Street, London",
      "createdAt": "2026-08-04T12:00:00.000Z",
      "updatedAt": "2026-08-04T12:00:00.000Z"
    }
  }
  ```

### Get All Users
* **HTTP Method:** `GET`
* **URL Path:** `/api/users`
* **Query Parameters:** None
* **Sorting:** Newest registered users first (`createdAt: -1`).
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Users fetched successfully",
    "data": [
      {
        "_id": "60d5ec4b1a2c3d4e5f6g7h8i",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "9876543210",
        "address": "123, Baker Street, London"
      }
    ]
  }
  ```

### Get User by ID
* **HTTP Method:** `GET`
* **URL Path:** `/api/users/:id`
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "User details fetched successfully",
    "data": {
      "_id": "60d5ec4b1a2c3d4e5f6g7h8i",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "address": "123, Baker Street, London"
    }
  }
  ```

### Update User
* **HTTP Method:** `PUT`
* **URL Path:** `/api/users/:id`
* **Request Body (JSON):** (Any optional fields)
  ```json
  {
    "name": "John Updated",
    "phone": "9999999999"
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "User updated successfully",
    "data": {
      "_id": "60d5ec4b1a2c3d4e5f6g7h8i",
      "name": "John Updated",
      "email": "john@example.com",
      "phone": "9999999999",
      "address": "123, Baker Street, London"
    }
  }
  ```

### Delete User
* **HTTP Method:** `DELETE`
* **URL Path:** `/api/users/:id`
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "User deleted successfully",
    "data": {
      "_id": "60d5ec4b1a2c3d4e5f6g7h8i"
    }
  }
  ```

---

## 2. Service Endpoints (`/api/services`)

### Add Service
* **HTTP Method:** `POST`
* **URL Path:** `/api/services`
* **Request Body (JSON):**
  ```json
  {
    "serviceName": "QuickFix Plumbing",
    "category": "Plumber",
    "description": "Fixing leaks, blockages, and pipe repairs.",
    "price": 500
  }
  ```
* **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Service added successfully",
    "data": {
      "_id": "60d5ec4b1a2c3d4e5f6g7h8j",
      "serviceName": "QuickFix Plumbing",
      "category": "Plumber",
      "description": "Fixing leaks, blockages, and pipe repairs.",
      "price": 500,
      "availability": true
    }
  }
  ```

### Get All Services
* **HTTP Method:** `GET`
* **URL Path:** `/api/services`
* **Query Parameters (Optional):**
  * `category` — Filter by category (e.g. `Electrician`, `Plumber`)
  * `search` — Case-insensitive regex search on `serviceName` (e.g. `quick`)
  * `page` — Pagination page index (default: `1`)
  * `limit` — Pagination size limit (default: `10`)
* **Sorting:** Newest created services first (`createdAt: -1`).
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Services fetched successfully",
    "data": [
      {
        "_id": "60d5ec4b1a2c3d4e5f6g7h8j",
        "serviceName": "QuickFix Plumbing",
        "category": "Plumber",
        "price": 500,
        "availability": true
      }
    ]
  }
  ```

### Get Single Service by ID
* **HTTP Method:** `GET`
* **URL Path:** `/api/services/:id`
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Service details fetched successfully",
    "data": {
      "_id": "60d5ec4b1a2c3d4e5f6g7h8j",
      "serviceName": "QuickFix Plumbing",
      "category": "Plumber",
      "description": "Fixing leaks, blockages, and pipe repairs.",
      "price": 500,
      "availability": true
    }
  }
  ```

### Update Service
* **HTTP Method:** `PUT`
* **URL Path:** `/api/services/:id`
* **Request Body (JSON):**
  ```json
  {
    "price": 550,
    "availability": false
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Service updated successfully",
    "data": {
      "_id": "60d5ec4b1a2c3d4e5f6g7h8j",
      "serviceName": "QuickFix Plumbing",
      "category": "Plumber",
      "price": 550,
      "availability": false
    }
  }
  ```

### Delete Service
* **HTTP Method:** `DELETE`
* **URL Path:** `/api/services/:id`
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Service deleted successfully",
    "data": {
      "_id": "60d5ec4b1a2c3d4e5f6g7h8j"
    }
  }
  ```

---

## 3. Booking Endpoints (`/api/bookings`)

### Create Booking
* **HTTP Method:** `POST`
* **URL Path:** `/api/bookings`
* **Request Body (JSON):**
  ```json
  {
    "userId": "60d5ec4b1a2c3d4e5f6g7h8i",
    "serviceId": "60d5ec4b1a2c3d4e5f6g7h8j",
    "bookingDate": "2026-08-15",
    "bookingTime": "10:00 AM",
    "address": "123, Baker Street, London"
  }
  ```
* **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Booking created successfully",
    "data": {
      "_id": "60d5ec4b1a2c3d4e5f6g7h8k",
      "userId": {
        "_id": "60d5ec4b1a2c3d4e5f6g7h8i",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "serviceId": {
        "_id": "60d5ec4b1a2c3d4e5f6g7h8j",
        "serviceName": "QuickFix Plumbing",
        "category": "Plumber"
      },
      "bookingDate": "2026-08-15T00:00:00.000Z",
      "bookingTime": "10:00 AM",
      "address": "123, Baker Street, London",
      "status": "Pending"
    }
  }
  ```

### Get All Bookings
* **HTTP Method:** `GET`
* **URL Path:** `/api/bookings`
* **Query Parameters (Optional):**
  * `userId` — Filter by user ID
  * `serviceId` — Filter by service ID
  * `status` — Filter by status (`Pending`, `Confirmed`, `Completed`, `Cancelled`)
* **Sorting:** Newest bookings first (`createdAt: -1`).
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Bookings fetched successfully",
    "data": [
      {
        "_id": "60d5ec4b1a2c3d4e5f6g7h8k",
        "userId": {
          "name": "John Doe",
          "email": "john@example.com"
        },
        "serviceId": {
          "serviceName": "QuickFix Plumbing",
          "category": "Plumber"
        },
        "bookingDate": "2026-08-15T00:00:00.000Z",
        "bookingTime": "10:00 AM",
        "status": "Pending"
      }
    ]
  }
  ```

### Get Booking by ID
* **HTTP Method:** `GET`
* **URL Path:** `/api/bookings/:id`
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Booking details fetched successfully",
    "data": {
      "_id": "60d5ec4b1a2c3d4e5f6g7h8k",
      "userId": {
        "_id": "60d5ec4b1a2c3d4e5f6g7h8i",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "serviceId": {
        "_id": "60d5ec4b1a2c3d4e5f6g7h8j",
        "serviceName": "QuickFix Plumbing",
        "category": "Plumber"
      },
      "bookingDate": "2026-08-15T00:00:00.000Z",
      "bookingTime": "10:00 AM",
      "status": "Pending"
    }
  }
  ```

### Update Booking
* **HTTP Method:** `PUT`
* **URL Path:** `/api/bookings/:id`
* **Request Body (JSON):**
  ```json
  {
    "status": "Confirmed"
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Booking updated successfully",
    "data": {
      "_id": "60d5ec4b1a2c3d4e5f6g7h8k",
      "status": "Confirmed"
    }
  }
  ```

### Delete Booking
* **HTTP Method:** `DELETE`
* **URL Path:** `/api/bookings/:id`
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Booking deleted successfully",
    "data": {
      "_id": "60d5ec4b1a2c3d4e5f6g7h8k"
    }
  }
  ```
