# Quick Start Guide - What's Done & What's Next

## ✅ What's Already Done

### Visual Fixes

- ✅ Fixed white space on front page
- ✅ Removed duplicate navbar from gallery page
- ✅ Gallery displays all images in one unified view

### Authentication System

- ✅ Login/Register pages created
- ✅ Auth context for managing user state
- ✅ Updated navigation with login/logout
- ✅ Member-only page protection

### Member Features (Frontend)

- ✅ Add Picture form (`/gallery/add`)
- ✅ Add Event form (`/arrangementer/add`)
- ✅ Add Quote form (`/sitater/add`)
- ✅ Forms styled and responsive

### Backend Scaffolding

- ✅ Express server structure
- ✅ Redis database schema designed
- ✅ Route files with function signatures
- ✅ Middleware structure
- ✅ Comprehensive documentation

## 📋 TODO: Fill In Implementation Details

### Phase 1: Backend Authentication (Priority 1)

1. **Edit `server.ts`:**
   - [ ] Import the route modules (auth, gallery, events, quotes)
   - [ ] Add `app.use('/api/auth', authRoutes)` etc.
   - [ ] Ensure Redis connection works

2. **Implement `server/routes/auth.ts`:**
   - [ ] Register: Hash password with bcrypt, store user in Redis
   - [ ] Login: Verify password, generate JWT token, set cookie
   - [ ] Get Current User: Verify JWT from cookie, return user data
   - [ ] Logout: Clear cookie

3. **Create `server/utils/redis.ts` (New file):**
   - [ ] Helper functions for user operations
   - [ ] `saveUser(user)`, `getUser(username)`, `deleteUser(username)`
   - [ ] Session management functions

4. **Create `server/utils/jwt.ts` (New file):**
   - [ ] Generate token: `signToken(user)`
   - [ ] Verify token: `verifyToken(token)`
   - [ ] Handle token expiration

### Phase 2: Backend Middleware

1. **Implement `server/middleware/auth.ts`:**
   - [ ] `authenticateToken` - verify JWT from cookies
   - [ ] `requireMember` - check user.isMember
   - [ ] `errorHandler` - global error handling

### Phase 3: Content Routes

1. **Implement `server/routes/gallery.ts`:**
   - [ ] POST /upload - save file, store metadata in Redis
   - [ ] GET / - fetch all images from Redis
   - [ ] DELETE /:imageId - remove image

2. **Implement `server/routes/events.ts`:**
   - [ ] POST / - create event in Redis
   - [ ] GET / - fetch all events, sort by date
   - [ ] PUT/:id and DELETE /:id

3. **Implement `server/routes/quotes.ts`:**
   - [ ] POST / - create quote in Redis
   - [ ] GET / - fetch all quotes
   - [ ] PUT/:id and DELETE /:id

### Phase 4: Frontend Integration

1. **Update Frontend:**
   - [ ] Test login/register flow
   - [ ] Test member pages (forms should work after backend is ready)
   - [ ] Verify cookies are being sent

2. **Error Handling:**
    - [ ] Show proper error messages to users
    - [ ] Handle network errors
    - [ ] Validate file uploads

## 🚀 How to Start Implementing

### Step 1: Set up Redis locally (if not done)

```bash
# Option 1: Install locally
sudo apt-get install redis-server  # Linux
brew install redis                 # macOS

# Option 2: Use Docker
docker run -p 6379:6379 redis

# Option 3: Use Redis Cloud (Free tier)
# Create account at https://app.redislabs.com
```

### Step 2: Create `.env` file

```bash
# Copy from template
cp .env.example .env

# Edit .env with your values
# For local development:
# PORT=3001
# REDIS_URL=redis://localhost:6379
# JWT_SECRET=any-random-string-for-dev
# NODE_ENV=development
```

### Step 3: Install dependencies

```bash
npm install
```

### Step 4: Start Redis

```bash
redis-server
# In a new terminal, verify it's running:
redis-cli ping
# Should return: PONG
```

### Step 5: Start implementing auth.ts

```bash
# Start backend in development mode
npm run dev:server

# In another terminal, start frontend
npm run dev
```

Test registration at <http://localhost:5173/register>

## 📚 Implementation Reference

### Redis Commands You'll Need

```javascript
// Storing user data
await redisClient.hSet(`users:${username}`, {
  id: userId,
  username: username,
  email: email,
  passwordHash: hashedPassword,
  isMember: false,
  createdAt: new Date().toISOString(),
  role: 'user',
});

// Retrieving user data
const user = await redisClient.hGetAll(`users:${username}`);

// Storing session
await redisClient.setEx(`sessions:${sessionId}`, 604800, JSON.stringify(sessionData));
// TTL = 604800 seconds = 7 days
```

### Example: Implementing registerUser

```typescript
// Pseudocode - adapt to your style
export const register = async (req, res) => {
  const { username, email, password } = req.body;
  
  // 1. Validate input
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  
  // 2. Check if user exists
  const existing = await redisClient.hGetAll(`users:${username}`);
  if (Object.keys(existing).length > 0) {
    return res.status(400).json({ error: 'User exists' });
  }
  
  // 3. Hash password
  const passwordHash = await bcrypt.hash(password, 10);
  
  // 4. Create user object
  const userId = crypto.randomUUID();
  const user = {
    id: userId,
    username,
    email,
    passwordHash,
    isMember: false,
    createdAt: new Date().toISOString(),
    role: 'user',
  };
  
  // 5. Store in Redis
  await redisClient.hSet(`users:${username}`, user);
  
  // 6. Generate JWT token
  const token = jwt.sign(
    { id: userId, username, email, isMember: false, role: 'user' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  // 7. Set httpOnly cookie
  res.cookie('authToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  
  // 8. Return user (without password)
  res.json({
    id: userId,
    username,
    email,
    isMember: false,
  });
};
```

## 🔍 Testing Your Implementation

### Test Registration

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

### Test Protected Endpoint

```bash
curl -X GET http://localhost:3001/api/auth/me \
  -H "Cookie: authToken=your-token-here"
```

## 💡 Tips for Implementation

1. **Start small**: Implement just the auth routes first, test them thoroughly
2. **Use TypeScript**: The types are already defined in `src/types/types.ts`
3. **Test as you go**: Use curl or Postman to test each endpoint
4. **Error handling**: Always return proper error codes and messages
5. **Security**: Never log passwords, always hash before storing
6. **Middleware**: Apply auth middleware to all protected routes

## 📞 Common Issues & Solutions

### "ECONNREFUSED 127.0.0.1:6379"

- Redis is not running. Start it with `redis-server`

### "JWT is malformed"

- Cookie not being sent with request. Ensure frontend uses `credentials: 'include'`

### "User not found"

- Redis key format might be wrong. Check: `users:${username}`

### "Password hash mismatch"

- bcrypt.compare syntax: `bcrypt.compare(plaintext, hash)`

## 📖 Documentation Files to Read

1. `CHANGES.md` - Summary of all changes
2. `BACKEND_SETUP.md` - Detailed backend setup
3. `server/models/schema.ts` - Redis schema documentation
4. `.env.example` - Environment variables needed

## ✨ After Backend Implementation

Once backend is working, you can:

1. Test login/register on the website
2. Test member-only pages
3. Upload images to gallery
4. Create events
5. Add quotes

Everything is already wired up on the frontend - it just needs the backend!

---

**Questions?** Check the comments in each file - they contain implementation hints and TODO markers.
