import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../css/form.css';

const AddEvent = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!user?.isMember) {
        return (
            <div className="page-content">
                <div className="error-message">
                    Du må være medlem for å legge til arrangementer. <a href="/login">Logg inn her</a>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ title, description, date, location }),
            });

            if (!response.ok) {
                throw new Error('Opprettelse av arrangement feilet');
            }

            navigate('/arrangementer');
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
                <h1>Legg til arrangement</h1>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit} className="member-form">
                    <div className="form-group">
                        <label htmlFor="title">Tittel</label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Beskrivelse</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="date">Dato</label>
                        <input
                            id="date"
                            type="datetime-local"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="location">Lokasjon (valgfritt)</label>
                        <input
                            id="location"
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Legger til...' : 'Legg til arrangement'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddEvent;
