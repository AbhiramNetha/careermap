import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAllCareers } from '../services/api';
import { useApp } from '../context/AppContext';
import GifScrollSequence from '../components/GifScrollSequence';
import SpotlightCard from '../components/SpotlightCard';
import BlurText from '../components/BlurText';

/* ─── Tiny Rising Bubbles Canvas ─── */
function BubblesCanvas() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let width, height, bubbles, animId;

        const COLORS = [
            [99, 102, 241],   // indigo
            [139, 92, 246],   // violet
            [6, 182, 212],   // cyan
            [16, 185, 129],   // emerald
            [248, 113, 113],   // rose
        ];

        function rnd(min, max) { return Math.random() * (max - min) + min; }

        function makeBubble(startAtBottom = false) {
            const [r, g, b] = COLORS[Math.floor(Math.random() * COLORS.length)];
            const radius = rnd(2, 9);
            return {
                x: rnd(0, width),
                y: startAtBottom ? rnd(height * 0.6, height + radius) : rnd(-radius, height + radius),
                r: radius,
                speed: rnd(0.4, 1.4),           // upward speed
                wobble: rnd(0, Math.PI * 2),    // horizontal wobble phase
                wobbleAmp: rnd(0.2, 0.8),       // how much it sways
                wobbleSpeed: rnd(0.012, 0.03),
                alpha: rnd(0.25, 0.65),
                r_: r, g_: g, b_: b,
            };
        }

        function resize() {
            width = canvas.width = canvas.offsetWidth;
            height = canvas.height = canvas.offsetHeight;
        }

        function init() {
            resize();
            // ~1 bubble per 4 000 px² gives a dense-but-not-crowded feel
            const count = Math.max(60, Math.floor((width * height) / 4000));
            bubbles = Array.from({ length: count }, () => makeBubble(false));
        }

        function draw() {
            ctx.clearRect(0, 0, width, height);

            bubbles.forEach(b => {
                // horizontal wobble
                b.wobble += b.wobbleSpeed;
                b.x += Math.sin(b.wobble) * b.wobbleAmp;

                // rise
                b.y -= b.speed;

                // recycle when off-screen top
                if (b.y + b.r < 0) {
                    Object.assign(b, makeBubble(true));
                    b.y = height + b.r;
                }

                // clamp horizontal so they don't wander too far
                if (b.x < -b.r) b.x = width + b.r;
                if (b.x > width + b.r) b.x = -b.r;

                // draw a clean tiny circle with a hairline rim
                ctx.save();
                ctx.globalAlpha = b.alpha;

                ctx.beginPath();
                ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${b.r_},${b.g_},${b.b_},0.35)`;
                ctx.fill();

                // rim (slightly brighter)
                ctx.beginPath();
                ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(${b.r_},${b.g_},${b.b_},0.8)`;
                ctx.lineWidth = 0.8;
                ctx.stroke();

                // tiny specular dot (top-left)
                ctx.beginPath();
                ctx.arc(b.x - b.r * 0.28, b.y - b.r * 0.28, b.r * 0.22, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255,255,255,0.55)';
                ctx.fill();

                ctx.restore();
            });

            animId = requestAnimationFrame(draw);
        }

        init();
        draw();

        const ro = new ResizeObserver(init);
        ro.observe(canvas);

        return () => {
            cancelAnimationFrame(animId);
            ro.disconnect();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 0,
            }}
        />
    );
}

/* ─── Inline CareerCard ─── */
function CareerCard({ career, onCompare, onView }) {
    const riskClass = `risk-${career.riskLevel?.toLowerCase()}`;
    return (
        <div className="career-card fade-in">
            <div className="career-card-header">
                <div>
                    <div className="career-name">{career.name}</div>
                    <div className="career-subcategory">{career.subCategory}</div>
                </div>
                {career.isTrending && <span className="trend-badge">🔥 Trending</span>}
            </div>
            <p className="career-overview">{career.overview}</p>
            <div className="career-meta">
                <span className={`meta-tag ${riskClass}`}>⚡ {career.riskLevel} Risk</span>
                <span className="meta-tag">📊 {career.demandLevel} Demand</span>
                {career.studyRequired
                    ? <span className="meta-tag">📚 Study Required</span>
                    : <span className="meta-tag">✅ No Extra Degree</span>}
            </div>
            <div className="career-salary">💰 Fresher: {career.salary?.fresher}</div>
            <div className="career-card-footer">
                <button className="btn-sm btn-outline" onClick={() => onCompare(career)}>⚖️ Compare</button>
                <button className="btn-sm btn-filled" onClick={() => onView(career.id)}>View Details →</button>
            </div>
        </div>
    );
}

const TRENDING = [
    { emoji: '📊', name: 'Data Analyst', salary: '₹4–8 LPA', id: 'data-analyst', color: '#6366f1' },
    { emoji: '💻', name: 'Software Dev', salary: '₹5–12 LPA', id: 'software-developer', color: '#8b5cf6' },
    { emoji: '🎓', name: 'MBA via CAT', salary: '₹10–25 LPA', id: 'mba-cat', color: '#f59e0b' },
    { emoji: '🌍', name: 'MS Abroad', salary: '₹25–60 LPA', id: 'ms-abroad', color: '#06b6d4' },
    { emoji: '🚀', name: 'Startup / Entrepreneurship', salary: 'Unlimited', id: 'entrepreneurship', color: '#10b981' },
    { emoji: '🏛️', name: 'PSU Engineer', salary: '₹6–10 LPA', id: 'psu-engineer', color: '#059669' },
];

const TEAM = [
    { name: 'Aarup', role: 'Full-Stack Developer', emoji: '👨‍💻', color: '#6366f1' },
    { name: 'way2fresher', role: 'Platform Mission', emoji: '🚀', color: '#8b5cf6' },
    { name: 'India Focus', role: 'Tailored for B.Tech', emoji: '🇮🇳', color: '#10b981' },
];

const ABOUT_STATS = [
    { value: '8+', label: 'Career Paths', icon: '🗺️' },
    { value: '5', label: 'Engineering Branches', icon: '🎓' },
    { value: '7', label: 'Quiz Parameters', icon: '✨' },
    { value: '100%', label: 'India Focused', icon: '🇮🇳' },
];

const VALUES = [
    { icon: '🎯', title: 'Personalization', desc: 'Career recommendations tailored to your branch, skills, risk appetite, and life goals.' },
    { icon: '📊', title: 'Data-Driven', desc: 'Every suggestion is backed by real salary data, market trends, and growth projections.' },
    { icon: '🇮🇳', title: 'India-First', desc: 'Built specifically for the Indian engineering ecosystem — PSU, CAT, GATE, startups & beyond.' },
    { icon: '🔓', title: 'Completely Free', desc: 'No subscriptions, no paywalls. Every feature — quiz, roadmaps, comparisons — is free forever.' },
];

export default function HomePage() {
    const navigate = useNavigate();
    const { addToCompare } = useApp();
    const [trendingCareers, setTrendingCareers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAllCareers({ trending: true })
            .then(res => setTrendingCareers(res.data.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    return (
        <>
            <GifScrollSequence />

            {/* ══════ HERO ══════ */}
            <section className="hero" id="home">
                <div className="hero-bg-glow" />
                <div className="hero-bg-glow-2" />
                <div className="container hero-content">
                    <div className="hero-badge">✨ India's #1 Career Decision Platform for Engineers</div>
                    <BlurText
                        text="Find Your Perfect Career Path After B.Tech"
                        delay={100}
                        animateBy="words"
                        direction="bottom"
                        className="hero-title"
                    />
                    <p className="hero-subtitle">
                        Stop guessing. Use our intelligent quiz, detailed roadmaps, and comparison engine
                        to make the smartest career decision for your future.
                    </p>
                    <div className="hero-cta">
                        <button className="btn-primary" onClick={() => navigate('/quiz')}>Take Career Quiz — 7 Questions</button>
                        <button className="btn-secondary" onClick={() => navigate('/careers')}>Explore All Careers</button>
                    </div>
                    <div className="hero-stats">
                        <div className="hero-stat-item">
                            <div className="stat-value">8+</div>
                            <div className="stat-label">Career Paths</div>
                        </div>
                        <div className="hero-stat-item">
                            <div className="stat-value">5</div>
                            <div className="stat-label">Branches</div>
                        </div>
                        <div className="hero-stat-item">
                            <div className="stat-value">7</div>
                            <div className="stat-label">Parameters</div>
                        </div>
                        <div className="hero-stat-item">
                            <div className="stat-value">100%</div>
                            <div className="stat-label">India Focused</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════ CATEGORIES ══════ */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <div className="section-tag">Career Categories</div>
                        <h2 className="section-title">Four Paths. <span className="gradient-text">Infinite Possibilities.</span></h2>
                        <p className="section-subtitle">Every engineering career fits into one of these categories. Choose your direction.</p>
                    </div>
                    <div className="categories-grid">
                        {[
                            { id: 'private', icon: '💼', name: 'Private Sector Jobs', desc: 'IT, Analytics, Core Engineering & Product roles at top companies', count: '50+ careers', color: '#6366f1' },
                            { id: 'higher-studies', icon: '🎓', name: 'Higher Studies', desc: 'M.Tech via GATE, MBA via CAT & MS Abroad for advanced qualifications', count: '10+ paths', color: '#8b5cf6' },
                            { id: 'government', icon: '🏛️', name: 'Government Jobs', desc: 'PSU, SSC JE, UPSC for job security & work-life balance', count: '20+ exams', color: '#059669' },
                            { id: 'entrepreneurship', icon: '🚀', name: 'Entrepreneurship', desc: "Build your startup using engineering skills & India's growing ecosystem", count: 'Unlimited potential', color: '#f59e0b' },
                        ].map(cat => (
                            <SpotlightCard key={cat.id} className="category-card" onClick={() => navigate(`/careers?category=${cat.id}`)} spotlightColor={cat.color}>
                                <div className="category-icon">{cat.icon}</div>
                                <div className="category-name">{cat.name}</div>
                                <div className="category-desc">{cat.desc}</div>
                                <div className="category-count" style={{ color: cat.color }}>→ {cat.count}</div>
                            </SpotlightCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════ HOW IT WORKS ══════ */}
            <section className="section" style={{ background: 'var(--bg-glass)' }}>
                <div className="container">
                    <div className="section-header">
                        <div className="section-tag">How It Works</div>
                        <h2 className="section-title">Career Clarity in <span className="gradient-text">4 Simple Steps</span></h2>
                    </div>
                    <div className="categories-grid">
                        {[
                            { step: '01', icon: '✨', title: 'Take the Quiz', desc: '7 personalized questions about your branch, interests & preferences' },
                            { step: '02', icon: '🎯', title: 'Get Recommendations', desc: 'Our scoring engine finds your top 3 career matches with match %' },
                            { step: '03', icon: '⚖️', title: 'Compare Options', desc: 'Side-by-side comparison of salary, risk, growth & stability' },
                            { step: '04', icon: '🗺️', title: 'Follow the Roadmap', desc: 'Month-by-month preparation plan with skills, tools & projects' },
                        ].map(item => (
                            <SpotlightCard key={item.step} className="category-card" style={{ textAlign: 'center' }} spotlightColor="rgba(99, 102, 241, 0.15)">
                                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-light)', marginBottom: '1.5rem', letterSpacing: '2px', fontFamily: 'var(--font-heading)' }}>STEP {item.step}</div>
                                <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>{item.icon}</div>
                                <div className="category-name">{item.title}</div>
                                <div className="category-desc">{item.desc}</div>
                            </SpotlightCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════ TRENDING CAREERS ══════ */}
            <section className="section" style={{ background: 'var(--gradient-hero)' }}>
                <div className="container">
                    <div className="section-header">
                        <div className="section-tag">Trending Now</div>
                        <h2 className="section-title">Most Popular <span className="gradient-text">Career Choices</span></h2>
                        <p className="section-subtitle">What students across India are choosing in 2024</p>
                    </div>
                    <div className="trending-scroll" style={{ display: 'flex', gap: '2rem', overflowX: 'auto', padding: '1rem 0.5rem 2.5rem', scrollbarWidth: 'none' }}>
                        {TRENDING.map(item => (
                            <SpotlightCard
                                key={item.id}
                                className="category-card"
                                onClick={() => navigate(`/careers/${item.id}`)}
                                style={{ 
                                    minWidth: '280px', 
                                    padding: '2rem',
                                    textAlign: 'left'
                                }}
                                spotlightColor={item.color}
                            >
                                <div className="category-icon" style={{ fontSize: '2.5rem' }}>{item.emoji}</div>
                                <div className="category-name" style={{ fontSize: '1.25rem' }}>{item.name}</div>
                                <div className="category-count" style={{ color: item.color, fontSize: '1.1rem' }}>{item.salary}</div>
                            </SpotlightCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════ ABOUT SECTION ══════ */}
            <section className="section about-section" id="about">
                <div className="container">
                    {/* Header */}
                    <div className="section-header">
                        <div className="section-tag">About way2fresher</div>
                        <h2 className="section-title">
                            Empowering <span className="gradient-text">The Next Generation</span>
                        </h2>
                        <p className="section-subtitle">
                            We are more than a career site. We are a structured decision-making engine built specifically for the unique needs of Indian Engineering graduates.
                        </p>
                    </div>

                    {/* Mission + Visual */}
                    <div className="about-grid">
                        <div className="about-story">
                            <div className="about-story-tag">Our Platform</div>
                            <h3 className="about-story-title">How It Helps You</h3>
                            <div className="about-story-text">
                                <p><strong>🎯 Personalized Career Quiz:</strong> Stop following the crowd. Our intelligent quiz analyzes your branch (CSE, ECE, Mech, etc.), risk appetite, and personal interests to suggest the top 3 paths where you are most likely to succeed.</p>
                                <p><strong>🔍 Detailed Career Database:</strong> Dive into 50+ mapped careers. Each page covers salary ranges (fresher to senior), future demand, stability, and typical work-life balance — all tailored to the Indian market.</p>
                                <p><strong>⚖️ Strategic Comparison:</strong> Should you do an MBA or join an IT firm? Use our comparison tool to weigh the long-term ROI, effort required, and risk of different paths side-by-side.</p>
                                <p><strong>🗺️ Master Roadmaps:</strong> Once you decide, we don't leave you hanging. Follow month-by-month skill-building plans, discover the best certifications, and find exactly what projects you need to build to get hired.</p>
                            </div>
                        </div>

                        <div className="about-story">
                            <div className="about-story-tag">Freshers First</div>
                            <h3 className="about-story-title">Why Use way2fresher?</h3>
                            <div className="about-story-text">
                                <p>For freshers, the transition from college to the workplace is often a "black box." way2fresher turns that box transparent. We provide the <strong>structure</strong> that is missing in university curriculum and the <strong>transparency</strong> that is missing in job portals.</p>
                                <p>By using data-backed insights on PSU exams (GATE/IES), higher studies (CAT/GRE/MS), and private sector trends, we save you months of trial-and-error. Our mission is to ensure no fresher starts their career with regret.</p>
                            </div>
                        </div>
                    </div>

                        {/* Stats grid */}
                        <div className="about-stats-grid">
                            {ABOUT_STATS.map(s => (
                                <div key={s.label} className="about-stat-card">
                                    <div className="about-stat-icon">{s.icon}</div>
                                    <div className="about-stat-value">{s.value}</div>
                                    <div className="about-stat-label">{s.label}</div>
                                </div>
                            ))}
                        </div>

                    {/* Values */}
                    <div style={{ marginTop: '8rem' }}>
                        <div className="section-header" style={{ marginBottom: '4rem' }}>
                            <div className="section-tag">Our Values</div>
                            <h3 className="section-title">
                                Why Students <span className="gradient-text">Trust Us</span>
                            </h3>
                        </div>
                        <div className="values-grid">
                            {VALUES.map(v => (
                                <div key={v.title} className="value-card">
                                    <div className="value-icon">{v.icon}</div>
                                    <div className="value-title">{v.title}</div>
                                    <div className="value-desc">{v.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════ CTA ══════ */}
            <section className="section" style={{ paddingBottom: '10rem' }}>
                <div className="container">
                    <div className="cta-glass-card">
                        <div className="cta-glow" />
                        <div className="section-tag" style={{ marginBottom: '2rem' }}>Ready to Decide?</div>
                        <h2 className="hero-title" style={{ marginBottom: '1.5rem', fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
                            Your Career Clarity Starts with <span className="gradient-text">7 Questions</span>
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '3.5rem', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 3.5rem' }}>
                            Takes only 3 minutes. Join thousands of engineering students making data-backed career decisions.
                        </p>
                        <button className="btn-primary" onClick={() => navigate('/quiz')} style={{ fontSize: '1.2rem', padding: '18px 48px' }}>
                            🎯 Start Your Career Quiz Now
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
}
