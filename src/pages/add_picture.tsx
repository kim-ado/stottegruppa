import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../css/form.css';

const AddPicture = () => {
    const [title, setTitle] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [category, setCategory] = useState('general');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!user?.isMember) {
        return (
            <div className="page-content">
                <div className="error-message">
                    Du må være medlem for å legge til bilder. <a href="/login">Logg inn her</a>
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
        formData.append('category', category);

        try {
            const response = await fetch('/api/gallery/upload', {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Opplasting av bilde feilet');
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
                <h1>Legg til bilde</h1>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit} className="member-form">
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
                        <label htmlFor="category">Kategori</label>
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="general">Generelt</option>
                            <option value="events">Arrangementer</option>
                            <option value="members">Medlemmer</option>
                        </select>
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
            </div>
        </div>
    );
};

export default AddPicture;
