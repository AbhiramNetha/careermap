import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-brand">
                    <div className="footer-logo">🗺️ CareerMap India</div>
                    <p className="footer-desc">
                        India's most structured career decision platform for engineering students.
                        Make informed decisions with data-backed insights.
                    </p>
                </div>

                <div>
                    <div className="footer-col-title">Explore</div>
                    <ul className="footer-links">
                        <li><Link to="/careers">All Careers</Link></li>
                        <li><Link to="/careers?category=private">Private Sector</Link></li>
                        <li><Link to="/careers?category=government">Government Jobs</Link></li>
                        <li><Link to="/careers?category=higher-studies">Higher Studies</Link></li>
                    </ul>
                </div>

                <div>
                    <div className="footer-col-title">Tools</div>
                    <ul className="footer-links">
                        <li><Link to="/quiz">Career Quiz</Link></li>
                        <li><Link to="/compare">Career Comparison</Link></li>
                        <li><Link to="/branches">Branch Guide</Link></li>
                    </ul>
                </div>

                <div>
                    <div className="footer-col-title">Branches</div>
                    <ul className="footer-links">
                        <li><Link to="/branches/CSE">CSE</Link></li>
                        <li><Link to="/branches/ECE">ECE</Link></li>
                        <li><Link to="/branches/Mechanical">Mechanical</Link></li>
                        <li><Link to="/branches/Civil">Civil</Link></li>
                        <li><Link to="/branches/EEE">EEE</Link></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p>© 2024 CareerMap India — Built for B.Tech students across India 🇮🇳</p>
                <p style={{ marginTop: '4px', color: 'var(--text-muted)' }}>
                    Data is indicative. Career outcomes are not guaranteed.
                </p>
            </div>
        </footer>
    );
}
