# User Flow & Architecture Diagram

## User Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│ PUBLIC USER (Not logged in)                                  │
├─────────────────────────────────────────────────────────────┤
│ Routes accessible:                                           │
│ • / (Home)                                                   │
│ • /om-oss (About Us)                                         │
│ • /gallery (View gallery - read only)                        │
│ • /sitater (View quotes - read only)                         │
│ • /arrangementer (View events - read only)                   │
│ • /merch                                                     │
│ • /kontakt                                                   │
│ • /gjestebok (Guestbook)                                     │
│ • /login (Login page)                                        │
│ • /register (Registration page)                              │
│                                                              │
│ Navbar shows: [Hjem] [Om oss] ... [Logg inn] [Registrer]    │
└─────────────────────────────────────────────────────────────┘
                            ▼ (Registers/Logs In)
┌─────────────────────────────────────────────────────────────┐
│ REGISTERED USER (Not yet approved as member)                │
├─────────────────────────────────────────────────────────────┤
│ Same as public user, plus:                                   │
│ • Can log in with username/password                          │
│ • JWT token stored in httpOnly cookie                        │
│ • Session tracked in Redis                                   │
│                                                              │
│ Cannot access:                                               │
│ • /gallery/add (Add picture)                                 │
│ • /arrangementer/add (Add event)                             │
│ • /sitater/add (Add quote)                                   │
│ (Will show: "Du må være medlem for å...")                    │
│                                                              │
│ Navbar shows: [Username] [Logg ut]                           │
└─────────────────────────────────────────────────────────────┘
                            ▼ (Admin approves as member)
┌─────────────────────────────────────────────────────────────┐
│ MEMBER (Approved member)                                     │
├─────────────────────────────────────────────────────────────┤
│ Full access including:                                       │
│ • /gallery/add - Upload images                               │
│ • /arrangementer/add - Create events                         │
│ • /sitater/add - Add quotes                                  │
│ • Edit/delete own content                                    │
│                                                              │
│ Navbar shows extra links:                                    │
│ [+ Bilde] [+ Arrangement] [+ Sitat] [Username] [Logg ut]    │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

```
App (with AuthProvider)
│
├── Navbar (Shows login/username based on auth state)
│
├── Routes:
│   ├── / → Home
│   ├── /login → Login page
│   ├── /register → Register page
│   ├── /gallery → Gallery (public read-only)
│   ├── /gallery/add → AddPicture (member only)
│   ├── /arrangementer → Events (public read-only)
│   ├── /arrangementer/add → AddEvent (member only)
│   ├── /sitater → Quotes (public read-only)
│   ├── /sitater/add → AddQuote (member only)
│   └── ... (other pages)
│
├── AuthContext
│   ├── user: User | null
│   ├── login(username, password)
│   ├── register(username, email, password)
│   └── logout()
│
└── Footer
```

## Backend API Routes

```
Authentication
├── POST /api/auth/register
│   └── Body: { username, email, password }
│       Response: { id, username, email, isMember }
├── POST /api/auth/login
│   └── Body: { username, password }
│       Response: { id, username, email, isMember }
├── GET /api/auth/me (Protected)
│   └── Response: { id, username, email, isMember }
└── POST /api/auth/logout (Protected)
    └── Response: { message: 'Logged out' }

Gallery (Image Management)
├── GET /api/gallery
│   └── Response: [{ id, title, url, uploadedBy, category, uploadedAt }]
├── POST /api/gallery/upload (Member only)
│   └── Body: FormData { file, title, category }
│       Response: { id, title, url, uploadedBy, category }
└── DELETE /api/gallery/:imageId (Member only)
    └── Response: { message: 'Deleted' }

Events
├── GET /api/events
│   └── Response: [{ id, title, description, date, location, createdBy }]
├── POST /api/events (Member only)
│   └── Body: { title, description, date, location }
│       Response: { id, title, description, date, location, createdBy }
├── PUT /api/events/:id (Member only)
│   └── Response: { updated event }
└── DELETE /api/events/:id (Member only)
    └── Response: { message: 'Deleted' }

Quotes
├── GET /api/quotes
│   └── Response: [{ id, text, author, source, addedBy, addedAt }]
├── POST /api/quotes (Member only)
│   └── Body: { text, author, source }
│       Response: { id, text, author, source, addedBy, addedAt }
├── PUT /api/quotes/:id (Member only)
│   └── Response: { updated quote }
└── DELETE /api/quotes/:id (Member only)
    └── Response: { message: 'Deleted' }
```

## Redis Database Structure

```
Redis Key Patterns:

Users
  users:{username}
    → Hash with: id, username, email, passwordHash, isMember, createdAt, etc.

Gallery
  gallery:images:{imageId}
    → Hash with: id, title, url, uploadedBy, uploadedAt, category
  gallery:categories
    → Set with: ['general', 'events', 'members']

Events
  events:{eventId}
    → Hash with: id, title, description, date, location, createdBy, createdAt
  events:list
    → Sorted set sorted by date

Quotes
  quotes:{quoteId}
    → Hash with: id, text, author, source, addedBy, addedAt
  quotes:list
    → Sorted set sorted by timestamp

Sessions
  sessions:{sessionId}
    → Hash with: userId, username, email, isMember, expiresAt
    → TTL: 7 days

User-Generated Content
  users:{username}:uploaded:images → Set of image IDs
  users:{username}:created:events → Set of event IDs
  users:{username}:added:quotes → Set of quote IDs
```

## Authentication Flow

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       │ 1. Submit registration form
       │ POST /api/auth/register
       ├────────────────────────┐
       │                        ▼
       │              ┌──────────────────┐
       │              │  Server (Node.js)│
       │              ├──────────────────┤
       │              │ 1. Hash password │
       │              │ 2. Create user   │
       │              │ 3. Store in Redis│
       │              │ 4. Generate JWT  │
       │              │ 5. Set cookie    │
       │              └────────┬─────────┘
       │                      │
       │ 2. Cookie + JWT      │
       │◄─────────────────────┘
       │ (httpOnly, Secure)
       │
       │ 3. All subsequent requests include cookie
       │ GET /api/auth/me
       ├────────────────────────┐
       │                        ▼
       │              ┌──────────────────┐
       │              │  Server (Node.js)│
       │              ├──────────────────┤
       │              │ 1. Read cookie   │
       │              │ 2. Verify JWT    │
       │              │ 3. Check Redis   │
       │              │ 4. Return user   │
       │              └────────┬─────────┘
       │                      │
       │ 4. User data        │
       │◄─────────────────────┘
       │
       │ User now logged in ✓
```

## Database Interactions

```
Frontend Login Form
        │
        ▼
    /api/auth/login
        │
        ▼
  ┌─────────────────────────────────────┐
  │   Server validates credentials       │
  │   1. Get user from Redis:            │
  │      await redis.hGetAll("users:X")  │
  │   2. Compare passwords with bcrypt   │
  │   3. Generate JWT token              │
  │   4. Store in session:               │
  │      await redis.setEx(...)          │
  │   5. Set httpOnly cookie             │
  └─────────────────────────────────────┘
        │
        ▼
    Client stores cookie (automatic)
        │
        ▼
    Cookie sent with each request
        │
        ▼
  ┌─────────────────────────────────────┐
  │   Server on protected routes:        │
  │   1. Read authToken from cookie      │
  │   2. Verify JWT signature            │
  │   3. Check if still in Redis:        │
  │      await redis.get("sessions:X")   │
  │   4. Return user data or 401         │
  └─────────────────────────────────────┘
```

## File Upload Flow

```
User selects image
        │
        ▼
   /gallery/add form
        │
        ▼
    POST /api/gallery/upload
    FormData { file, title, category }
        │
        ▼
  ┌──────────────────────────────────────┐
  │   Server                              │
  │   1. Verify JWT (member check)        │
  │   2. Validate file (type, size)       │
  │   3. Save file to uploads/            │
  │   4. Generate imageId (UUID)          │
  │   5. Store metadata in Redis:         │
  │      redis.hSet("gallery:images:X",  │
  │        { id, title, url, ...})        │
  │   6. Add to user's uploaded list:     │
  │      redis.sAdd("users:X:uploads",id) │
  └──────────────────────────────────────┘
        │
        ▼
    Image available in gallery
        │
        ▼
    GET /api/gallery
        │
        ▼
  ┌──────────────────────────────────────┐
  │   Server fetches all images from      │
  │   Redis and returns as JSON           │
  └──────────────────────────────────────┘
        │
        ▼
    Frontend renders gallery with new image
```

## Typical Member Workflow

```
1. New user arrives
   └─ Sees public pages (home, gallery, events, quotes)

2. User clicks "Registrer"
   └─ Fills form: username, email, password
   └─ POST /api/auth/register
   └─ Backend creates user (isMember: false)
   └─ JWT token set in cookie
   └─ Redirected to home page
   └─ Navbar now shows: [Username] [Logg ut]

3. Admin approves user as member
   └─ (TODO: Admin panel to change isMember: true)

4. User can now see member links in navbar
   └─ [+ Bilde] [+ Arrangement] [+ Sitat]

5. User clicks "Legg til bilde"
   └─ Form appears: title, category, file upload
   └─ POST /api/gallery/upload
   └─ Image saved to server
   └─ Metadata saved to Redis
   └─ Image appears in gallery

6. User creates event
   └─ Form: title, description, date, location
   └─ POST /api/events
   └─ Event stored in Redis with createdBy
   └─ Event appears on events page

7. User adds quote
   └─ Form: text, author, source
   └─ POST /api/quotes
   └─ Quote stored in Redis with addedBy
   └─ Quote appears on quotes page
```

## Session/Cookie Management

```
Registration/Login
        │
        ▼
┌─────────────────────────────────────┐
│ Generate JWT:                        │
│ jwt.sign({                           │
│   id: userId,                        │
│   username: 'user@example.com',      │
│   email: 'user@example.com',         │
│   isMember: true,                    │
│   role: 'user'                       │
│ }, JWT_SECRET, { expiresIn: '7d' })  │
│                                     │
│ Token valid for: 7 days              │
└─────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────┐
│ Set httpOnly Cookie:                 │
│ res.cookie('authToken', token, {     │
│   httpOnly: true,                    │
│   secure: true,                      │
│   sameSite: 'strict',                │
│   maxAge: 7 * 24 * 60 * 60 * 1000    │
│ })                                   │
│                                     │
│ Cookie expires in: 7 days            │
└─────────────────────────────────────┘
        │
        ▼
Client (Browser) automatically stores and sends cookie
        │
        ▼
Every request includes: Cookie: authToken=...
        │
        ▼
Server verifies JWT and user access
```

## Why httpOnly Cookies?

✅ **Advantages:**

- Not accessible by JavaScript (XSS protection)
- Automatically sent with requests
- Secure in HTTPS only mode
- Can't be stolen by JavaScript malware

❌ **Avoid localStorage for auth:**

- Vulnerable to XSS attacks
- JavaScript can steal tokens
- Requires manual header management

---

This architecture is designed to be:

- **Secure**: httpOnly cookies, JWT verification, bcrypt hashing
- **Scalable**: Redis for fast data access
- **Simple**: Easy to understand and modify
- **Type-safe**: TypeScript throughout
