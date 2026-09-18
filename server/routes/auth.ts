import { Router, type Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';
import { isProduction, jwtExpiresIn, jwtSecret } from '../config/env';
import { authenticateToken, type AuthenticatedRequest, type AuthenticatedUser } from '../middleware/auth';
import { redisClient } from '../utils/redis';

const router = Router();
const cookieMaxAge = 7 * 24 * 60 * 60 * 1000;

const publicUser = (user: Record<string, string>): AuthenticatedUser => ({
    id: user.id,
    username: user.username,
    email: user.email,
    isMember: user.isMember === 'true',
    role: user.role || 'user',
});

const setAuthCookie = (res: Response, user: AuthenticatedUser) => {
    const token = jwt.sign(user, jwtSecret, {
        expiresIn: jwtExpiresIn as SignOptions['expiresIn'],
    });

    res.cookie('authToken', token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        maxAge: cookieMaxAge,
    });
};

export const register = async (req: AuthenticatedRequest, res: Response) => {
    const username = typeof req.body?.username === 'string' ? req.body.username.trim() : '';
    const email = typeof req.body?.email === 'string' ? req.body.email.trim() : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';

    if (!username || !email || password.length < 8) {
        res.status(400).json({ error: 'Username, email, and a password of at least 8 characters are required' });
        return;
    }

    const existingUser = await redisClient.hGetAll(`users:${username}`);
    if (Object.keys(existingUser).length > 0) {
        res.status(409).json({ error: 'Username already exists' });
        return;
    }

    const now = new Date().toISOString();
    const user = {
        id: randomUUID(),
        username,
        email,
        passwordHash: await bcrypt.hash(password, 10),
        isMember: 'false',
        createdAt: now,
        updatedAt: now,
        role: 'user',
    };

    await redisClient.hSet(`users:${username}`, user);
    const safeUser = publicUser(user);
    setAuthCookie(res, safeUser);
    res.status(201).json(safeUser);
};

export const login = async (req: AuthenticatedRequest, res: Response) => {
    const username = typeof req.body?.username === 'string' ? req.body.username.trim() : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';
    const user = await redisClient.hGetAll(`users:${username}`);

    if (!user.passwordHash || !(await bcrypt.compare(password, user.passwordHash))) {
        res.status(401).json({ error: 'Invalid username or password' });
        return;
    }

    const safeUser = publicUser(user);
    setAuthCookie(res, safeUser);
    res.json(safeUser);
};

export const logout = async (_req: AuthenticatedRequest, res: Response) => {
    res.clearCookie('authToken', {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
    });
    res.json({ success: true });
};

export const getCurrentUser = async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
    }

    const user = await redisClient.hGetAll(`users:${req.user.username}`);
    if (!user.id) {
        res.status(401).json({ error: 'User no longer exists' });
        return;
    }

    res.json(publicUser(user));
};

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', authenticateToken, getCurrentUser);

export default router;