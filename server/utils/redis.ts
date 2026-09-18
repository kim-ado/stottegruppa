import { createClient } from 'redis';
import { redisUrl } from '../config/env';

export const redisClient = createClient({ url: redisUrl });

redisClient.on('error', (error) => {
    console.error('Redis Client Error', error);
});

export const connectRedis = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
};