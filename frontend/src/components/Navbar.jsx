import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Navbar() {
    const { selectedCareers } = useApp();
    const navigate = useNavigate();

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-logo">
                <span>🗺️</span>
                CareerMap India
            </Link>

            <ul className="navbar-links">
                <li><NavLink to="/">Home</NavLink></li>
                <li><NavLink to="/careers">Explore Careers</NavLink></li>
                <li><NavLink to="/branches">Branch Guide</NavLink></li>
                <li><NavLink to="/quiz">Career Quiz</NavLink></li>
                <li><NavLink to="/compare">Compare</NavLink></li>
                <li>
                    <a
                        href="#about"
                        onClick={e => {
                            e.preventDefault();
                            const el = document.getElementById('about');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                            else { window.location.href = '/#about'; }
                        }}
                    >
                        About
                    </a>
                </li>
            </ul>

            <div className="navbar-actions">
                {selectedCareers.length > 0 && (
                    <button className="compare-badge" onClick={() => navigate('/compare')}>
                        ⚖️ Compare ({selectedCareers.length})
                    </button>
                )}
                <NavLink to="/quiz" className="btn-quiz-cta">
                    ✨ Take Quiz
                </NavLink>
            </div>
        </nav>
    );
}
