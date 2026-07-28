import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import GifScrollSequence from '../components/GifScrollSequence';
import SpotlightCard from '../components/SpotlightCard';
import BlurText from '../components/BlurText';
import ScrollReveal from '../components/ScrollReveal';
import Tooltip from '../components/Tooltip';
import useCountUp from '../hooks/useCountUp';

/** Animated counter stat — counts up when it enters the viewport */
function CountUpStat({ end, suffix, label }) {
  const { display, ref } = useCountUp(end, 1600, suffix);
  return (
    <div className="hero-stat-item" ref={ref}>
      <motion.div
        className="stat-value"
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: 'backOut' }}
      >
        {display}
      </motion.div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

const TRENDING = [
    { name: 'Data Scientist', salary: '₹6–15 LPA', id: 'data-scientist', color: '#6366f1' },
    { name: 'Software Dev', salary: '₹5–12 LPA', id: 'software-developer', color: '#8b5cf6' },
    { name: 'MBA via CAT', salary: '₹15–50 LPA', id: 'mba-iim-xlri', color: '#f59e0b' },
    { name: 'MS Abroad', salary: '₹40–100 LPA', id: 'ms-abroad', color: '#06b6d4' },
    { name: 'SaaS Startup', salary: 'Variable', id: 'saas-startup', color: '#10b981' },
    { name: 'PSU Engineer', salary: '₹7–15 LPA', id: 'psu-engineer', color: '#059669' },
];

const ABOUT_STATS = [
    { value: '56+', label: 'Career Paths' },
    { value: '6', label: 'Degree Sectors' },
    { value: '100+', label: 'Opportunities' },
    { value: '100%', label: 'India Focused' },
];

const VALUES = [
    { title: 'Personalization', desc: 'Career recommendations tailored to your degree, skills, risk appetite, and personal goals.' },
    { title: 'Direct Opportunities', desc: 'Real-time verified Jobs, Internships, and Walk-in Drives for Freshers and Experienced candidates.' },
    { title: 'India-First', desc: 'Built for the entire Indian student ecosystem — Engineering, Commerce, Arts, Sciences, Management & more.' },
    { title: 'Completely Free', desc: 'No subscriptions, no paywalls. Every feature — quiz, roadmaps, opportunities — is free forever.' },
];

export default function HomePage() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [showQuizModal, setShowQuizModal] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowQuizModal(true);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const handleCloseModal = () => {
        setShowQuizModal(false);
    };

    const handleStartQuiz = () => {
        setShowQuizModal(false);
        if (currentUser) {
            navigate('/quiz');
        } else {
            navigate('/login', { state: { from: { pathname: '/quiz' } } });
        }
    };

    return (
        <>
            <GifScrollSequence />

            <section className="hero" id="home">
                <div className="hero-bg-glow" />
                <div className="hero-bg-glow-2" />
                <div className="container hero-content">
                    <ScrollReveal delay={0.05}>
                        <div className="hero-badge">India's #1 Career Decision Platform for Students</div>
                    </ScrollReveal>
                    <ScrollReveal delay={0.15}>
                        <h1 className="hero-title">Find Your Perfect Career Path After Graduation</h1>
                    </ScrollReveal>
                    <ScrollReveal delay={0.2}>
                        <p className="hero-subtitle">
                            Stop guessing. Use our intelligent quiz, detailed roadmaps, and direct job opportunities 
                            to make the smartest career decision for your future.
                        </p>
                    </ScrollReveal>
                    <ScrollReveal delay={0.35}>
                        <div className="hero-cta" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button className="btn-primary" onClick={() => navigate('/quiz')}>Take Career Quiz — 7 Questions</button>
                            <button className="btn-secondary" onClick={() => navigate('/careers')}>Explore All Careers</button>
                            <button className="btn-secondary" onClick={() => navigate('/jobs')}>💼 Explore Opportunities</button>
                        </div>
                    </ScrollReveal>
                    <div className="aurora-orb aurora-orb-1" />
                    <div className="aurora-orb aurora-orb-2" />
                    <div className="aurora-orb aurora-orb-3" />

                    <ScrollReveal delay={0.5}>
                        <div className="hero-stats">
                            <CountUpStat end={56} suffix="+" label="Career Paths" />
                            <CountUpStat end={6} suffix="" label="Degree Sectors" />
                            <CountUpStat end={100} suffix="+" label="Live Opportunities" />
                            <CountUpStat end={100} suffix="%" label="India Focused" />
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* ══════ OPPORTUNITIES SHOWCASE SECTION ══════ */}
            <section className="section" style={{ background: 'var(--bg-glass)' }}>
                <div className="container">
                    <ScrollReveal>
                        <div className="section-header">
                            <div className="section-tag">Newly Added</div>
                            <h2 className="section-title">Explore Live <span className="gradient-text">Opportunities</span></h2>
                            <p className="section-subtitle">Verified Jobs, Internships, and Walk-in Interview drives tailored for Freshers and Experienced candidates</p>
                        </div>
                    </ScrollReveal>
                    <div className="categories-grid">
                        {[
                            { id: 'jobs', name: '💼 Jobs Board', desc: 'Full-time job openings categorized for Freshers (0-1 yrs) and Experienced professionals.', count: 'Browse Jobs →', color: '#10b981', route: '/jobs' },
                            { id: 'internships', name: '🎓 Internships', desc: 'Gain real-world industry experience with curated internships across tech, business & design.', count: 'Browse Internships →', color: '#6366f1', route: '/internships' },
                            { id: 'walkins', name: '📍 Walk-in Drives', desc: 'Direct walk-in interview schedules with dates, venue details, and application links.', count: 'Browse Walk-ins →', color: '#f59e0b', route: '/walkins' },
                        ].map((opp, idx) => (
                            <ScrollReveal key={opp.id} delay={idx * 0.1} yOffset={25}>
                                <SpotlightCard className="category-card" onClick={() => navigate(opp.route)} spotlightColor={opp.color}>
                                    <div className="category-name" style={{ fontSize: '1.3rem' }}>{opp.name}</div>
                                    <div className="category-desc" style={{ marginTop: '0.5rem', marginBottom: '1.25rem' }}>{opp.desc}</div>
                                    <div className="category-count" style={{ color: opp.color, fontWeight: 700 }}>{opp.count}</div>
                                </SpotlightCard>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <ScrollReveal>
                        <div className="section-header">
                            <div className="section-tag">Career Categories</div>
                            <h2 className="section-title">Four Paths. <span className="gradient-text">Infinite Possibilities.</span></h2>
                            <p className="section-subtitle">Every career fits into one of these categories — across all degrees and fields. Choose your direction.</p>
                        </div>
                    </ScrollReveal>
                    <div className="categories-grid">
                        {[
                            { id: 'private', name: 'Private Sector Jobs', desc: 'IT, Analytics, Finance, Design & Product roles across top companies', count: '50+ careers', color: '#6366f1' },
                            { id: 'higher-studies', name: 'Higher Studies', desc: 'MBA, M.Tech, MS Abroad, PhD, LLB & professional certifications', count: '15+ paths', color: '#8b5cf6' },
                            { id: 'government', name: 'Government Jobs', desc: 'PSU, SSC, UPSC, Banking PO, RBI, ISRO for all degree backgrounds', count: '20+ exams', color: '#059669' },
                            { id: 'entrepreneurship', name: 'Entrepreneurship', desc: "Launch startups, freelance agencies, or creative ventures using your skills", count: 'Unlimited potential', color: '#f59e0b' },
                        ].map((cat, idx) => (
                            <ScrollReveal key={cat.id} delay={idx * 0.1} yOffset={25}>
                                <SpotlightCard className="category-card" onClick={() => navigate(`/careers?category=${cat.id}`)} spotlightColor={cat.color}>
                                    <div className="category-name">{cat.name}</div>
                                    <div className="category-desc">{cat.desc}</div>
                                    <div className="category-count" style={{ color: cat.color }}>→ {cat.count}</div>
                                </SpotlightCard>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════ HOW IT WORKS ══════ */}
            <section className="section" style={{ background: 'var(--bg-glass)' }}>
                <div className="container">
                    <ScrollReveal>
                        <div className="section-header">
                            <div className="section-tag">How It Works</div>
                            <h2 className="section-title">Career Clarity in <span className="gradient-text">4 Simple Steps</span></h2>
                        </div>
                    </ScrollReveal>
                    <div className="categories-grid">
                        {[
                            { step: '01', icon: '', title: 'Take the Quiz', desc: '7 personalized questions about your branch, interests & preferences' },
                            { step: '02', icon: '', title: 'Get Recommendations', desc: 'Our scoring engine finds your top 3 career matches with match %' },
                            { step: '03', icon: '', title: 'Explore Opportunities', desc: 'Apply to Jobs, Internships & Walk-ins matched for Freshers and Experienced' },
                            { step: '04', icon: '', title: 'Follow the Roadmap', desc: 'Month-by-month preparation plan with skills, tools & projects' },
                        ].map((item, idx) => (
                            <ScrollReveal key={item.step} delay={idx * 0.1} yOffset={25}>
                                <SpotlightCard className="category-card" style={{ textAlign: 'center' }} spotlightColor="rgba(99, 102, 241, 0.15)">
                                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-light)', marginBottom: '1.5rem', letterSpacing: '2px', fontFamily: 'var(--font-heading)' }}>STEP {item.step}</div>
                                    <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>{item.icon}</div>
                                    <div className="category-name">{item.title}</div>
                                    <div className="category-desc">{item.desc}</div>
                                </SpotlightCard>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════ TRENDING CAREERS ══════ */}
            <section className="section" style={{ background: 'var(--gradient-hero)' }}>
                <div className="container">
                    <ScrollReveal>
                        <div className="section-header">
                            <div className="section-tag">Trending Now</div>
                            <h2 className="section-title">Most Popular <span className="gradient-text">Career Choices</span></h2>
                            <p className="section-subtitle">What students across India are choosing in 2024</p>
                        </div>
                    </ScrollReveal>
                    <ScrollReveal delay={0.2} yOffset={20}>
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
                                    {item.emoji && <div className="category-icon" style={{ fontSize: '2.5rem' }}>{item.emoji}</div>}
                                    <div className="category-name" style={{ fontSize: '1.25rem' }}>{item.name}</div>
                                    <div className="category-count" style={{ color: item.color, fontSize: '1.1rem' }}>{item.salary}</div>
                                </SpotlightCard>
                            ))}
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* ══════ ABOUT SECTION ══════ */}
            <section className="section about-section" id="about">
                <div className="container">
                    {/* Header */}
                    <ScrollReveal>
                        <div className="section-header">
                            <div className="section-tag">About way2fresher</div>
                            <h2 className="section-title">
                                Empowering <span className="gradient-text">The Next Generation</span>
                            </h2>
                            <p className="section-subtitle">
                                We are more than a career site. We are a structured decision-making and opportunity discovery engine built for every Indian student — across Engineering, Commerce, Arts, Sciences, Management, and Computer Applications.
                            </p>
                        </div>
                    </ScrollReveal>

                    {/* Mission + Visual */}
                    <div className="about-grid">
                        <ScrollReveal delay={0.1}>
                            <div className="about-story">
                                <div className="about-story-tag">Our Platform</div>
                                <h3 className="about-story-title">How It Helps You</h3>
                                <div className="about-story-text">
                                    <p><strong>Personalized Career Quiz:</strong> Stop following the crowd. Our intelligent quiz analyzes your degree sector, specialization, risk appetite, and personal interests to suggest the top 3 career paths where you are most likely to succeed.</p>
                                    <p><strong>Opportunities Hub:</strong> Access live Jobs, Internships, and Walk-in Interviews verified and posted for Freshers (0-1 yrs) and Experienced graduates.</p>
                                    <p><strong>Detailed Career Database:</strong> Dive into 50+ mapped careers. Each page covers salary ranges (fresher to senior), future demand, stability, and typical work-life balance — all tailored to the Indian market.</p>
                                    <p><strong>Master Roadmaps:</strong> Once you decide, we don't leave you hanging. Follow month-by-month skill-building plans, discover the best certifications, and find exactly what projects you need to build to get hired.</p>
                                </div>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal delay={0.2}>
                            <div className="about-story">
                                <div className="about-story-tag">Freshers First</div>
                                <h3 className="about-story-title">Why Use way2fresher?</h3>
                                <div className="about-story-text">
                                    <p>For freshers, the transition from college to the workplace is often a "black box." way2fresher turns that box transparent. We provide the <strong>structure</strong> that is missing in university curriculum and the <strong>transparency</strong> that is missing in job portals.</p>
                                    <p>By using data-backed insights on PSU exams (GATE/IES), higher studies (CAT/GRE/MS), and real-time job & internship listings, we save you months of trial-and-error. Our mission is to ensure no fresher starts their career with regret.</p>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>

                    {/* Stats grid */}
                    <div className="about-stats-grid">
                        {ABOUT_STATS.map((s, idx) => (
                            <ScrollReveal key={s.label} delay={idx * 0.08} yOffset={20}>
                                <div className="about-stat-card">
                                    <div className="about-stat-icon">{s.icon}</div>
                                    <div className="about-stat-value">{s.value}</div>
                                    <div className="about-stat-label">{s.label}</div>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>

                    {/* Values */}
                    <div style={{ marginTop: '8rem' }}>
                        <ScrollReveal>
                            <div className="section-header" style={{ marginBottom: '4rem' }}>
                                <div className="section-tag">Our Values</div>
                                <h3 className="section-title">
                                    Why Students <span className="gradient-text">Trust Us</span>
                                </h3>
                            </div>
                        </ScrollReveal>
                        <div className="values-grid">
                            {VALUES.map((v, idx) => (
                                <ScrollReveal key={v.title} delay={idx * 0.08} yOffset={20}>
                                    <div className="value-card">
                                        <Tooltip text={v.desc} position="top">
                                            <div className="value-icon" style={{ cursor: 'help' }}>{v.icon}</div>
                                        </Tooltip>
                                        <div className="value-title">{v.title}</div>
                                        <div className="value-desc">{v.desc}</div>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════ CTA ══════ */}
            <section className="section" style={{ paddingBottom: '10rem' }}>
                <div className="container">
                    <ScrollReveal>
                        <div className="cta-glass-card">
                            <div className="cta-glow" />
                            <div className="section-tag" style={{ marginBottom: '2rem' }}>Ready to Decide?</div>
                            <h2 className="hero-title" style={{ marginBottom: '1.5rem', fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
                                Your Career Clarity Starts with <span className="gradient-text">a Few Questions</span>
                            </h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '3.5rem', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 3.5rem' }}>
                                Takes only 3 minutes. Join thousands of students across all disciplines making data-backed career decisions and finding top job opportunities.
                            </p>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                                <button className="btn-primary" onClick={() => navigate('/quiz')} style={{ fontSize: '1.1rem', padding: '16px 36px' }}>
                                    Start Your Career Quiz Now
                                </button>
                                <button className="btn-secondary" onClick={() => navigate('/jobs')} style={{ fontSize: '1.1rem', padding: '16px 36px' }}>
                                    💼 View Jobs & Internships
                                </button>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {showQuizModal && (
                <div className="quiz-popup-message-container">
                    <div className="quiz-popup-message-header">
                        <div className="quiz-popup-message-info">
                            <span className="quiz-popup-message-icon"></span>
                            <h4 className="quiz-popup-message-title">Career Decision Quiz</h4>
                        </div>
                        <button className="quiz-popup-message-close" onClick={handleCloseModal} aria-label="Close message">✕</button>
                    </div>
                    <p className="quiz-popup-message-text">
                        Not sure what direction to take after graduation? Take our 3-minute Career Quiz to find your best path — tailored to your degree!
                    </p>
                    <div className="quiz-popup-message-actions">
                        <button className="quiz-popup-message-btn-start" onClick={handleStartQuiz}>
                            Start Quiz
                        </button>
                        <button className="quiz-popup-message-btn-later" onClick={handleCloseModal}>
                            Maybe Later
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
