import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../css/navbar.css';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { user, logout } = useAuth();

    return (
        <nav className="navbar">
            <Link to="/" className="logo">
                <img src="/images/cross.png" alt="Logo" />
            </Link>

            <button
                className="hamburger"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Meny"
            >
                {menuOpen ? '✕' : '☰'}
            </button>

            <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
                <li><Link to="/" onClick={() => setMenuOpen(false)}>Hjem</Link></li>
                <li><Link to="/om-oss" onClick={() => setMenuOpen(false)}>Om oss</Link></li>
                <li><Link to="/gallery" onClick={() => setMenuOpen(false)}>Galleri</Link></li>
                <li><Link to="/sitater" onClick={() => setMenuOpen(false)}>Sitater</Link></li>
                <li><Link to="/arrangementer" onClick={() => setMenuOpen(false)}>Arrangementer</Link></li>
                <li><Link to="/merch" onClick={() => setMenuOpen(false)}>Merch</Link></li>
                <li><Link to="/kontakt" onClick={() => setMenuOpen(false)}>Kontakt</Link></li>
                <li><Link to="/gjestebok" onClick={() => setMenuOpen(false)}>Gjestebok</Link></li>
                {user?.isMember && (
                    <>
                        <li><Link to="/gallery/add" onClick={() => setMenuOpen(false)}>+ Bilde</Link></li>
                        <li><Link to="/arrangementer/add" onClick={() => setMenuOpen(false)}>+ Arrangement</Link></li>
                        <li><Link to="/sitater/add" onClick={() => setMenuOpen(false)}>+ Sitat</Link></li>
                    </>
                )}
                <li>
                    {user ? (
                        <>
                            <span className="user-info">{user.username}</span>
                            <button className="logout-btn" onClick={() => {
                                logout();
                                setMenuOpen(false);
                            }}>
                                Logg ut
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" onClick={() => setMenuOpen(false)}>Logg inn</Link>
                            {' / '}
                            <Link to="/register" onClick={() => setMenuOpen(false)}>Registrer</Link>
                        </>
                    )}
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
