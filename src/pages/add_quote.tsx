import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../css/form.css';

const AddQuote = () => {
    const [text, setText] = useState('');
    const [author, setAuthor] = useState('');
    const [source, setSource] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!user?.isMember) {
        return (
            <div className="page-content">
                <div className="error-message">
                    Du må være medlem for å legge til sitater. <a href="/login">Logg inn her</a>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/quotes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ text, author, source }),
            });

            if (!response.ok) {
                throw new Error('Opprettelse av sitat feilet');
            }

            navigate('/sitater');
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
                <h1>Legg til sitat</h1>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit} className="member-form">
                    <div className="form-group">
                        <label htmlFor="text">Sitat</label>
                        <textarea
                            id="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            rows={4}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="author">Forfatter (valgfritt)</label>
                        <input
                            id="author"
                            type="text"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="source">Kilde (valgfritt)</label>
                        <input
                            id="source"
                            type="text"
                            value={source}
                            onChange={(e) => setSource(e.target.value)}
                        />
                    </div>
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Legger til...' : 'Legg til sitat'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddQuote;
