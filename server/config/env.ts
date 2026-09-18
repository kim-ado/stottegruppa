import dotenv from 'dotenv';

dotenv.config();

export const port = Number(process.env.PORT || 3001);
export const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
export const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
export const jwtSecret = process.env.JWT_SECRET || 'development-only-secret';
export const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';
export const uploadDir = process.env.UPLOAD_DIR || './uploads';
export const maxFileSize = Number(process.env.MAX_FILE_SIZE || 5 * 1024 * 1024);
export const isProduction = process.env.NODE_ENV === 'production';