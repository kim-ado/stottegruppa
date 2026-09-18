import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';
import { ACCESS_REQUIREMENTS, hasAccess } from '../../access-control';
import { builtInAlbum, getGallerySlug, loadGalleryAlbums } from '../data/gallery';
import type { GalleryAlbum } from '../types/types';
import '../css/gallery.css';

const Gallery = () => {
    const [albums, setAlbums] = useState<GalleryAlbum[]>([builtInAlbum]);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        let isMounted = true;

        const loadAlbums = async () => {
            try {
                const loadedAlbums = await loadGalleryAlbums();
                if (isMounted) {
                    setAlbums(loadedAlbums);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err instanceof Error ? err.message : 'Kunne ikke hente gallerier');
                }
            }
        };

        loadAlbums();
        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div className="page-content">
            <section className="gallery-section">
                <header className="gallery-header">
                    <div>
                        <p className="gallery-kicker">Samlet på ett sted</p>
                        <h1>Galleri</h1>
                        <p className="gallery-intro">Velg et galleri for å se bildene.</p>
                    </div>
                    {hasAccess(user, ACCESS_REQUIREMENTS.gallery) && (
                        <Link to="/gallery/add" className="gallery-action">+ Nytt galleri</Link>
                    )}
                </header>
                {error && <p className="gallery-error">{error}</p>}
                <div className="gallery-toolbar">
                    <span>{albums.length} {albums.length === 1 ? 'galleri' : 'gallerier'}</span>
                </div>
                <div className="gallery-list">
                    {albums.map((album, index) => {
                        const imageCount = album.images.length;

                        return (
                            <article key={album.id} className="gallery-card">
                                <div className="gallery-card-index" aria-hidden="true">
                                    {String(index + 1).padStart(2, '0')}
                                </div>
                                <div className="gallery-card-body">
                                    <div>
                                        <h2>{album.title}</h2>
                                        <p className="gallery-card-description">
                                            {album.description || 'Et galleri for bilder fra støttegruppen.'}
                                        </p>
                                    </div>
                                    <div className="gallery-card-footer">
                                        <span>{imageCount} {imageCount === 1 ? 'bilde' : 'bilder'}</span>
                                        <Link to={`/gallery/${getGallerySlug(album)}`} className="gallery-card-link">
                                            Åpne galleri
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </section>
        </div>
    );
};

export default Gallery;