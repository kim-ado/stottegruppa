import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import authRoutes from './server/routes/auth';
import galleryRoutes from './server/routes/gallery';
import { clientUrl, port, uploadDir } from './server/config/env';
import { errorHandler } from './server/middleware/auth';
import { connectRedis } from './server/utils/redis';

const app = express();

app.use(cors({
    origin: clientUrl,
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.resolve(uploadDir)));

app.use('/api/auth', authRoutes);
app.use('/api/gallery', galleryRoutes);

app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
});

app.use(errorHandler);

connectRedis().then(() => {
    console.log('Connected to Redis');
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}).catch((error: unknown) => {
    console.error('Failed to connect to Redis:', error);
    process.exit(1);
});

export default app;