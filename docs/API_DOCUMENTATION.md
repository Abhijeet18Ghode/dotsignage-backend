# Digital Signage System API Documentation

## Overview
This is the Phase-1 MVP API for a Digital Signage System built with Node.js, Express, and Supabase.

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## API Endpoints

### Health Check
```http
GET /health
```
Returns server status (no authentication required).

---

### Authentication

#### Admin Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "admin@signage.com",
  "password": "your-password"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt-token-here",
  "user": {
    "id": "user-uuid",
    "email": "admin@signage.com"
  }
}
```

---

### Screens Management

#### Get All Screens
```http
GET /api/screens
```
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "screens": [
    {
      "id": "screen-uuid",
      "name": "Lobby Screen",
      "device_code": "ABC123",
      "location": "Main Lobby",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Create Screen
```http
POST /api/screens
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Conference Room A",
  "location": "Building 1, Floor 2"
}
```

**Response:**
```json
{
  "message": "Screen created successfully",
  "screen": {
    "id": "screen-uuid",
    "name": "Conference Room A",
    "device_code": "XYZ789",
    "location": "Building 1, Floor 2",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

#### Get Screen by ID
```http
GET /api/screens/:id
```
**Headers:** `Authorization: Bearer <token>`

#### Update Screen
```http
PUT /api/screens/:id
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Updated Screen Name",
  "location": "New Location",
  "is_active": false
}
```

#### Delete Screen
```http
DELETE /api/screens/:id
```
**Headers:** `Authorization: Bearer <token>`

---

### Media Management

#### Get All Media
```http
GET /api/media
```
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "media": [
    {
      "id": "media-uuid",
      "name": "Welcome Image",
      "file_path": "media/welcome.jpg",
      "file_type": "image",
      "file_size": 1024000,
      "duration": 10,
      "url": "https://supabase-storage-url/media/welcome.jpg",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Upload Media
```http
POST /api/media/upload
```
**Headers:** `Authorization: Bearer <token>`

**Request:** Multipart form data
- `file`: Media file (image or video)
- `name`: Display name for the media
- `duration`: Display duration in seconds (optional)

**Response:**
```json
{
  "message": "Media uploaded successfully",
  "media": {
    "id": "media-uuid",
    "name": "My Video",
    "file_path": "media/video.mp4",
    "file_type": "video",
    "file_size": 5000000,
    "duration": 30,
    "url": "https://supabase-storage-url/media/video.mp4",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

#### Get Media by ID
```http
GET /api/media/:id
```
**Headers:** `Authorization: Bearer <token>`

#### Update Media
```http
PUT /api/media/:id
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Updated Media Name",
  "duration": 15
}
```

#### Delete Media
```http
DELETE /api/media/:id
```
**Headers:** `Authorization: Bearer <token>`

---

### Playlist Management

#### Get All Playlists
```http
GET /api/playlists
```
**Headers:** `Authorization: Bearer <token>`

#### Create Playlist
```http
POST /api/playlists
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Morning Announcements",
  "description": "Content for morning display",
  "media_ids": ["media-uuid-1", "media-uuid-2"]
}
```

**Response:**
```json
{
  "message": "Playlist created successfully",
  "playlist": {
    "id": "playlist-uuid",
    "name": "Morning Announcements",
    "description": "Content for morning display",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z",
    "media": [
      {
        "id": "media-uuid-1",
        "name": "Welcome Image",
        "file_path": "media/welcome.jpg",
        "file_type": "image",
        "duration": 10,
        "order_index": 0
      }
    ]
  }
}
```

#### Get Playlist by ID
```http
GET /api/playlists/:id
```
**Headers:** `Authorization: Bearer <token>`

#### Update Playlist
```http
PUT /api/playlists/:id
```
**Headers:** `Authorization: Bearer <token>`

#### Update Playlist Media Order
```http
PUT /api/playlists/:id/media
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "media_ids": ["media-uuid-2", "media-uuid-1", "media-uuid-3"]
}
```

#### Delete Playlist
```http
DELETE /api/playlists/:id
```
**Headers:** `Authorization: Bearer <token>`

---

### Screen Assignments

#### Assign Playlist to Screen
```http
POST /api/assignments
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "screen_id": "screen-uuid",
  "playlist_id": "playlist-uuid"
}
```

**Response:**
```json
{
  "message": "Playlist \"Morning Announcements\" assigned to screen \"Lobby Screen\"",
  "assignment": {
    "id": "assignment-uuid",
    "screen_id": "screen-uuid",
    "playlist_id": "playlist-uuid",
    "assigned_at": "2024-01-01T00:00:00Z"
  }
}
```

#### Get Screen Assignment
```http
GET /api/assignments/screen/:screenId
```
**Headers:** `Authorization: Bearer <token>`

#### Remove Screen Assignment
```http
DELETE /api/assignments/screen/:screenId
```
**Headers:** `Authorization: Bearer <token>`

---

### Player API (No Authentication Required)

#### Get Playlist for Device
```http
GET /api/player/playlist/:deviceCode
```

**Response:**
```json
{
  "playlist": {
    "id": "playlist-uuid",
    "name": "Morning Announcements",
    "description": "Content for morning display",
    "is_active": true,
    "media": [
      {
        "id": "media-uuid-1",
        "name": "Welcome Image",
        "file_path": "media/welcome.jpg",
        "file_type": "image",
        "duration": 10,
        "order_index": 0,
        "url": "https://supabase-storage-url/media/welcome.jpg"
      }
    ]
  },
  "deviceCode": "ABC123",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

#### Update Device Heartbeat
```http
POST /api/player/heartbeat/:deviceCode
```

**Response:**
```json
{
  "message": "Heartbeat updated",
  "deviceCode": "ABC123",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

#### Get Device Status
```http
GET /api/player/status/:deviceCode
```

**Response:**
```json
{
  "screen": {
    "id": "screen-uuid",
    "name": "Lobby Screen",
    "device_code": "ABC123",
    "location": "Main Lobby",
    "is_active": true
  },
  "hasPlaylist": true,
  "playlistName": "Morning Announcements",
  "deviceCode": "ABC123",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

---

## Error Responses

All endpoints return errors in this format:
```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (invalid token)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

---

## Setup Instructions

1. **Install Dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Configuration:**
   Copy `.env.example` to `.env` and fill in your Supabase credentials:
   ```bash
   cp .env.example .env
   ```

3. **Database Setup:**
   Run the SQL schema in your Supabase dashboard:
   ```bash
   # Execute database/schema.sql in Supabase SQL Editor
   # Optionally run database/migrations/seed.sql for sample data
   ```

4. **Start Development Server:**
   ```bash
   npm run dev
   ```

5. **Build for Production:**
   ```bash
   npm run build
   npm start
   ```

---

## File Upload Configuration

- **Max file size:** 50MB
- **Supported formats:** 
  - Images: JPEG, PNG, GIF
  - Videos: MP4, WebM
- **Storage:** Supabase Storage bucket named 'media'

---

## Database Schema

The system uses these main tables:
- `users` - Admin users
- `screens` - Display screens with device codes
- `media` - Uploaded media files
- `playlists` - Content playlists
- `playlist_media` - Media order in playlists
- `screen_assignments` - Playlist assignments to screens