import { Router, type Response } from 'express';
import multer from 'multer';
import { randomUUID } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { unlink } from 'node:fs/promises';
import { extname, resolve } from 'node:path';
import { ACCESS_REQUIREMENTS } from '../../access-control';
import { toGallerySlug } from '../../gallery-slug';
import { maxFileSize, uploadDir } from '../config/env';
import { authenticateToken, requireAccess, type AuthenticatedRequest } from '../middleware/auth';
import { redisClient } from '../utils/redis';

const router = Router();
const builtInGalleryId = 'community-portraits';
const absoluteUploadDir = resolve(uploadDir);
mkdirSync(absoluteUploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (_req, _file, callback) => callback(null, absoluteUploadDir),
    filename: (_req, file, callback) => callback(null, `${randomUUID()}${extname(file.originalname).toLowerCase()}`),
});

const upload = multer({
    storage,
    limits: { fileSize: maxFileSize },
    fileFilter: (_req, file, callback) => {
        callback(null, file.mimetype.startsWith('image/'));
    },
});

interface GalleryImageResponse {
    id: string;
    galleryId: string;
    url: string;
    title: string;
    uploadedBy: string;
    uploadedAt: string;
}

interface GalleryResponse {
    id: string;
    slug: string;
    title: string;
    description: string;
    images: GalleryImageResponse[];
    createdBy: string;
    createdAt: string;
}

const imageFromRedis = (data: Record<string, string>): GalleryImageResponse | null => {
    if (!data.id || !data.galleryId || !data.url) {
        return null;
    }

    return {
        id: data.id,
        galleryId: data.galleryId,
        url: data.url,
        title: data.title,
        uploadedBy: data.uploadedBy,
        uploadedAt: data.uploadedAt,
    };
};

const galleryFromRedis = async (galleryId: string): Promise<GalleryResponse | null> => {
    const data = await redisClient.hGetAll(`gallery:albums:${galleryId}`);
    if (!data.id && galleryId !== builtInGalleryId) {
        return null;
    }

    const imageIds = await redisClient.sMembers(`gallery:album:${galleryId}:images`);
    const images = (await Promise.all(
        imageIds.map(async (imageId) => imageFromRedis(await redisClient.hGetAll(`gallery:images:${imageId}`))),
    )).filter((image): image is GalleryImageResponse => image !== null);

    return {
        id: data.id || builtInGalleryId,
        slug: data.slug || toGallerySlug(data.title || 'Støttegruppen'),
        title: data.title || 'Støttegruppen',
        description: data.description || 'Bilder fra støttegruppen.',
        images,
        createdBy: data.createdBy || 'Støttegruppen',
        createdAt: data.createdAt || '1970-01-01T00:00:00.000Z',
    };
};

export const getAllGalleries = async (_req: AuthenticatedRequest, res: Response) => {
    const galleryIds = new Set([
        builtInGalleryId,
        ...(await redisClient.sMembers('gallery:albums')),
    ]);
    const galleries = (await Promise.all([...galleryIds].map(galleryFromRedis)))
        .filter((gallery): gallery is GalleryResponse => gallery !== null)
        .sort((first, second) => first.createdAt.localeCompare(second.createdAt));

    res.json(galleries);
};

export const createGallery = async (req: AuthenticatedRequest, res: Response) => {
    const title = typeof req.body?.title === 'string' ? req.body.title.trim() : '';
    const description = typeof req.body?.description === 'string' ? req.body.description.trim() : '';

    if (!req.user || !title) {
        res.status(400).json({ error: 'A gallery name is required' });
        return;
    }

    const id = randomUUID();
    const slug = toGallerySlug(title);
    const createdAt = new Date().toISOString();
    await redisClient.hSet(`gallery:albums:${id}`, {
        id,
        slug,
        title,
        description,
        createdBy: req.user.username,
        createdAt,
    });
    await redisClient.sAdd('gallery:albums', id);

    res.status(201).json({
        id,
        slug,
        title,
        description,
        images: [],
        createdBy: req.user.username,
        createdAt,
    });
};

export const uploadImage = async (req: AuthenticatedRequest, res: Response) => {
    const file = req.file;
    const galleryId = typeof req.body?.galleryId === 'string' ? req.body.galleryId : '';
    const title = typeof req.body?.title === 'string' ? req.body.title.trim() : '';

    if (!file || !req.user || !galleryId || !title) {
        if (file) {
            await unlink(file.path).catch(() => undefined);
        }
        res.status(400).json({ error: 'Gallery, image title, and image file are required' });
        return;
    }

    const isBuiltInGallery = galleryId === builtInGalleryId;
    const galleryExists = isBuiltInGallery || await redisClient.exists(`gallery:albums:${galleryId}`) > 0;
    if (!galleryExists) {
        await unlink(file.path).catch(() => undefined);
        res.status(404).json({ error: 'Gallery not found' });
        return;
    }

    const image = {
        id: randomUUID(),
        galleryId,
        url: `/uploads/${file.filename}`,
        title,
        uploadedBy: req.user.username,
        uploadedAt: new Date().toISOString(),
    };
    await redisClient.hSet(`gallery:images:${image.id}`, image);
    await redisClient.sAdd(`gallery:album:${galleryId}:images`, image.id);
    res.status(201).json(image);
};

export const deleteImage = async (req: AuthenticatedRequest, res: Response) => {
    const image = await redisClient.hGetAll(`gallery:images:${req.params.imageId}`);
    if (!image.id) {
        res.status(404).json({ error: 'Image not found' });
        return;
    }

    if (image.uploadedBy !== req.user?.username && req.user?.role !== 'admin') {
        res.status(403).json({ error: 'You cannot delete this image' });
        return;
    }

    await redisClient.del(`gallery:images:${image.id}`);
    await redisClient.sRem(`gallery:album:${image.galleryId}:images`, image.id);
    if (image.url.startsWith('/uploads/')) {
        await unlink(resolve(absoluteUploadDir, image.url.slice('/uploads/'.length))).catch(() => undefined);
    }
    res.json({ success: true });
};

router.get('/', getAllGalleries);
router.post('/', authenticateToken, requireAccess(ACCESS_REQUIREMENTS.gallery), createGallery);
router.post(
    '/upload',
    authenticateToken,
    requireAccess(ACCESS_REQUIREMENTS.galleryImages),
    upload.single('file'),
    uploadImage,
);
router.delete('/:imageId', authenticateToken, requireAccess(ACCESS_REQUIREMENTS.galleryImages), deleteImage);

export default router;