import type { GalleryAlbum } from '../types/types';
import { toGallerySlug } from '../../gallery-slug';

const imageNames = [
    'frederick',
    'håvard',
    'ingrid',
    'jo',
    'kim',
    'magnus',
    'maren',
    'maria',
    'marit',
    'moddis',
    'phillip',
    'tobias',
    'toffe',
    'tonje',
];

export const builtInAlbum: GalleryAlbum = {
    id: 'community-portraits',
    slug: toGallerySlug('Støttegruppen'),
    title: 'Støttegruppen',
    isBuiltIn: true,
    images: imageNames.map((name) => ({
        id: `portrait-${name}`,
        url: `/images/linkedinbilder/${name}.jpg`,
        title: name,
        uploadedBy: 'Støttegruppen',
        uploadedAt: '',
        galleryId: 'community-portraits',
    })),
};

export const getGallerySlug = (album: GalleryAlbum): string => (
    album.slug || toGallerySlug(album.title)
);

export const loadGalleryAlbums = async (): Promise<GalleryAlbum[]> => {
    const response = await fetch('/api/gallery', { credentials: 'include' });
    if (!response.ok) {
        throw new Error('Kunne ikke hente gallerier');
    }

    const remoteAlbums: GalleryAlbum[] = await response.json();
    const persistedBuiltInAlbum = remoteAlbums.find((album) => album.id === builtInAlbum.id);
    const mergedBuiltInAlbum: GalleryAlbum = {
        ...builtInAlbum,
        description: persistedBuiltInAlbum?.description || builtInAlbum.description,
        images: [...builtInAlbum.images, ...(persistedBuiltInAlbum?.images || [])],
    };

    return [
        mergedBuiltInAlbum,
        ...remoteAlbums.filter((album) => album.id !== builtInAlbum.id),
    ];
};