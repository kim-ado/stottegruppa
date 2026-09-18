import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ACCESS_REQUIREMENTS, hasAccess } from '../../access-control';
import { getGallerySlug } from '../data/gallery';
import type { GalleryAlbum } from '../types/types';
import '../css/form.css';

const AddPicture = () => {
    const [title, setTitle] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [galleries, setGalleries] = useState<GalleryAlbum[]>([]);
    const [selectedGallery, setSelectedGallery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const loadGalleries = async () => {
            try {
                const response = await fetch('/api/gallery', { credentials: 'include' });
                if (!response.ok) {
                    throw new Error('Kunne ikke hente gallerier');
                }

                const albums: GalleryAlbum[] = await response.json();
                setGalleries(albums);
                setSelectedGallery((current) => (
                    current || searchParams.get('gallery') || albums[0]?.id || ''
                ));
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Kunne ikke hente gallerier');
            }
        };

        loadGalleries();
    }, [searchParams]);

    if (!hasAccess(user, ACCESS_REQUIREMENTS.galleryImages)) {
        return (
            <div className="page-content">
                <div className="error-message">
                    Du må være registrert for å legge til bilder. <a href="/login">Logg inn her</a>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            setError('Velg et bilde');
            return;
        }

        setIsLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        formData.append('galleryId', selectedGallery);

        try {
            const response = await fetch('/api/gallery/upload', {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Opplasting av bilde feilet');
            }

            const selectedAlbum = galleries.find((gallery) => gallery.id === selectedGallery);
            navigate(selectedAlbum ? `/gallery/${getGallerySlug(selectedAlbum)}` : '/gallery');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Noe gikk galt';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="page-content">
            <div className="form-container">
                <h1>Legg til bilde</h1>
                {error && <div className="error-message">{error}</div>}
                {galleries.length === 0 ? (
                    <p>Opprett et galleri først. <Link to="/gallery/add">Opprett galleri</Link></p>
                ) : (
                    <form onSubmit={handleSubmit} className="member-form">
                        <div className="form-group">
                            <label htmlFor="gallery">Galleri</label>
                            <select
                                id="gallery"
                                value={selectedGallery}
                                onChange={(e) => setSelectedGallery(e.target.value)}
                                required
                            >
                                {galleries.map((gallery) => (
                                    <option key={gallery.id} value={gallery.id}>{gallery.title}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="title">Bildetittel</label>
                            <input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="file">Velg bilde</label>
                            <input
                                id="file"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                required
                            />
                        </div>
                        <button type="submit" disabled={isLoading}>
                            {isLoading ? 'Laster opp...' : 'Legg til bilde'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AddPicture;
