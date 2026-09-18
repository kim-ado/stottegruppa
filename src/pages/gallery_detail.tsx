import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import lightGallery from 'lightgallery';
import 'lightgallery/css/lightgallery.css';

import { useAuth } from '../contexts/AuthContext';
import { ACCESS_REQUIREMENTS, hasAccess } from '../../access-control';
import { builtInAlbum, getGallerySlug, loadGalleryAlbums } from '../data/gallery';
import type { GalleryAlbum } from '../types/types';
import '../css/gallery.css';

const GalleryDetail = () => {
    const { gallerySlug } = useParams<{ gallerySlug: string }>();
    const galleryRef = useRef<HTMLDivElement>(null);
    const [album, setAlbum] = useState<GalleryAlbum | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        let isMounted = true;
        const requestedSlug = gallerySlug || '';

        loadGalleryAlbums()
            .then((albums) => {
                const matchingAlbum = albums.find((candidate) => getGallerySlug(candidate) === requestedSlug);
                if (!matchingAlbum) {
                    throw new Error('Fant ikke dette galleriet');
                }
                if (isMounted) {
                    setAlbum(matchingAlbum);
                }
            })
            .catch((loadError: unknown) => {
                if (isMounted && requestedSlug === getGallerySlug(builtInAlbum)) {
                    setAlbum(builtInAlbum);
                    return;
                }
                if (isMounted) {
                    setError(loadError instanceof Error ? loadError.message : 'Kunne ikke hente galleriet');
                }
            });

        return () => {
            isMounted = false;
        };
    }, [gallerySlug]);

    useEffect(() => {
        if (!galleryRef.current || !album || album.images.length === 0) {
            return undefined;
        }

        const instance = lightGallery(galleryRef.current, { selector: '.gallery-image' });
        return () => {
            instance.destroy();
        };
    }, [album]);

    if (error || !album) {
        return (
            <div className="page-content">
                <section className="gallery-section gallery-state">
                    <Link to="/gallery" className="gallery-back">« Tilbake til alle gallerier</Link>
                    {error ? <p className="gallery-error">{error}</p> : <p>Laster galleri...</p>}
                </section>
            </div>
        );
    }

    const canAddImages = hasAccess(user, ACCESS_REQUIREMENTS.galleryImages);
    const imageCount = album.images.length;

    return (
        <div className="page-content">
            <section className="gallery-section gallery-detail">
                <Link to="/gallery" className="gallery-back">« Tilbake til alle gallerier</Link>
                <header className="gallery-detail-header">
                    <div>
                        <h1>{album.title}</h1>
                        <p className="gallery-intro">
                            {album.description || 'Bilder fra støttegruppen.'}
                        </p>
                    </div>
                    {canAddImages && (
                        <Link to={`/gallery/add-picture?gallery=${album.id}`} className="gallery-action">
                            + Bilde
                        </Link>
                    )}
                </header>

                <div className="gallery-detail-meta">
                    {imageCount} {imageCount === 1 ? 'bilde' : 'bilder'} i dette galleriet
                </div>

                {imageCount > 0 ? (
                    <div id="gallery" ref={galleryRef} className="gallery-grid">
                        {album.images.map((image) => (
                            <a key={image.id} className="gallery-image" href={image.url}>
                                <img src={image.url} alt={image.title} />
                            </a>
                        ))}
                    </div>
                ) : (
                    <p className="gallery-empty">Dette galleriet har ingen bilder ennå.</p>
                )}
            </section>
        </div>
    );
};

export default GalleryDetail;