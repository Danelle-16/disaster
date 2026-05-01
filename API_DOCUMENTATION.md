# Disaster Alert API Documentation

## Base URL
```
http://localhost:8080/api
```

## Authentication
Uses JWT Bearer tokens. Include in headers:
```
Authorization: Bearer <your_access_token>
```

---

## 📋 Authentication Endpoints

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "secure_password"
}
```

**Response (201)**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "secure_password"
}
```

**Response (200)**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

---

## 🗺️ Events Endpoints

### Get All Events
```http
GET /events?category=wildfire&status=open&limit=100&offset=0
```

**Query Parameters**
- `category`: Optional - `wildfire|flood|storm|volcano|earthquake`
- `status`: Optional - `open|closed|all` (default: `open`)
- `limit`: Optional - Max results (default: 100, max: 500)
- `offset`: Optional - Pagination offset (default: 0)

**Response (200)**
```json
{
  "total": 145,
  "limit": 100,
  "offset": 0,
  "events": [
    {
      "id": "eonet_123456",
      "title": "California Wildfire",
      "category": "wildfire",
      "status": "open",
      "latitude": 37.7749,
      "longitude": -122.4194,
      "date": "2024-01-15T10:30:00",
      "closed_date": null,
      "source_url": "https://...",
      "severity": "critical"
    }
  ]
}
```

### Get Single Event
```http
GET /events/eonet_123456
```

**Response (200)**
```json
{
  "id": "eonet_123456",
  "title": "California Wildfire",
  "category": "wildfire",
  "status": "open",
  "latitude": 37.7749,
  "longitude": -122.4194,
  "date": "2024-01-15T10:30:00",
  "severity": "critical"
}
```

### Get Nearby Events
```http
GET /events/nearby?lat=37.7749&lon=-122.4194&radius=50
```

**Query Parameters**
- `lat`: Required - Latitude
- `lon`: Required - Longitude
- `radius`: Optional - Search radius in km (default: 50)

**Response (200)**
```json
{
  "lat": 37.7749,
  "lon": -122.4194,
  "radius": 50,
  "count": 3,
  "events": [
    {
      "event": { ... },
      "distance": 12.45
    }
  ]
}
```

### Get Analytics
```http
GET /events/analytics
```

**Response (200)**
```json
{
  "by_category": {
    "wildfire": 45,
    "flood": 23,
    "storm": 12,
    "volcano": 8
  },
  "by_status": {
    "open": 73,
    "closed": 15
  },
  "recent_events_7days": 34,
  "total_events": 88,
  "total_open": 73
}
```

---

## 👤 User Endpoints (Require Auth)

### Get User Location
```http
GET /user/location
Authorization: Bearer <token>
```

**Response (200)**
```json
{
  "latitude": 37.7749,
  "longitude": -122.4194,
  "city": "San Francisco",
  "country": "United States"
}
```

### Set User Location
```http
POST /user/location
Authorization: Bearer <token>
Content-Type: application/json

{
  "latitude": 37.7749,
  "longitude": -122.4194,
  "city": "San Francisco",
  "country": "United States"
}
```

**Response (200)**
```json
{
  "id": 1,
  "username": "johndoe",
  "latitude": 37.7749,
  "longitude": -122.4194,
  "city": "San Francisco",
  "country": "United States"
}
```

---

## 🔔 User Preferences Endpoints (Require Auth)

### Get All Preferences
```http
GET /user/preferences
Authorization: Bearer <token>
```

**Response (200)**
```json
{
  "preferences": [
    {
      "id": 1,
      "category": "wildfire",
      "alert_enabled": true,
      "radius": 50,
      "severity_threshold": "high"
    }
  ]
}
```

### Create/Update Preference
```http
POST /user/preferences
Authorization: Bearer <token>
Content-Type: application/json

{
  "category": "wildfire",
  "alert_enabled": true,
  "radius": 100,
  "severity_threshold": "high"
}
```

**Response (201)**
```json
{
  "id": 1,
  "category": "wildfire",
  "alert_enabled": true,
  "radius": 100,
  "severity_threshold": "high"
}
```

### Delete Preference
```http
DELETE /user/preferences/1
Authorization: Bearer <token>
```

**Response (200)**
```json
{
  "message": "Preference deleted"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Missing required fields"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid credentials"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 409 Conflict
```json
{
  "error": "Username already exists"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Health Check

```http
GET /health
```

**Response (200)**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00",
  "environment": "development"
}
```

---

## Rate Limiting

- No rate limits enforced by default
- Recommended for production: 100 requests/minute per IP

## CORS

- Configured to accept requests from `http://localhost:3000` (dev)
- Update in production `.env`: `FRONTEND_URL`
