import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ACCESS_REQUIREMENTS, hasAccess } from '../../access-control';
import '../css/form.css';

const AddGallery = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!hasAccess(user, ACCESS_REQUIREMENTS.gallery)) {
        return (
            <div className="page-content">
                <div className="error-message">
                    Du må være registrert for å opprette et galleri. <Link to="/login">Logg inn her</Link>
                </div>
            </div>
        );
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/gallery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ title, description }),
            });

            if (!response.ok) {
                throw new Error('Opprettelse av galleri feilet');
            }

            navigate('/gallery');
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
                <h1>Nytt galleri</h1>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit} className="member-form">
                    <div className="form-group">
                        <label htmlFor="gallery-title">Navn på galleri</label>
                        <input
                            id="gallery-title"
                            type="text"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            required
                            maxLength={100}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="gallery-description">Beskrivelse (valgfritt)</label>
                        <textarea
                            id="gallery-description"
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                            rows={4}
                            maxLength={500}
                        />
                    </div>
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Oppretter...' : 'Opprett galleri'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddGallery;