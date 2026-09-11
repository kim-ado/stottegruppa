# Backend Setup Guide

This document describes the backend infrastructure for the Kristen Støttegruppe website.

## Overview

The backend is built with:

- **Express.js** - Node.js web framework
- **Redis** - In-memory database for user sessions, gallery data, events, and quotes
- **JWT** - Token-based authentication
- **bcrypt** - Password hashing

## Prerequisites

- Node.js >= 16
- Redis >= 6.0
- npm or yarn

## Installation

### 1. Install Backend Dependencies

```bash
# From project root
npm install express cors dotenv redis bcrypt jsonwebtoken cookie-parser
npm install -D @types/express @types/node nodemon
```

### 2. Setup Redis

**Option A: Local Installation**

```bash
# Linux
sudo apt-get install redis-server
redis-server

# macOS
brew install redis
redis-server
```

**Option B: Docker**

```bash
docker run -d -p 6379:6379 --name redis redis
```

**Option C: Redis Cloud** (Free tier available)

- Sign up at <https://app.redislabs.com>
- Create a free database
- Copy the connection URL to `.env`

### 3. Create Environment File

Create `.env` in the project root:

```env
# Server
PORT=3001
NODE_ENV=development

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRES_IN=7d

# CORS
CLIENT_URL=http://localhost:5173

# File uploads (optional)
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads
```

### 4. Update package.json Scripts

Add to the scripts section:

```json
{
  "scripts": {
    "dev": "vite",
    "dev:server": "nodemon --exec tsx server.ts",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "start:server": "node --loader tsx server.ts"
  }
}
```

## Database Schema

### Redis Keys Structure

#### Users

- Key: `users:{username}`
- Type: Hash
- Expires: Never (unless manually deleted)
- Fields: id, username, email, passwordHash, isMember, createdAt, updatedAt, role

#### Gallery Images

- Key: `gallery:images:{imageId}`
- Type: Hash
- Fields: id, title, url, uploadedBy, uploadedAt, category

#### Events

- Key: `events:{eventId}`
- Type: Hash
- Expires: Can set TTL after event date
- Fields: id, title, description, date, location, createdBy, createdAt

#### Quotes

- Key: `quotes:{quoteId}`
- Type: Hash
- Fields: id, text, author, source, addedBy, addedAt

#### Sessions

- Key: `sessions:{sessionId}`
- Type: Hash
- Expires: 7 days (TTL)
- Fields: userId, username, email, isMember, expiresAt

See `server/models/schema.ts` for detailed field definitions.

## API Endpoints

### Authentication

- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Gallery

- `GET /api/gallery` - Get all images
- `POST /api/gallery/upload` - Upload image (member only)
- `DELETE /api/gallery/:imageId` - Delete image (member only)

### Events

- `GET /api/events` - Get all events
- `POST /api/events` - Create event (member only)
- `PUT /api/events/:eventId` - Update event (member only)
- `DELETE /api/events/:eventId` - Delete event (member only)

### Quotes

- `GET /api/quotes` - Get all quotes
- `POST /api/quotes` - Add quote (member only)
- `PUT /api/quotes/:quoteId` - Update quote (member only)
- `DELETE /api/quotes/:quoteId` - Delete quote (member only)

## Running the Application

### Development Mode

In one terminal, start the dev server:

```bash
npm run dev:server
```

In another terminal, start the frontend:

```bash
npm run dev
```

Both will run on:

- Frontend: <http://localhost:5173>
- Backend: <http://localhost:3001>

### Production Mode

```bash
npm run build
npm start:server
```

## TODO: Implementation Details

The following need to be implemented:

### Routes (server/routes/)

- [ ] `auth.ts` - Authentication endpoints
- [ ] `gallery.ts` - Gallery endpoints with file upload
- [ ] `events.ts` - Event management endpoints
- [ ] `quotes.ts` - Quote management endpoints

### Middleware (server/middleware/)

- [ ] `auth.ts` - JWT verification, member check, admin check
- [ ] Error handling and validation

### Utilities (server/utils/)

- [ ] `redis.ts` - Redis client helper functions
- [ ] `jwt.ts` - JWT token generation and verification
- [ ] `validation.ts` - Input validation schemas

### Features to Implement

1. **User Management**
   - User registration and login
   - Password reset (optional)
   - Member approval/invitation system
   - Admin dashboard for member management

2. **Gallery**
   - Image upload with validation
   - Image deletion (owner or admin only)
   - Categories (general, events, members)
   - Thumbnail generation

3. **Events**
   - Event creation and management
   - Event filtering (upcoming, past)
   - Attendee count tracking

4. **Quotes**
   - Quote management
   - Author/source tracking
   - Like/rating system (optional)

## Security Considerations

- ✅ Use httpOnly cookies for JWT tokens (not localStorage)
- ✅ Password hashing with bcrypt (min 10 rounds)
- ✅ CORS configuration for frontend domain only
- ✅ Rate limiting on auth endpoints (TODO)
- ✅ Input validation on all endpoints (TODO)
- ✅ File upload validation (size, type, etc.) (TODO)
- ✅ Use HTTPS in production
- ✅ Secure cookies (Secure, SameSite flags)

## Troubleshooting

### Redis Connection Issues

```bash
# Check Redis is running
redis-cli ping
# Should return "PONG"

# Check Redis connection
redis-cli
```

### Port Already in Use

```bash
# Check what's using port 3001
lsof -i :3001

# Kill process
kill -9 <PID>
```

### JWT Token Issues

- Ensure JWT_SECRET is set and consistent
- Check token expiration
- Verify cookie is being sent with requests (credentials: 'include')

## Next Steps

1. Implement authentication routes in `server/routes/auth.ts`
2. Set up Redis connection and helper functions
3. Create file upload handling for gallery
4. Implement each route with full error handling
5. Add input validation
6. Deploy to production with proper environment variables
