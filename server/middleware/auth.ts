import type { NextFunction, Request, Response } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { hasAccess, type AccessLevel } from '../../access-control';
import { jwtSecret } from '../config/env';

export interface AuthenticatedUser {
    id: string;
    username: string;
    email: string;
    isMember: boolean;
    role: string;
}

export type AuthenticatedRequest = Request & {
    user?: AuthenticatedUser;
    cookies?: Record<string, string>;
};

const isJwtPayload = (value: string | JwtPayload): value is JwtPayload => (
    typeof value !== 'string' && typeof value.id === 'string' && typeof value.username === 'string'
);

export const authenticateToken = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
): void => {
    const token = req.cookies?.authToken;
    if (!token) {
        res.status(401).json({ error: 'Authentication required' });
        return;
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        if (!isJwtPayload(decoded)) {
            res.status(401).json({ error: 'Invalid token' });
            return;
        }

        req.user = {
            id: decoded.id,
            username: decoded.username,
            email: typeof decoded.email === 'string' ? decoded.email : '',
            isMember: decoded.isMember === true,
            role: typeof decoded.role === 'string' ? decoded.role : 'user',
        };
        next();
    } catch {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};

export const requireAccess = (requirement: AccessLevel) => (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
): void => {
    if (!hasAccess(req.user, requirement)) {
        res.status(403).json({ error: `${requirement} access required` });
        return;
    }

    next();
};

export const requireMember = requireAccess('member');

export const requireAdmin = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
): void => {
    if (req.user?.role !== 'admin') {
        res.status(403).json({ error: 'Admin access required' });
        return;
    }

    next();
};

export const errorHandler = (
    error: Error & { status?: number },
    _req: Request,
    res: Response,
    _next: NextFunction,
): void => {
    void _next;
    console.error(error);
    res.status(error.status || 500).json({
        error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message,
    });
};
