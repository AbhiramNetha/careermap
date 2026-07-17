import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import BranchSelectionPage from './BranchSelectionPage';
import BranchDetailPage from './BranchDetailPage';
import ComparePage from './ComparePage';
import ResumeBuilder from './ResumeBuilder';
import AtsCheckerPage from './AtsCheckerPage';
import {
  Crown, Network, GitCompare, FileText, BarChart3,
  DollarSign, Newspaper, Mic, Lock, Sparkles,
  CheckCircle2, ChevronRight, ArrowLeft,
} from 'lucide-react';

/* ── Section definitions ── */
const SECTIONS = [
  {
    id: 'branches', label: 'Branch Guide', icon: Network,
    color: '#6366f1', glow: 'rgba(99,102,241,0.12)',
    desc: 'Explore career paths, salary ranges, top recruiters & growth forecasts by degree sector and specialization.',
    highlights: ['Branch-wise career breakdown', 'Top company recruiters', 'Salary benchmarks', 'Growth trajectory charts'],
    comingSoon: false,
  },
  {
    id: 'compare', label: 'Career Compare', icon: GitCompare,
    color: '#10b981', glow: 'rgba(16,185,129,0.12)',
    desc: 'Side-by-side comparison of up to 3 careers on salary, demand, skills, and growth outlook.',
    highlights: ['Compare up to 3 careers', 'Skill gap analysis', 'Market demand score', 'Work-life balance index'],
    comingSoon: false,
  },
  {
    id: 'resume', label: 'Resume Builder', icon: FileText,
    color: '#3b82f6', glow: 'rgba(59,130,246,0.12)',
    desc: 'Build an ATS-ready resume in minutes with guided steps, premium templates and PDF export.',
    highlights: ['ATS-optimised templates', 'AI content suggestions', 'PDF export', 'Real-time preview'],
    comingSoon: false,
  },
  {
    id: 'ats', label: 'ATS Checker', icon: BarChart3,
    color: '#f59e0b', glow: 'rgba(245,158,11,0.12)',
    desc: 'Instantly score your resume for ATS compatibility and get actionable feedback to fix issues.',
    highlights: ['Instant ATS score (0–100)', 'Keyword gap detection', 'Section analysis', 'Formatting feedback'],
    comingSoon: false,
  },
  {
    id: 'salary', label: 'Salary Guide', icon: DollarSign,
    color: '#8b5cf6', glow: 'rgba(139,92,246,0.12)',
    desc: 'Real-time salary intelligence by role, city and company tier. Negotiate with confidence.',
    highlights: ['City-wise salary data', 'Experience band filters', 'Company-tier insights', 'Negotiation benchmarks'],
    comingSoon: true,
  },
  {
    id: 'blogs', label: 'Career Blogs', icon: Newspaper,
    color: '#ec4899', glow: 'rgba(236,72,153,0.12)',
    desc: 'Expert articles, interview experiences and career tips curated for freshers every week.',
    highlights: ['Expert articles weekly', 'Interview experiences', 'Industry trend reports', 'Career growth tips'],
    comingSoon: true,
  },
  {
    id: 'mock', label: 'Mock Interview', icon: Mic,
    color: '#14b8a6', glow: 'rgba(20,184,166,0.12)',
    desc: 'AI-powered mock interview practice with real-time feedback and company-specific question sets.',
    highlights: ['AI-driven questions', 'Real-time feedback', 'Company-specific rounds', 'Performance analytics'],
    comingSoon: true,
  },
];

/* ── Section lock card ── */
function SectionLock({ onUpgrade, isLoggedIn }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '3.5rem 1rem' }}>
      <div style={{
        maxWidth: '400px', width: '100%', background: 'var(--bg-card)',
        border: '1px solid rgba(251,191,36,0.25)', borderRadius: '16px',
        padding: '2rem', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
      }}>
        <div style={{
          width: '54px', height: '54px', borderRadius: '50%',
          background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem',
        }}>
          <Lock size={22} color="#fbbf24" />
        </div>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          {isLoggedIn ? 'Upgrade to PRO' : 'Login Required'}
        </h3>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '1.5rem' }}>
          {isLoggedIn
            ? 'This is a PRO feature. Upgrade your account to unlock it instantly.'
            : 'Log in and upgrade to Way2Fresher PRO to access this feature.'}
        </p>
        <button
          onClick={onUpgrade}
          style={{
            width: '100%', background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
            color: '#111827', fontWeight: 700, fontSize: '0.875rem',
            padding: '0.75rem', borderRadius: '10px', border: 'none', cursor: 'pointer',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          {isLoggedIn ? '⚡ Upgrade to PRO' : '→ Log In to Upgrade'}
        </button>
      </div>
    </div>
  );
}

/* ── Coming soon block ── */
function ComingSoonBlock({ label }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3.5rem 1rem', textAlign: 'center' }}>
      <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🚀</div>
      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
        {label} — Coming Soon
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '360px', lineHeight: 1.7 }}>
        We're building this feature. Stay tuned!
      </p>
    </div>
  );
}

/* ══════════════════════════════════════════
   Main PremiumPage
   ══════════════════════════════════════════ */
export default function PremiumPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { isPremium, togglePremium } = useApp();

  /* 'cards' = overview  |  'sections' = stacked all-sections view */
  const [view, setView]               = useState('cards');
  const [scrollTarget, setScrollTarget] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [activeNav, setActiveNav]     = useState(SECTIONS[0].id);

  const isUnlocked = !!(currentUser && isPremium);

  const handleUpgrade = () => {
    if (!currentUser) navigate('/login');
    else togglePremium();
  };

  /* Click a card → only enter stacked view if PRO; otherwise trigger upgrade flow */
  const handleCardClick = (sectionId) => {
    if (!isUnlocked) {
      handleUpgrade();
      return;
    }
    setScrollTarget(sectionId);
    setView('sections');
  };

  /* After the stacked view renders, scroll to the target section */
  useEffect(() => {
    if (view === 'sections' && scrollTarget) {
      const timer = setTimeout(() => {
        const el = document.getElementById(`prem-${scrollTarget}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80); // small delay for DOM to paint
      return () => clearTimeout(timer);
    }
  }, [view, scrollTarget]);

  /* IntersectionObserver — highlight active section in sticky nav */
  useEffect(() => {
    if (view !== 'sections') return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveNav(e.target.id.replace('prem-', ''));
        });
      },
      { rootMargin: '-10% 0px -75% 0px' }
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(`prem-${id}`);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [view]);

  /* Render each section's content */
  const renderContent = (section) => {
    if (section.comingSoon) return <ComingSoonBlock label={section.label} />;
    if (!isUnlocked) return <SectionLock onUpgrade={handleUpgrade} isLoggedIn={!!currentUser} />;
    switch (section.id) {
      case 'branches':
        return selectedBranch
          ? <BranchDetailPage branchId={selectedBranch} onBack={() => setSelectedBranch(null)} />
          : <BranchSelectionPage onSelect={setSelectedBranch} />;
      case 'compare': return <ComparePage />;
      case 'resume':  return <ResumeBuilder />;
      case 'ats':     return <AtsCheckerPage />;
      default:        return null;
    }
  };

  /* ════════════════════════════════════════════════════
     VIEW B — STACKED ALL-SECTIONS (after card is clicked)
     ════════════════════════════════════════════════════ */
  if (view === 'sections') {
    return (
      <div>
        {/* Sticky nav bar */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 50,
          background: 'var(--sidebar-bg)', borderBottom: '1px solid var(--border)',
          backdropFilter: 'blur(16px)',
          display: 'flex', alignItems: 'center', gap: '0',
          padding: '0 0.5rem',
          overflowX: 'auto', scrollbarWidth: 'none',
        }}>
          {/* Back to overview */}
          <button
            onClick={() => { setView('cards'); window.scrollTo({ top: 0 }); }}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.3rem',
              padding: '0.65rem 0.9rem', border: 'none', background: 'transparent',
              cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600,
              color: 'var(--text-secondary)', whiteSpace: 'nowrap', flexShrink: 0,
              borderBottom: '2px solid transparent', transition: 'color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            <ArrowLeft size={13} /> Overview
          </button>

          {/* Divider */}
          <span style={{ color: 'var(--border)', padding: '0 0.25rem', flexShrink: 0, fontSize: '1rem' }}>|</span>

          {/* Section links */}
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            const isActive = activeNav === s.id;
            return (
              <button
                key={s.id}
                onClick={() => {
                  setScrollTarget(s.id);
                  const el = document.getElementById(`prem-${s.id}`);
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.35rem',
                  padding: '0.65rem 0.85rem',
                  border: 'none', background: 'transparent', cursor: 'pointer',
                  fontSize: '0.78rem', fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#fbbf24' : 'var(--text-secondary)',
                  borderBottom: isActive ? '2px solid #fbbf24' : '2px solid transparent',
                  whiteSpace: 'nowrap', flexShrink: 0, transition: 'all 0.15s',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = 'var(--text-secondary)'; }}
              >
                <Icon size={13} />
                {s.label}
              </button>
            );
          })}
        </div>

        {/* All sections stacked */}
        {SECTIONS.map((section) => {
          const Icon = section.icon;
          return (
            <section
              key={section.id}
              id={`prem-${section.id}`}
              style={{ borderTop: '1px solid var(--border)' }}
            >
              {/* Section header band */}
              <div style={{
                background: `linear-gradient(90deg, ${section.glow}, transparent 80%)`,
                padding: '1.25rem 1.5rem 0.85rem',
                display: 'flex', alignItems: 'center', gap: '0.8rem',
              }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  background: section.glow, border: `1px solid ${section.color}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Icon size={19} color={section.color} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                      {section.label}
                    </h2>
                    {section.comingSoon && (
                      <span style={{ fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', background: 'rgba(148,163,184,0.12)', border: '1px solid rgba(148,163,184,0.2)', padding: '2px 8px', borderRadius: '99px' }}>
                        Coming Soon
                      </span>
                    )}
                    {!section.comingSoon && !isUnlocked && (
                      <span style={{ fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', color: '#fbbf24', background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.25)', padding: '2px 8px', borderRadius: '99px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        <Lock size={9} /> PRO
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0' }}>
                    {section.desc}
                  </p>
                </div>
              </div>

              {/* Section content */}
              {renderContent(section)}
            </section>
          );
        })}
      </div>
    );
  }

  /* ════════════════════════════════════════
     VIEW A — CARDS OVERVIEW (default)
     ════════════════════════════════════════ */
  return (
    <div style={{ padding: '2.5rem 1.5rem 4rem', maxWidth: '1200px', margin: '0 auto' }}>

      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
          background: 'linear-gradient(135deg, rgba(251,191,36,0.15), rgba(245,158,11,0.1))',
          border: '1px solid rgba(251,191,36,0.35)', borderRadius: '99px',
          padding: '0.35rem 1rem', marginBottom: '1.1rem',
        }}>
          <Crown size={14} color="#fbbf24" />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fbbf24', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            Way2Fresher PRO
          </span>
        </div>

        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: '0.9rem' }}>
          Everything you need to{' '}
          <span style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b 55%, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            land your dream job
          </span>
        </h1>

        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 1.75rem', lineHeight: 1.7 }}>
          Select any feature card below to get started.
        </p>

        {!isUnlocked ? (
          <button
            onClick={handleUpgrade}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
              background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
              color: '#111827', fontWeight: 800, fontSize: '0.9rem',
              padding: '0.8rem 1.75rem', borderRadius: '12px', border: 'none',
              cursor: 'pointer', boxShadow: '0 6px 24px rgba(245,158,11,0.35)',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Sparkles size={17} />
            {!currentUser ? 'Log In to Unlock PRO' : 'Upgrade to PRO'}
          </button>
        ) : (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: '12px', padding: '0.7rem 1.4rem',
            color: '#10b981', fontWeight: 700, fontSize: '0.88rem',
          }}>
            <CheckCircle2 size={17} /> PRO Active — select a feature to get started
          </div>
        )}
      </div>

      {/* Feature Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px, 100%), 1fr))', gap: '1.25rem' }}>
        {SECTIONS.map((s) => {
          const Icon = s.icon;
          const isCardInteractive = !s.comingSoon;
          return (
            <div
              key={s.id}
              onClick={isCardInteractive ? () => handleCardClick(s.id) : undefined}
              style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: '16px', padding: '1.6rem',
                cursor: isCardInteractive ? 'pointer' : 'default',
                position: 'relative', overflow: 'hidden',
                transition: 'transform 0.22s, box-shadow 0.22s, border-color 0.22s',
                opacity: isCardInteractive ? 1 : 0.75,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
              onMouseEnter={e => {
                if (isCardInteractive) {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = `0 10px 30px ${s.glow}`;
                  e.currentTarget.style.borderColor = s.color + '55';
                }
              }}
              onMouseLeave={e => {
                if (isCardInteractive) {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.boxShadow = '';
                  e.currentTarget.style.borderColor = '';
                }
              }}
            >
              <div>
                {/* Glow blob */}
                <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '110px', height: '110px', background: s.glow, borderRadius: '50%', filter: 'blur(28px)', pointerEvents: 'none' }} />

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: s.glow, border: `1px solid ${s.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={22} color={s.color} />
                  </div>
                  <div>
                    {s.comingSoon ? (
                      <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', background: 'rgba(148,163,184,0.12)', border: '1px solid rgba(148,163,184,0.2)', padding: '2px 8px', borderRadius: '99px', textTransform: 'uppercase' }}>Soon</span>
                    ) : !isUnlocked ? (
                      <span style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Lock size={13} color="#fbbf24" />
                      </span>
                    ) : (
                      <span style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ChevronRight size={14} color="#10b981" />
                      </span>
                    )}
                  </div>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.45rem' }}>{s.label}</h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '1.1rem' }}>{s.desc}</p>

                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1.5rem' }}>
                  {s.highlights.map(h => (
                    <li key={h} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                {s.comingSoon ? (
                  <button
                    disabled
                    style={{
                      width: '100%',
                      padding: '0.65rem 1rem',
                      borderRadius: '10px',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      background: 'rgba(255, 255, 255, 0.02)',
                      color: 'var(--text-muted)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    Coming Soon
                  </button>
                ) : isUnlocked ? (
                  <button
                    style={{
                      width: '100%',
                      padding: '0.65rem 1rem',
                      borderRadius: '10px',
                      border: `1px solid ${s.color}35`,
                      background: `${s.color}15`,
                      color: s.color,
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = `${s.color}25`;
                      e.currentTarget.style.borderColor = s.color;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = `${s.color}15`;
                      e.currentTarget.style.borderColor = `${s.color}35`;
                    }}
                  >
                    <span>Open Feature</span>
                    <ChevronRight size={14} />
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpgrade();
                    }}
                    style={{
                      width: '100%',
                      padding: '0.65rem 1rem',
                      borderRadius: '10px',
                      border: '1px solid rgba(251, 191, 36, 0.25)',
                      background: 'rgba(251, 191, 36, 0.08)',
                      color: '#fbbf24',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(251, 191, 36, 0.15)';
                      e.currentTarget.style.borderColor = '#fbbf24';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(251, 191, 36, 0.08)';
                      e.currentTarget.style.borderColor = 'rgba(251, 191, 36, 0.25)';
                    }}
                  >
                    <span>Unlock with PRO</span>
                    <Sparkles size={13} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
