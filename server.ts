// Backend server - TODO: Fill in implementation details
// This is a scaffolding file for your Node.js/Express backend

/**
 * SETUP INSTRUCTIONS:
 * 
 * 1. Install dependencies:
 *    npm install express cors dotenv redis bcrypt jsonwebtoken
 *    npm install -D @types/express @types/node
 * 
 * 2. Create .env file with:
 *    PORT=3001
 *    REDIS_URL=redis://localhost:6379
 *    JWT_SECRET=your-secret-key
 *    NODE_ENV=development
 * 
 * 3. Install and run Redis:
 *    On Linux: sudo apt-get install redis-server && redis-server
 *    On Mac: brew install redis && redis-server
 *    Or use Docker: docker run -p 6379:6379 redis
 * 
 * 4. Run the server:
 *    npm run dev  (with nodemon)
 *    or node server.js
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from 'redis';
import cookieParser from 'cookie-parser';

// TODO: Implement these route modules
// import authRoutes from './routes/auth';
// import galleryRoutes from './routes/gallery';
// import eventRoutes from './routes/events';
// import quoteRoutes from './routes/quotes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Redis client setup - TODO: Implement connection and error handling
const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes - TODO: Implement these
// app.use('/api/auth', authRoutes);
// app.use('/api/gallery', galleryRoutes);
// app.use('/api/events', eventRoutes);
// app.use('/api/quotes', quoteRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Connect to Redis and start server
redisClient.connect().then(() => {
    console.log('Connected to Redis');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch((err) => {
    console.error('Failed to connect to Redis:', err);
    process.exit(1);
});

export default app;
