import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchQuizQuestions, submitQuizAnswers } from '../services/api';
import { useApp } from '../context/AppContext';

export default function QuizPage() {
    const navigate = useNavigate();
    const { updateQuizAnswer, setQuizResults, setQuizAnswers } = useApp();

    const [questions, setQuestions] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [localAnswers, setLocalAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [showLoginToast, setShowLoginToast] = useState(false);

    useEffect(() => {
        const flag = sessionStorage.getItem('justLoggedInForQuiz');
        if (flag === 'true') {
            setShowLoginToast(true);
            sessionStorage.removeItem('justLoggedInForQuiz');
            const timer = setTimeout(() => setShowLoginToast(false), 4000);
            return () => clearTimeout(timer);
        }
    }, []);

    useEffect(() => {
        fetchQuizQuestions()
            .then(res => {
                const data = res.data.data;
                if (data && data.length > 0) {
                    setQuestions(data);
                } else {
                    setQuestions(FALLBACK_QUESTIONS);
                }
            })
            .catch(() => {
                setQuestions(FALLBACK_QUESTIONS);
            })
            .finally(() => setLoading(false));
    }, []);

    // Filter questions dynamically based on the selected degree
    const activeQuestions = questions.filter(q => {
        if (q.field === 'degree') return true;
        const selectedDegree = localAnswers['degree'];
        if (!selectedDegree) return false;
        
        if (selectedDegree === 'Engineering' && q.field.startsWith('eng_')) return true;
        if (selectedDegree === 'ComputerApplications' && q.field.startsWith('ca_')) return true;
        if (selectedDegree === 'Management' && q.field.startsWith('mgt_')) return true;
        if (selectedDegree === 'Commerce' && q.field.startsWith('com_')) return true;
        if (selectedDegree === 'Sciences' && q.field.startsWith('sci_')) return true;
        if (selectedDegree === 'Arts' && q.field.startsWith('art_')) return true;
        return false;
    });

    const currentQuestion = activeQuestions[currentStep];
    const progress = activeQuestions.length > 0 ? ((currentStep + 1) / activeQuestions.length) * 100 : 0;
    const selectedValue = currentQuestion ? localAnswers[currentQuestion.field] : null;

    function handleSelect(value) {
        const field = currentQuestion.field;
        if (field === 'degree') {
            // When changing degree selection, clear other answers to prevent stale data
            setLocalAnswers({ degree: value });
            setQuizAnswers({ degree: value });
        } else {
            setLocalAnswers(prev => ({ ...prev, [field]: value }));
            updateQuizAnswer(field, value);
        }
    }

    async function handleNext() {
        if (!selectedValue) { setError('Please select an option to continue'); return; }
        setError('');
        if (currentStep < activeQuestions.length - 1) {
            setCurrentStep(s => s + 1);
        } else {
            await handleSubmit();
        }
    }

    function handleBack() {
        if (currentStep > 0) setCurrentStep(s => s - 1);
    }

    async function handleSubmit() {
        setSubmitting(true);
        try {
            const res = await submitQuizAnswers(localAnswers);
            setQuizResults(res.data);
            navigate('/quiz/results');
        } catch {
            const local = runLocalScoring(localAnswers);
            setQuizResults(local);
            navigate('/quiz/results');
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return (
            <div className="loader-container">
                <div className="loader" />
                <div className="loader-text">Loading quiz questions...</div>
            </div>
        );
    }

    if (submitting) {
        return (
            <div className="quiz-page">
                <div className="quiz-container" style={{ textAlign: 'center' }}>
                    <div className="processing-screen">
                        <div style={{ fontSize: '4rem' }}>🧠</div>
                        <h2 style={{ fontFamily: 'Poppins', fontSize: '1.8rem', fontWeight: 700 }}>
                            Analyzing Your Responses...
                        </h2>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            Our scoring engine is calculating your best career matches
                        </p>
                        <div className="processing-dots">
                            <span /><span /><span />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!currentQuestion) return null;

    const isLastStep = currentStep === activeQuestions.length - 1;

    return (
        <div className="quiz-page">
            {showLoginToast && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] bg-slate-900/90 text-white border border-emerald-500/30 px-6 py-3 rounded-full shadow-lg shadow-emerald-500/10 backdrop-blur-md flex items-center gap-2 animate-pulse pointer-events-auto">
                    <span className="text-emerald-400">🎉</span>
                    <span className="text-xs font-bold tracking-wide">Logged in successfully! Ready to start your Career Quiz.</span>
                </div>
            )}
            <div className="quiz-container">
                <div className="quiz-step-label">
                    Question {currentStep + 1} of {activeQuestions.length}
                </div>
                <div className="quiz-progress-bar">
                    <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
                </div>

                <div className="quiz-icon">{currentQuestion.icon}</div>
                <h2 className="quiz-question">{currentQuestion.question}</h2>
                {currentQuestion.subtitle && (
                    <p className="quiz-subtitle">{currentQuestion.subtitle}</p>
                )}

                <div className="quiz-options">
                    {currentQuestion.options?.map(opt => (
                        <button
                            key={opt.id}
                            className={`quiz-option ${selectedValue === opt.value ? 'selected' : ''}`}
                            onClick={() => handleSelect(opt.value)}
                        >
                            <div className="quiz-option-check">
                                {selectedValue === opt.value && '✓'}
                            </div>
                            {opt.label}
                        </button>
                    ))}
                </div>

                {error && (
                    <div style={{
                        marginTop: '1rem',
                        padding: '10px 16px',
                        background: 'rgba(239,68,68,0.1)',
                        border: '1px solid rgba(239,68,68,0.3)',
                        borderRadius: 'var(--radius-sm)',
                        color: '#f87171',
                        fontSize: '0.85rem',
                    }}>
                        ⚠️ {error}
                    </div>
                )}

                <div className="quiz-nav">
                    <button
                        className="btn-secondary"
                        onClick={handleBack}
                        disabled={currentStep === 0}
                        style={{ opacity: currentStep === 0 ? 0.3 : 1 }}
                    >
                        ← Back
                    </button>
                    <button
                        className="btn-primary"
                        onClick={handleNext}
                        style={{ minWidth: '140px' }}
                    >
                        {isLastStep ? '🎯 Get Results' : 'Next →'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// Local scoring candidates
const DEGREE_CANDIDATE_CAREERS = {
    'Engineering': [
        'software-developer',
        'psu-engineer',
        'mtech-iit-nit',
        'ms-abroad',
        'ssc-je',
        'saas-startup'
    ],
    'ComputerApplications': [
        'software-developer',
        'full-stack-developer',
        'data-scientist',
        'freelancer-remote-developer',
        'ms-computer-science',
        'gaming-ar-vr-startup'
    ],
    'Management': [
        'mba-iim-xlri',
        'product-manager',
        'technical-consultant',
        'rbi-grade-b',
        'pgdm',
        'edtech-startup'
    ],
    'Commerce': [
        'banking-po',
        'rbi-grade-b',
        'professional-certifications',
        'fintech-startup',
        'ssc-cgl-officer',
        'business-analyst'
    ],
    'Sciences': [
        'isro-scientist',
        'drdo-scientist',
        'phd-india',
        'phd-abroad',
        'government-lecturer',
        'ms-data-science-ai'
    ],
    'Arts': [
        'ias-ips-ifs-officer',
        'ui-ux-designer',
        'content-creator',
        'social-impact-tech',
        'llb-law',
        'freelance-agency'
    ]
};

const LOCAL_SCORING = {
    'software-developer': [
        { field: 'eng_branch', value: 'CSE', score: 20 },
        { field: 'eng_branch', value: 'ECE', score: 12 },
        { field: 'eng_interest', value: 'Coding', score: 30 },
        { field: 'eng_interest', value: 'Research', score: 10 },
        { field: 'eng_risk', value: 'Medium', score: 15 },
        { field: 'eng_risk', value: 'High', score: 10 },
        { field: 'eng_risk', value: 'Low', score: 5 },
        { field: 'eng_work', value: 'TechMNC', score: 25 },
        { field: 'eng_work', value: 'Startups', score: 15 },
    ],
    'psu-engineer': [
        { field: 'eng_branch', value: 'ECE', score: 10 },
        { field: 'eng_branch', value: 'EEE', score: 15 },
        { field: 'eng_branch', value: 'MECH', score: 15 },
        { field: 'eng_branch', value: 'CIVIL', score: 15 },
        { field: 'eng_interest', value: 'Core', score: 25 },
        { field: 'eng_interest', value: 'Civil', score: 20 },
        { field: 'eng_risk', value: 'Low', score: 30 },
        { field: 'eng_work', value: 'Govt', score: 25 },
    ],
    'mtech-iit-nit': [
        { field: 'eng_interest', value: 'Research', score: 30 },
        { field: 'eng_risk', value: 'Low', score: 20 },
        { field: 'eng_risk', value: 'Medium', score: 15 },
        { field: 'eng_work', value: 'ResearchLab', score: 30 },
        { field: 'eng_budget', value: 'Limited', score: 20 },
    ],
    'ms-abroad': [
        { field: 'eng_interest', value: 'Research', score: 25 },
        { field: 'eng_interest', value: 'Coding', score: 15 },
        { field: 'eng_risk', value: 'High', score: 20 },
        { field: 'eng_risk', value: 'Medium', score: 15 },
        { field: 'eng_work', value: 'ResearchLab', score: 20 },
        { field: 'eng_work', value: 'TechMNC', score: 15 },
        { field: 'eng_budget', value: 'Afford', score: 30 },
    ],
    'ssc-je': [
        { field: 'eng_branch', value: 'CIVIL', score: 25 },
        { field: 'eng_branch', value: 'MECH', score: 15 },
        { field: 'eng_branch', value: 'EEE', score: 15 },
        { field: 'eng_interest', value: 'Civil', score: 25 },
        { field: 'eng_interest', value: 'Core', score: 15 },
        { field: 'eng_risk', value: 'Low', score: 30 },
        { field: 'eng_work', value: 'Govt', score: 25 },
    ],
    'saas-startup': [
        { field: 'eng_interest', value: 'Coding', score: 20 },
        { field: 'eng_interest', value: 'Management', score: 15 },
        { field: 'eng_risk', value: 'High', score: 30 },
        { field: 'eng_risk', value: 'Medium', score: 15 },
        { field: 'eng_work', value: 'Startups', score: 30 },
    ],
    'full-stack-developer': [
        { field: 'ca_specialization', value: 'WebDev', score: 30 },
        { field: 'ca_coding', value: 'LoveCoding', score: 25 },
        { field: 'ca_coding', value: 'ModerateCoding', score: 20 },
        { field: 'ca_risk', value: 'High', score: 20 },
        { field: 'ca_risk', value: 'Medium', score: 15 },
        { field: 'ca_salary', value: 'Learning', score: 20 },
        { field: 'ca_study', value: 'No', score: 15 },
    ],
    'data-scientist': [
        { field: 'ca_specialization', value: 'DataAI', score: 35 },
        { field: 'ca_coding', value: 'LoveCoding', score: 20 },
        { field: 'ca_coding', value: 'ModerateCoding', score: 20 },
        { field: 'ca_risk', value: 'Medium', score: 25 },
        { field: 'ca_salary', value: 'MaxSalary', score: 20 },
        { field: 'ca_study', value: 'Yes', score: 15 },
    ],
    'freelancer-remote-developer': [
        { field: 'ca_specialization', value: 'WebDev', score: 20 },
        { field: 'ca_coding', value: 'LoveCoding', score: 25 },
        { field: 'ca_risk', value: 'High', score: 35 },
        { field: 'ca_salary', value: 'Learning', score: 20 },
        { field: 'ca_study', value: 'No', score: 15 },
    ],
    'ms-computer-science': [
        { field: 'ca_specialization', value: 'DataAI', score: 20 },
        { field: 'ca_specialization', value: 'WebDev', score: 15 },
        { field: 'ca_coding', value: 'LoveCoding', score: 25 },
        { field: 'ca_risk', value: 'Medium', score: 15 },
        { field: 'ca_risk', value: 'High', score: 15 },
        { field: 'ca_study', value: 'Yes', score: 35 },
    ],
    'gaming-ar-vr-startup': [
        { field: 'ca_specialization', value: 'WebDev', score: 20 },
        { field: 'ca_coding', value: 'LoveCoding', score: 25 },
        { field: 'ca_risk', value: 'High', score: 35 },
        { field: 'ca_salary', value: 'Learning', score: 20 },
        { field: 'ca_study', value: 'No', score: 15 },
    ],
    'mba-iim-xlri': [
        { field: 'mgt_strength', value: 'Leadership', score: 25 },
        { field: 'mgt_strength', value: 'DataStrategy', score: 20 },
        { field: 'mgt_company', value: 'CorporateMNC', score: 25 },
        { field: 'mgt_company', value: 'Consultancy', score: 25 },
        { field: 'mgt_budget', value: 'Yes', score: 30 },
    ],
    'product-manager': [
        { field: 'mgt_specialization', value: 'Strategy', score: 25 },
        { field: 'mgt_specialization', value: 'Marketing', score: 15 },
        { field: 'mgt_strength', value: 'ProblemSolving', score: 25 },
        { field: 'mgt_strength', value: 'Leadership', score: 20 },
        { field: 'mgt_risk', value: 'Medium', score: 25 },
        { field: 'mgt_risk', value: 'High', score: 15 },
        { field: 'mgt_company', value: 'CorporateMNC', score: 20 },
        { field: 'mgt_company', value: 'StartupsVC', score: 20 },
    ],
    'technical-consultant': [
        { field: 'mgt_specialization', value: 'Strategy', score: 25 },
        { field: 'mgt_specialization', value: 'Operations', score: 15 },
        { field: 'mgt_strength', value: 'Communication', score: 25 },
        { field: 'mgt_strength', value: 'ProblemSolving', score: 20 },
        { field: 'mgt_company', value: 'Consultancy', score: 30 },
        { field: 'mgt_company', value: 'CorporateMNC', score: 15 },
    ],
    'rbi-grade-b': [
        { field: 'mgt_specialization', value: 'Finance', score: 25 },
        { field: 'mgt_strength', value: 'DataStrategy', score: 25 },
        { field: 'mgt_risk', value: 'Low', score: 30 },
        { field: 'mgt_company', value: 'Government', score: 35 },
        { field: 'com_specialization', value: 'CorpFinance', score: 20 },
        { field: 'com_specialization', value: 'Banking', score: 20 },
        { field: 'com_risk', value: 'Stable', score: 25 },
        { field: 'com_company', value: 'PublicBanks', score: 25 },
        { field: 'com_study', value: 'Yes', score: 25 },
    ],
    'pgdm': [
        { field: 'mgt_strength', value: 'Leadership', score: 20 },
        { field: 'mgt_strength', value: 'Communication', score: 20 },
        { field: 'mgt_company', value: 'CorporateMNC', score: 25 },
        { field: 'mgt_budget', value: 'No', score: 25 },
    ],
    'edtech-startup': [
        { field: 'mgt_specialization', value: 'Marketing', score: 20 },
        { field: 'mgt_strength', value: 'Communication', score: 20 },
        { field: 'mgt_strength', value: 'Leadership', score: 20 },
        { field: 'mgt_risk', value: 'High', score: 35 },
        { field: 'mgt_company', value: 'StartupsVC', score: 35 },
    ],
    'banking-po': [
        { field: 'com_specialization', value: 'Banking', score: 30 },
        { field: 'com_risk', value: 'Stable', score: 25 },
        { field: 'com_company', value: 'PublicBanks', score: 35 },
        { field: 'com_study', value: 'No', score: 10 },
    ],
    'professional-certifications': [
        { field: 'com_professional', value: 'Yes', score: 35 },
        { field: 'com_study', value: 'Yes', score: 25 },
        { field: 'com_specialization', value: 'Accounting', score: 20 },
        { field: 'com_specialization', value: 'CorpFinance', score: 20 },
    ],
    'fintech-startup': [
        { field: 'com_specialization', value: 'Markets', score: 20 },
        { field: 'com_specialization', value: 'CorpFinance', score: 20 },
        { field: 'com_risk', value: 'Dynamic', score: 35 },
        { field: 'com_company', value: 'InvestmentBanks', score: 25 },
    ],
    'ssc-cgl-officer': [
        { field: 'com_specialization', value: 'Taxation', score: 25 },
        { field: 'com_specialization', value: 'Accounting', score: 20 },
        { field: 'com_risk', value: 'Stable', score: 30 },
        { field: 'com_study', value: 'No', score: 25 },
    ],
    'business-analyst': [
        { field: 'com_specialization', value: 'CorpFinance', score: 25 },
        { field: 'com_specialization', value: 'Accounting', score: 15 },
        { field: 'com_risk', value: 'Dynamic', score: 20 },
        { field: 'com_risk', value: 'Stable', score: 20 },
        { field: 'com_company', value: 'CorporateFin', score: 30 },
        { field: 'com_company', value: 'Big4', score: 25 },
    ],
    'isro-scientist': [
        { field: 'sci_domain', value: 'PCM', score: 25 },
        { field: 'sci_domain', value: 'CompSci', score: 20 },
        { field: 'sci_interest', value: 'GovtLabs', score: 35 },
        { field: 'sci_study', value: 'Yes', score: 20 },
        { field: 'sci_work', value: 'Lab', score: 25 },
    ],
    'drdo-scientist': [
        { field: 'sci_domain', value: 'CompSci', score: 25 },
        { field: 'sci_domain', value: 'PCM', score: 20 },
        { field: 'sci_interest', value: 'GovtLabs', score: 35 },
        { field: 'sci_study', value: 'Yes', score: 20 },
        { field: 'sci_work', value: 'Lab', score: 25 },
    ],
    'phd-india': [
        { field: 'sci_interest', value: 'ResearchTeaching', score: 30 },
        { field: 'sci_study', value: 'Yes', score: 35 },
        { field: 'sci_work', value: 'Lab', score: 20 },
        { field: 'sci_work', value: 'Classroom', score: 20 },
        { field: 'sci_budget', value: 'No', score: 20 },
    ],
    'phd-abroad': [
        { field: 'sci_interest', value: 'ResearchTeaching', score: 25 },
        { field: 'sci_interest', value: 'PrivateRD', score: 20 },
        { field: 'sci_study', value: 'Yes', score: 30 },
        { field: 'sci_budget', value: 'Yes', score: 35 },
    ],
    'government-lecturer': [
        { field: 'sci_interest', value: 'ResearchTeaching', score: 30 },
        { field: 'sci_study', value: 'Yes', score: 25 },
        { field: 'sci_work', value: 'Classroom', score: 35 },
    ],
    'ms-data-science-ai': [
        { field: 'sci_domain', value: 'CompSci', score: 35 },
        { field: 'sci_interest', value: 'AppliedAnalytics', score: 30 },
        { field: 'sci_interest', value: 'PrivateRD', score: 20 },
        { field: 'sci_study', value: 'Yes', score: 20 },
    ],
    'ias-ips-ifs-officer': [
        { field: 'art_domain', value: 'Economics', score: 15 },
        { field: 'art_domain', value: 'History', score: 15 },
        { field: 'art_interest', value: 'CivilServices', score: 35 },
        { field: 'art_risk', value: 'Stable', score: 30 },
        { field: 'art_study', value: 'Yes', score: 25 },
    ],
    'ui-ux-designer': [
        { field: 'art_domain', value: 'FineArts', score: 30 },
        { field: 'art_domain', value: 'Psychology', score: 25 },
        { field: 'art_interest', value: 'CreativeDesign', score: 35 },
        { field: 'art_risk', value: 'Corporate', score: 25 },
        { field: 'art_risk', value: 'Creative', score: 20 },
        { field: 'art_work', value: 'Flexible', score: 20 },
    ],
    'content-creator': [
        { field: 'art_domain', value: 'Literature', score: 25 },
        { field: 'art_domain', value: 'FineArts', score: 20 },
        { field: 'art_interest', value: 'Writing', score: 30 },
        { field: 'art_risk', value: 'Creative', score: 35 },
        { field: 'art_work', value: 'Flexible', score: 30 },
    ],
    'social-impact-tech': [
        { field: 'art_domain', value: 'Psychology', score: 25 },
        { field: 'art_interest', value: 'Counseling', score: 30 },
        { field: 'art_risk', value: 'Stable', score: 25 },
        { field: 'art_work', value: 'Flexible', score: 20 },
    ],
    'llb-law': [
        { field: 'art_domain', value: 'Economics', score: 25 },
        { field: 'art_domain', value: 'Literature', score: 15 },
        { field: 'art_interest', value: 'Academia', score: 20 },
        { field: 'art_work', value: 'Dynamic', score: 30 },
        { field: 'art_study', value: 'Yes', score: 20 },
    ],
    'freelance-agency': [
        { field: 'art_domain', value: 'FineArts', score: 20 },
        { field: 'art_domain', value: 'Literature', score: 20 },
        { field: 'art_interest', value: 'CreativeDesign', score: 25 },
        { field: 'art_interest', value: 'Writing', score: 25 },
        { field: 'art_risk', value: 'Creative', score: 30 },
        { field: 'art_risk', value: 'Corporate', score: 20 },
        { field: 'art_work', value: 'Flexible', score: 25 },
    ]
};

const LOCAL_CAREERS = {
    // Engineering
    'software-developer': { id: 'software-developer', slug: 'software-developer', title: 'Software Developer / SDE', category: 'Private Sector', salaryRange: '₹4–12 LPA', riskLevel: 'Medium', demandLevel: 'Very High', icon: '💻' },
    'psu-engineer': { id: 'psu-engineer', slug: 'psu-engineer', title: 'PSU Engineer (GATE)', category: 'Government', salaryRange: '₹7–15 LPA', riskLevel: 'Low', demandLevel: 'Very High', icon: '🏭' },
    'mtech-iit-nit': { id: 'mtech-iit-nit', slug: 'mtech-iit-nit', title: 'M.Tech (IITs / NITs)', category: 'Higher Studies', salaryRange: '₹10–25 LPA', riskLevel: 'Low', demandLevel: 'High', icon: '🏫' },
    'ms-abroad': { id: 'ms-abroad', slug: 'ms-abroad', title: 'MS Abroad (USA/Germany)', category: 'Higher Studies', salaryRange: '₹40–100 LPA', riskLevel: 'High', demandLevel: 'Very High', icon: '✈️' },
    'ssc-je': { id: 'ssc-je', slug: 'ssc-je', title: 'SSC JE (Junior Engineer)', category: 'Government', salaryRange: '₹4–7 LPA', riskLevel: 'Low', demandLevel: 'High', icon: '🔨' },
    'saas-startup': { id: 'saas-startup', slug: 'saas-startup', title: 'SaaS Startup', category: 'Entrepreneurship', salaryRange: 'Variable', riskLevel: 'High', demandLevel: 'High', icon: '☁️' },

    // CA
    'full-stack-developer': { id: 'full-stack-developer', slug: 'full-stack-developer', title: 'Full Stack Developer', category: 'Private Sector', salaryRange: '₹5–14 LPA', riskLevel: 'Medium', demandLevel: 'Very High', icon: '🌐' },
    'data-scientist': { id: 'data-scientist', slug: 'data-scientist', title: 'Data Scientist / Analyst', category: 'Private Sector', salaryRange: '₹6–15 LPA', riskLevel: 'Medium', demandLevel: 'High', icon: '📊' },
    'freelancer-remote-developer': { id: 'freelancer-remote-developer', slug: 'freelancer-remote-developer', title: 'Freelancer / Remote Developer', category: 'Private Sector', salaryRange: '₹3–30 LPA', riskLevel: 'High', demandLevel: 'High', icon: '🧑‍💻' },
    'ms-computer-science': { id: 'ms-computer-science', slug: 'ms-computer-science', title: 'MS in Computer Science', category: 'Higher Studies', salaryRange: '₹40–100 LPA', riskLevel: 'High', demandLevel: 'Very High', icon: '🖥️' },
    'gaming-ar-vr-startup': { id: 'gaming-ar-vr-startup', slug: 'gaming-ar-vr-startup', title: 'Gaming / AR / VR Startup', category: 'Entrepreneurship', salaryRange: 'Variable', riskLevel: 'High', demandLevel: 'Medium', icon: '🎮' },

    // Management
    'mba-iim-xlri': { id: 'mba-iim-xlri', slug: 'mba-iim-xlri', title: 'MBA (IIMs / XLRI)', category: 'Higher Studies', salaryRange: '₹15–50 LPA', riskLevel: 'High', demandLevel: 'Very High', icon: '💼' },
    'product-manager': { id: 'product-manager', slug: 'product-manager', title: 'Product Manager', category: 'Private Sector', salaryRange: '₹10–25 LPA', riskLevel: 'Medium', demandLevel: 'High', icon: '📋' },
    'technical-consultant': { id: 'technical-consultant', slug: 'technical-consultant', title: 'Technical Consultant', category: 'Private Sector', salaryRange: '₹6–15 LPA', riskLevel: 'Medium', demandLevel: 'Medium', icon: '🤝' },
    'rbi-grade-b': { id: 'rbi-grade-b', slug: 'rbi-grade-b', title: 'RBI Grade B Officer', category: 'Government', salaryRange: '₹18 LPA', riskLevel: 'Low', demandLevel: 'Medium', icon: '💰' },
    'pgdm': { id: 'pgdm', slug: 'pgdm', title: 'PGDM Management', category: 'Higher Studies', salaryRange: '₹8–20 LPA', riskLevel: 'Medium', demandLevel: 'Medium', icon: '🏢' },
    'edtech-startup': { id: 'edtech-startup', slug: 'edtech-startup', title: 'EdTech Startup', category: 'Entrepreneurship', salaryRange: 'Variable', riskLevel: 'Medium', demandLevel: 'High', icon: '📖' },

    // Commerce
    'banking-po': { id: 'banking-po', slug: 'banking-po', title: 'Banking PO / SO', category: 'Government', salaryRange: '₹6–10 LPA', riskLevel: 'Low', demandLevel: 'Very High', icon: '🏦' },
    'professional-certifications': { id: 'professional-certifications', slug: 'professional-certifications', title: 'Professional Certifications (CFA)', category: 'Higher Studies', salaryRange: '30-60% boost', riskLevel: 'Medium', demandLevel: 'Very High', icon: '📜' },
    'fintech-startup': { id: 'fintech-startup', slug: 'fintech-startup', title: 'FinTech Startup', category: 'Entrepreneurship', salaryRange: 'Variable', riskLevel: 'High', demandLevel: 'High', icon: '💳' },
    'ssc-cgl-officer': { id: 'ssc-cgl-officer', slug: 'ssc-cgl-officer', title: 'SSC CGL Officer', category: 'Government', salaryRange: '₹6–10 LPA', riskLevel: 'Low', demandLevel: 'Very High', icon: '📁' },
    'business-analyst': { id: 'business-analyst', slug: 'business-analyst', title: 'Business Analyst', category: 'Private Sector', salaryRange: '₹5–12 LPA', riskLevel: 'Medium', demandLevel: 'Medium', icon: '📈' },

    // Sciences
    'isro-scientist': { id: 'isro-scientist', slug: 'isro-scientist', title: 'ISRO Scientist / Engineer', category: 'Government', salaryRange: '₹8–14 LPA', riskLevel: 'Low', demandLevel: 'High', icon: '🚀' },
    'drdo-scientist': { id: 'drdo-scientist', slug: 'drdo-scientist', title: 'DRDO Scientist B', category: 'Government', salaryRange: '₹10-12 LPA', riskLevel: 'Low', demandLevel: 'High', icon: '🛡️' },
    'phd-india': { id: 'phd-india', slug: 'phd-india', title: 'PhD in India (IITs/IISc)', category: 'Higher Studies', salaryRange: '₹12–30 LPA', riskLevel: 'Medium', demandLevel: 'Medium', icon: '🔭' },
    'phd-abroad': { id: 'phd-abroad', slug: 'phd-abroad', title: 'PhD Abroad (USA/Europe)', category: 'Higher Studies', salaryRange: '₹50–100 LPA', riskLevel: 'Medium', demandLevel: 'Medium', icon: '🎓' },
    'government-lecturer': { id: 'government-lecturer', slug: 'government-lecturer', title: 'Government College Lecturer', category: 'Government', salaryRange: '₹6–12 LPA', riskLevel: 'Low', demandLevel: 'Medium', icon: '📚' },
    'ms-data-science-ai': { id: 'ms-data-science-ai', slug: 'ms-data-science-ai', title: 'MS in Data Science / AI', category: 'Higher Studies', salaryRange: '₹40–80 LPA', riskLevel: 'High', demandLevel: 'Very High', icon: '🧠' },

    // Arts
    'ias-ips-ifs-officer': { id: 'ias-ips-ifs-officer', slug: 'ias-ips-ifs-officer', title: 'IAS / IPS / IFS Officer', category: 'Government', salaryRange: '₹8–15 LPA', riskLevel: 'Low', demandLevel: 'High', icon: '🏛️' },
    'ui-ux-designer': { id: 'ui-ux-designer', slug: 'ui-ux-designer', title: 'UI / UX Designer', category: 'Private Sector', salaryRange: '₹4–12 LPA', riskLevel: 'Medium', demandLevel: 'Medium', icon: '🎨' },
    'content-creator': { id: 'content-creator', slug: 'content-creator', title: 'Content Creator / YouTuber', category: 'Entrepreneurship', salaryRange: 'Variable', riskLevel: 'Low', demandLevel: 'Medium', icon: '🎥' },
    'social-impact-tech': { id: 'social-impact-tech', slug: 'social-impact-tech', title: 'Social Impact Tech Venture', category: 'Entrepreneurship', salaryRange: '₹3–15 LPA', riskLevel: 'Low', demandLevel: 'Medium', icon: '🌱' },
    'llb-law': { id: 'llb-law', slug: 'llb-law', title: 'LLB / Patent Law', category: 'Higher Studies', salaryRange: '₹5–20 LPA', riskLevel: 'Medium', demandLevel: 'Medium', icon: '⚖️' },
    'freelance-agency': { id: 'freelance-agency', slug: 'freelance-agency', title: 'Creative Freelance Agency', category: 'Entrepreneurship', salaryRange: '₹5–50 LPA', riskLevel: 'Low', demandLevel: 'High', icon: '🏗️' }
};

function runLocalScoring(answers) {
    const degree = answers.degree || 'Engineering';
    const candidateIds = DEGREE_CANDIDATE_CAREERS[degree] || DEGREE_CANDIDATE_CAREERS['Engineering'];

    const results = candidateIds.map(careerId => {
        const rules = LOCAL_SCORING[careerId] || [];
        const score = rules.reduce((sum, r) => answers[r.field] === r.value ? sum + r.score : sum, 0);
        const positiveRulesSum = rules.filter(r => r.score > 0).reduce((s, r) => s + r.score, 0);
        const max = positiveRulesSum > 0 ? positiveRulesSum : 100;
        const matchPercentage = Math.min(100, Math.max(0, Math.round((score / max) * 100)));
        return { careerId, matchPercentage };
    }).sort((a, b) => b.matchPercentage - a.matchPercentage).slice(0, 3);

    const EXPLANATIONS = {
        'data-scientist': `With your analytical mindset and preferences, Data Science is a perfect match for your skills.`,
        'software-developer': `Your strong technical foundation and interest in software make Software Development a top choice.`,
        'full-stack-developer': `Your passion for web development and software engineering matches Full Stack Development perfectly.`,
        'freelancer-remote-developer': `Your love for coding and high risk tolerance make remote freelancing a great fit.`,
        'ms-computer-science': `Your academic drive and interest in computer science align well with an MS in CS.`,
        'gaming-ar-vr-startup': `Your interest in creative tech and high risk appetite make game development a compelling choice.`,
        'mba-iim-xlri': `Your strong alignment with business strategy and leadership makes a top MBA your best path.`,
        'product-manager': `Your problem-solving skills and strategic mindset fit Product Management perfectly.`,
        'technical-consultant': `Your communication skills and interest in consulting make this technical consulting role ideal.`,
        'rbi-grade-b': `Your preference for stability and business/finance interests suit RBI Grade B Officer perfectly.`,
        'pgdm': `Your interest in business and corporate management aligns with a Post Graduate Diploma.`,
        'edtech-startup': `Your entrepreneurial mindset and passion for education make EdTech startups a great choice.`,
        'banking-po': `Your preference for stability and interest in banking make Banking PO an excellent career choice.`,
        'professional-certifications': `Pursuing professional finance certifications (like CFA) fits your career aspirations.`,
        'fintech-startup': `Your interest in financial markets and high risk appetite match FinTech startups perfectly.`,
        'ssc-cgl-officer': `Your preference for public service and stable career growth aligns with SSC CGL.`,
        'business-analyst': `Your data analysis and corporate finance interests fit Business Analyst perfectly.`,
        'isro-scientist': `Your science background and interest in space research make ISRO Scientist a dream match.`,
        'drdo-scientist': `Your technical skills and desire to work in national defence research fit DRDO perfectly.`,
        'phd-india': `Your passion for academic research and teaching matches a PhD program in India.`,
        'phd-abroad': `Your desire for global research exposure matches a PhD abroad.`,
        'government-lecturer': `Your passion for classroom teaching and academia aligns with a Government Lecturer role.`,
        'ms-data-science-ai': `Your interests in analytics and AI make an MS in Data Science/AI a strong match.`,
        'ias-ips-ifs-officer': `Your dream of civil services and public leadership aligns with IAS/IPS/IFS.`,
        'ui-ux-designer': `Your creative design skills and psychology interests fit UI/UX Design perfectly.`,
        'content-creator': `Your writing, design, and creative skills make content creation/YouTubing a very strong match.`,
        'social-impact-tech': `Your desire to solve social problems using technology aligns with a Tech NGO venture.`,
        'llb-law': `Your analytical background and interest in regulation/legal systems make patent or tech law a unique fit.`,
        'freelance-agency': `Your creative skills and entrepreneurial drive fit running a freelance agency perfectly.`,
        'psu-engineer': `Your technical engineering skills and search for job security align with a PSU career.`,
        'mtech-iit-nit': `Your desire for deeper technical research aligns with M.Tech via GATE.`,
        'ms-abroad': `Your global career aspirations make MS Abroad a very compelling path.`,
        'ssc-je': `Your engineering specialization and search for stable government work match SSC JE.`,
        'saas-startup': `Your technical coding skills and high risk appetite match SaaS startups perfectly.`,
    };

    return {
        answers,
        recommendations: results.map((r, i) => ({
            career: LOCAL_CAREERS[r.careerId],
            matchPercentage: r.matchPercentage,
            explanation: EXPLANATIONS[r.careerId] || `${r.careerId} scores ${r.matchPercentage}% based on your profile.`,
            rank: i + 1,
        })).filter(r => r.career),
    };
}

const FALLBACK_QUESTIONS = [
    // --- Step 1: Degree Selection ---
    {
        step: 1, field: 'degree',
        question: 'What is your current or acquiring degree?',
        subtitle: 'Select your field of study to customize your career quiz.',
        icon: '🎓',
        options: [
            { id: 'eng', label: '🎓 Engineering (B.Tech / B.E.)', value: 'Engineering' },
            { id: 'ca', label: '💻 Computer Applications (BCA / MCA / B.Sc CS)', value: 'ComputerApplications' },
            { id: 'mgt', label: '📊 Business & Management (BBA / MBA / BMS)', value: 'Management' },
            { id: 'com', label: '💼 Commerce & Finance (B.Com / M.Com / CA)', value: 'Commerce' },
            { id: 'sci', label: '🔬 Sciences (B.Sc / M.Sc)', value: 'Sciences' },
            { id: 'art', label: '🎨 Arts & Humanities (BA / MA)', value: 'Arts' },
        ],
    },

    // --- Engineering Track ---
    {
        step: 2, field: 'eng_branch',
        question: 'Which engineering branch are you from?',
        subtitle: 'Your branch helps us find careers that fit your background',
        icon: '⚙️',
        options: [
            { id: 'cse', label: 'Computer Science (CSE/IT)', value: 'CSE' },
            { id: 'ece', label: 'Electronics & Communication (ECE)', value: 'ECE' },
            { id: 'mech', label: 'Mechanical Engineering', value: 'MECH' },
            { id: 'civil', label: 'Civil Engineering', value: 'CIVIL' },
            { id: 'eee', label: 'Electrical & Electronics (EEE)', value: 'EEE' },
        ],
    },
    {
        step: 3, field: 'eng_interest',
        question: 'What is your primary career interest?',
        subtitle: 'Choose the domain that excites you the most',
        icon: '💡',
        options: [
            { id: 'coding', label: '💻 Software & Coding', value: 'Coding' },
            { id: 'core', label: '⚙️ Core Engineering & Design', value: 'Core' },
            { id: 'management', label: '📊 Business & Management', value: 'Management' },
            { id: 'research', label: '🔬 Research & Development', value: 'Research' },
            { id: 'civil_public', label: '🏗️ Civil & Public Works', value: 'Civil' },
        ],
    },
    {
        step: 4, field: 'eng_risk',
        question: 'How much career risk can you handle?',
        subtitle: 'Risk tolerance affects which career paths fit your profile',
        icon: '⚖️',
        options: [
            { id: 'low', label: '🛡️ Low — I prefer job security', value: 'Low' },
            { id: 'medium', label: '⚖️ Medium — Balanced risk is fine', value: 'Medium' },
            { id: 'high', label: '🎯 High — High risk for high reward', value: 'High' },
        ],
    },
    {
        step: 5, field: 'eng_work',
        question: 'What kind of work environment do you prefer?',
        subtitle: 'Select the setting you see yourself working in',
        icon: '🏢',
        options: [
            { id: 'mnc', label: '🌐 Tech MNCs / Product Companies', value: 'TechMNC' },
            { id: 'core_ind', label: '🏭 Core Industries (Manufacturing/Power)', value: 'CoreInd' },
            { id: 'govt', label: '🏛️ Government / Public Sector (PSUs)', value: 'Govt' },
            { id: 'lab', label: '🔬 Research Labs / Academia', value: 'ResearchLab' },
            { id: 'startups', label: '🚀 High-growth Tech Startups', value: 'Startups' },
        ],
    },
    {
        step: 6, field: 'eng_budget',
        question: 'What is your financial flexibility for further education?',
        subtitle: 'This helps evaluate options like MS abroad or premium MBA',
        icon: '💵',
        options: [
            { id: 'limited', label: '💳 Limited budget — Need job immediately or affordable path', value: 'Limited' },
            { id: 'afford', label: '💰 Can invest in higher studies (MS / MBA)', value: 'Afford' },
        ],
    },

    // --- Computer Applications Track ---
    {
        step: 2, field: 'ca_specialization',
        question: 'What is your primary area of focus in IT?',
        subtitle: 'Choose your desired specialization',
        icon: '🖥️',
        options: [
            { id: 'web', label: '🌐 Web & App Development', value: 'WebDev' },
            { id: 'data', label: '📊 Data Science & AI/ML', value: 'DataAI' },
            { id: 'cyber', label: '🔒 Cybersecurity & Networks', value: 'CyberNet' },
            { id: 'sys', label: '🖧 Systems Administration & Cloud', value: 'SysAdmin' },
            { id: 'pm', label: '📋 Project Management & IT Ops', value: 'Management' },
        ],
    },
    {
        step: 3, field: 'ca_coding',
        question: 'How would you rate your programming confidence?',
        subtitle: 'Be honest about your relationship with coding',
        icon: '💻',
        options: [
            { id: 'love', label: '🔥 Love coding — I code projects for fun', value: 'LoveCoding' },
            { id: 'mod', label: '👍 Moderate coding — I can code but open to non-coding tech roles', value: 'ModerateCoding' },
            { id: 'nocode', label: '🎨 Design/Management — Prefer design or no-code paths', value: 'NoCode' },
        ],
    },
    {
        step: 4, field: 'ca_risk',
        question: 'How much career risk are you comfortable with?',
        subtitle: 'This guides recommendations towards startups, MNCs, or freelancing',
        icon: '⚖️',
        options: [
            { id: 'low', label: '🛡️ Low — I prefer stable IT services firms', value: 'Low' },
            { id: 'medium', label: '⚖️ Medium — MNCs or established product companies', value: 'Medium' },
            { id: 'high', label: '🚀 High — Tech startups or remote freelancing', value: 'High' },
        ],
    },
    {
        step: 5, field: 'ca_salary',
        question: 'What is your primary career goal right now?',
        subtitle: 'Match career options to your ultimate target',
        icon: '💰',
        options: [
            { id: 'max', label: '💸 Maximize starting salary potential', value: 'MaxSalary' },
            { id: 'life', label: '🧘 Work-life balance and stable hours', value: 'WorkLife' },
            { id: 'learn', label: '📈 Learning opportunities & rapid promotion', value: 'Learning' },
        ],
    },
    {
        step: 6, field: 'ca_study',
        question: 'Are you planning to pursue further studies?',
        subtitle: 'Some roles benefit from MCA, MS, or professional certifications',
        icon: '📚',
        options: [
            { id: 'no', label: '❌ No — I want to start working immediately', value: 'No' },
            { id: 'yes', label: '✅ Yes — Open to PG degrees or specialized certifications', value: 'Yes' },
        ],
    },

    // --- Business & Management Track ---
    {
        step: 2, field: 'mgt_specialization',
        question: 'Which business domain interests you most?',
        subtitle: 'Select the field that matches your interest',
        icon: '📊',
        options: [
            { id: 'mkt', label: '📣 Marketing & Brand Management', value: 'Marketing' },
            { id: 'fin', label: '💵 Finance, Banking & Consulting', value: 'Finance' },
            { id: 'hr', label: '👥 Human Resource Management', value: 'HR' },
            { id: 'ops', label: '📦 Operations & Logistics', value: 'Operations' },
            { id: 'strat', label: '💡 Corporate Strategy & Business Development', value: 'Strategy' },
        ],
    },
    {
        step: 3, field: 'mgt_strength',
        question: 'What is your main professional strength?',
        subtitle: 'Your strongest skill determines your suitability for roles',
        icon: '🤝',
        options: [
            { id: 'lead', label: '👑 Leadership & Team Management', value: 'Leadership' },
            { id: 'data', label: '📈 Data Analysis & Strategic Planning', value: 'DataStrategy' },
            { id: 'comm', label: '💬 Communication & Public Relations', value: 'Communication' },
            { id: 'solve', label: '⚙️ Problem Solving & Operations management', value: 'ProblemSolving' },
        ],
    },
    {
        step: 4, field: 'mgt_risk',
        question: 'How much performance/target risk can you handle?',
        subtitle: 'Management careers range from stable HR roles to high-target sales roles',
        icon: '⚖️',
        options: [
            { id: 'low', label: '🛡️ Low — Prefer stable fixed salary and hours', value: 'Low' },
            { id: 'medium', label: '⚖️ Medium — Base salary plus performance bonuses', value: 'Medium' },
            { id: 'high', label: '🎯 High — High commission / target-heavy executive tracks', value: 'High' },
        ],
    },
    {
        step: 5, field: 'mgt_company',
        question: 'What type of organization do you aim to join?',
        subtitle: 'Select your preferred professional home',
        icon: '🏢',
        options: [
            { id: 'corp', label: '🌐 Large Corporate MNCs', value: 'CorporateMNC' },
            { id: 'consult', label: '💼 Management Consultancies', value: 'Consultancy' },
            { id: 'startup', label: '🚀 Fast-paced Startups or Venture Capital', value: 'StartupsVC' },
            { id: 'govt', label: '🏛️ Government / Public Administration', value: 'Government' },
        ],
    },
    {
        step: 6, field: 'mgt_budget',
        question: 'Do you plan to pursue a premium MBA program (e.g. IIMs or abroad)?',
        subtitle: 'Premium MBA programs open elite consulting and PM career options',
        icon: '💵',
        options: [
            { id: 'yes', label: '✅ Yes — Prepared to invest in a top-tier management degree', value: 'Yes' },
            { id: 'no', label: '❌ No — Prefer direct entry or company executive training', value: 'No' },
        ],
    },

    // --- Commerce & Finance Track ---
    {
        step: 2, field: 'com_specialization',
        question: 'Which area of commerce/finance interests you the most?',
        subtitle: 'Select your primary interest',
        icon: '💵',
        options: [
            { id: 'act', label: '📊 Accounting & Auditing', value: 'Accounting' },
            { id: 'corp', label: '💼 Corporate Finance & Investment Banking', value: 'CorpFinance' },
            { id: 'bank', label: '🏦 Commercial Banking & Insurance', value: 'Banking' },
            { id: 'tax', label: '📜 Taxation & Corporate Law', value: 'Taxation' },
            { id: 'mkt', label: '📈 Stock Markets & Trading', value: 'Markets' },
        ],
    },
    {
        step: 3, field: 'com_professional',
        question: 'Are you planning to prepare for professional certification exams?',
        subtitle: 'Exams like CA, CFA, CS, or CMA define specialized finance careers',
        icon: '📝',
        options: [
            { id: 'yes', label: '✅ Yes — Aiming for CA / CFA / CS certifications', value: 'Yes' },
            { id: 'no', label: '❌ No — Prefer standard corporate jobs after graduation', value: 'No' },
        ],
    },
    {
        step: 4, field: 'com_risk',
        question: 'What is your preferred career pace?',
        subtitle: 'Select between corporate stability and market volatility',
        icon: '⚖️',
        options: [
            { id: 'stable', label: '🛡️ Stable — Steady growth, compliance, and auditing', value: 'Stable' },
            { id: 'dynamic', label: '⚡ Dynamic — High pressure, fast growth, investment or trading', value: 'Dynamic' },
        ],
    },
    {
        step: 5, field: 'com_company',
        question: 'Which industry segment do you target?',
        subtitle: 'Select your target work domain',
        icon: '🏢',
        options: [
            { id: 'big4', label: '💼 Big 4 Accounting & Consulting Firms', value: 'Big4' },
            { id: 'ib', label: '📈 Investment Banks / Asset Management', value: 'InvestmentBanks' },
            { id: 'pub', label: '🏦 Public Sector or Commercial Banks', value: 'PublicBanks' },
            { id: 'fin', label: '🏢 Corporate Finance Departments', value: 'CorporateFin' },
        ],
    },
    {
        step: 6, field: 'com_study',
        question: 'Are you open to higher education like M.Com or MBA Finance?',
        subtitle: 'Post-graduate qualifications can accelerate corporate finance careers',
        icon: '📚',
        options: [
            { id: 'yes', label: '✅ Yes — Plan to pursue PG / MBA', value: 'Yes' },
            { id: 'no', label: '❌ No — Prefer to start working immediately', value: 'No' },
        ],
    },

    // --- Sciences Track ---
    {
        step: 2, field: 'sci_domain',
        question: 'Which science field are you pursuing?',
        subtitle: 'Specify your core science discipline',
        icon: '🔬',
        options: [
            { id: 'pcm', label: '📐 Physics, Chemistry, or Mathematics', value: 'PCM' },
            { id: 'bio', label: '🧬 Biotechnology, Biology, or Life Sciences', value: 'BioTech' },
            { id: 'comp', label: '💻 Computer Science or Data Science', value: 'CompSci' },
            { id: 'env', label: '🌱 Environmental Science & Ecology', value: 'Environmental' },
        ],
    },
    {
        step: 3, field: 'sci_interest',
        question: 'What is your ultimate career interest in Science?',
        subtitle: 'Select your preferred professional direction',
        icon: '💡',
        options: [
            { id: 'research', label: '🏫 Academic Research & University Teaching', value: 'ResearchTeaching' },
            { id: 'rd', label: '🧬 R&D in Private Sector (Pharma, Biotech, Tech)', value: 'PrivateRD' },
            { id: 'labs', label: '🏛️ Government Scientific Labs (ISRO, DRDO, CSIR)', value: 'GovtLabs' },
            { id: 'tech', label: '📊 Applied Analytics & Tech Roles', value: 'AppliedAnalytics' },
        ],
    },
    {
        step: 4, field: 'sci_study',
        question: 'Are you open to long-term post-graduate studies?',
        subtitle: 'Research careers in science usually require M.Sc or PhD',
        icon: '📚',
        options: [
            { id: 'yes', label: '✅ Yes — Ready to invest in M.Sc and PhD', value: 'Yes' },
            { id: 'no', label: '❌ No — Prefer immediate technical or analyst jobs', value: 'No' },
        ],
    },
    {
        step: 5, field: 'sci_work',
        question: 'What is your ideal work environment?',
        subtitle: 'Where do you see yourself executing your tasks?',
        icon: '🏫',
        options: [
            { id: 'lab', label: '🧪 Laboratory research and analysis', value: 'Lab' },
            { id: 'class', label: '🏫 Classroom lecturing and mentoring', value: 'Classroom' },
            { id: 'office', label: '🏢 Corporate office or tech desk', value: 'Office' },
            { id: 'field', label: '🌳 Field work, surveying, and conservation', value: 'Field' },
        ],
    },
    {
        step: 6, field: 'sci_budget',
        question: 'Do you have financial support for international MS/PhD programs?',
        subtitle: 'This helps evaluate global research vs. domestic options',
        icon: '💵',
        options: [
            { id: 'yes', label: '💰 Yes — Can fund abroad or looking for fully-funded PhDs', value: 'Yes' },
            { id: 'no', label: '💳 No — Seek affordable PG or immediate local job', value: 'No' },
        ],
    },

    // --- Arts & Humanities Track ---
    {
        step: 2, field: 'art_domain',
        question: 'What is your main field of study in Arts?',
        subtitle: 'Specify your core humanities field',
        icon: '🎨',
        options: [
            { id: 'lit', label: '📚 Literature & Linguistics', value: 'Literature' },
            { id: 'psych', label: '🧠 Psychology & Sociology', value: 'Psychology' },
            { id: 'econ', label: '📈 Economics & Political Science', value: 'Economics' },
            { id: 'art', label: '🎨 Fine Arts, Media & Creative Design', value: 'FineArts' },
            { id: 'hist', label: '🏛️ History, Geography & Archeology', value: 'History' },
        ],
    },
    {
        step: 3, field: 'art_interest',
        question: 'What kind of work excites you most?',
        subtitle: 'Select the category that matches your spark',
        icon: '💡',
        options: [
            { id: 'write', label: '✍️ Writing, Editing & Content Creation', value: 'Writing' },
            { id: 'civil', label: '🏛️ Civil Services & Public Administration', value: 'CivilServices' },
            { id: 'social', label: '👥 Counseling, Teaching & Social Work', value: 'Counseling' },
            { id: 'design', label: '🎨 Creative Design, UI/UX & Advertising', value: 'CreativeDesign' },
            { id: 'acad', label: '🔬 Research, History & Academia', value: 'Academia' },
        ],
    },
    {
        step: 4, field: 'art_risk',
        question: 'What is your approach to career stability?',
        subtitle: 'Choose between corporate, government, or freelance paths',
        icon: '⚖️',
        options: [
            { id: 'stable', label: '🏛️ Stable — Government, NGO, or institutional jobs', value: 'Stable' },
            { id: 'corp', label: '🏢 Corporate — Corporate marketing, media, or consulting', value: 'Corporate' },
            { id: 'creative', label: '🚀 Creative — Freelancing, startup, or creative agency', value: 'Creative' },
        ],
    },
    {
        step: 5, field: 'art_work',
        question: 'What is your ideal work rhythm?',
        subtitle: 'Choose the structure that matches your style',
        icon: '🧘',
        options: [
            { id: 'struct', label: '📅 Structured — Clear hours, low volatility', value: 'Structured' },
            { id: 'flex', label: '🎨 Flexible — Creative freedom, variable hours', value: 'Flexible' },
            { id: 'dyn', label: '⚡ Dynamic — Demanding hours, high impact', value: 'Dynamic' },
        ],
    },
    {
        step: 6, field: 'art_study',
        question: 'Are you planning to prepare for major competitive exams (like UPSC)?',
        subtitle: 'Civil services and bank exams are popular options for arts graduates',
        icon: '📝',
        options: [
            { id: 'yes', label: '✅ Yes — Focused on UPSC Civil Services / State exams', value: 'Yes' },
            { id: 'no', label: '❌ No — Aiming for corporate, creative, or academic career routes', value: 'No' },
        ],
    },
];
