import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchQuizQuestions, submitQuizAnswers } from '../services/api';
import { useApp } from '../context/AppContext';

export default function QuizPage() {
    const navigate = useNavigate();
    const { updateQuizAnswer, quizAnswers, setQuizResults, setQuizAnswers } = useApp();

    const [questions, setQuestions] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [localAnswers, setLocalAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchQuizQuestions()
            .then(res => {
                const data = res.data.data;
                if (data && data.length > 0) {
                    setQuestions(data);
                } else {
                    // Backend returned empty — use fallback
                    setQuestions(FALLBACK_QUESTIONS);
                }
            })
            .catch(() => {
                // Backend unavailable — use fallback
                setQuestions(FALLBACK_QUESTIONS);
            })
            .finally(() => setLoading(false));
    }, []);


    const currentQuestion = questions[currentStep];
    const progress = questions.length > 0 ? ((currentStep + 1) / questions.length) * 100 : 0;
    const selectedValue = currentQuestion ? localAnswers[currentQuestion.field] : null;

    function handleSelect(value) {
        const field = currentQuestion.field;
        setLocalAnswers(prev => ({ ...prev, [field]: value }));
        updateQuizAnswer(field, value);
    }

    async function handleNext() {
        if (!selectedValue) { setError('Please select an option to continue'); return; }
        setError('');
        if (currentStep < questions.length - 1) {
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
        } catch (err) {
            // If backend is unavailable, run local scoring engine
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

    const isLastStep = currentStep === questions.length - 1;

    return (
        <div className="quiz-page">
            <div className="quiz-container">
                {/* Progress */}
                <div className="quiz-step-label">
                    Question {currentStep + 1} of {questions.length}
                </div>
                <div className="quiz-progress-bar">
                    <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
                </div>

                {/* Question */}
                <div className="quiz-icon">{currentQuestion.icon}</div>
                <h2 className="quiz-question">{currentQuestion.question}</h2>
                {currentQuestion.subtitle && (
                    <p className="quiz-subtitle">{currentQuestion.subtitle}</p>
                )}

                {/* Options */}
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

                {/* Navigation */}
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

// ===== LOCAL OFFLINE SCORING ENGINE =====
const LOCAL_SCORING = {
    'data-analyst': [
        { field: 'branch', value: 'CSE', score: 15 }, { field: 'branch', value: 'ECE', score: 12 }, { field: 'branch', value: 'EEE', score: 10 }, { field: 'branch', value: 'Mechanical', score: 8 }, { field: 'branch', value: 'Civil', score: 6 },
        { field: 'interest', value: 'Coding', score: 20 }, { field: 'interest', value: 'Research', score: 12 }, { field: 'interest', value: 'Management', score: 8 }, { field: 'interest', value: 'Government', score: -10 },
        { field: 'riskTolerance', value: 'High', score: 10 }, { field: 'riskTolerance', value: 'Medium', score: 15 }, { field: 'riskTolerance', value: 'Low', score: 5 },
        { field: 'salaryExpectation', value: '>8lpa', score: 15 }, { field: 'salaryExpectation', value: '5-8lpa', score: 12 }, { field: 'salaryExpectation', value: '<5lpa', score: 5 },
        { field: 'studyPreference', value: 'No', score: 15 }, { field: 'studyPreference', value: 'Yes', score: 5 },
        { field: 'workLifeBalance', value: 'High', score: 10 }, { field: 'workLifeBalance', value: 'Medium', score: 15 }, { field: 'workLifeBalance', value: 'Low', score: 8 },
        { field: 'financialCondition', value: 'limited', score: 15 }, { field: 'financialCondition', value: 'can-afford', score: 5 },
    ],
    'software-developer': [
        { field: 'branch', value: 'CSE', score: 18 }, { field: 'branch', value: 'ECE', score: 10 }, { field: 'branch', value: 'Mechanical', score: 5 }, { field: 'branch', value: 'Civil', score: 4 },
        { field: 'interest', value: 'Coding', score: 25 }, { field: 'interest', value: 'Entrepreneurship', score: 10 }, { field: 'interest', value: 'Government', score: -15 },
        { field: 'riskTolerance', value: 'High', score: 12 }, { field: 'riskTolerance', value: 'Medium', score: 15 }, { field: 'riskTolerance', value: 'Low', score: 5 },
        { field: 'salaryExpectation', value: '>8lpa', score: 18 }, { field: 'salaryExpectation', value: '5-8lpa', score: 12 },
        { field: 'studyPreference', value: 'No', score: 15 }, { field: 'studyPreference', value: 'Yes', score: 8 },
        { field: 'workLifeBalance', value: 'Medium', score: 12 }, { field: 'workLifeBalance', value: 'Low', score: 5 },
        { field: 'financialCondition', value: 'limited', score: 15 }, { field: 'financialCondition', value: 'can-afford', score: 8 },
    ],
    'mba-cat': [
        { field: 'branch', value: 'Mechanical', score: 14 }, { field: 'branch', value: 'Civil', score: 14 }, { field: 'branch', value: 'CSE', score: 12 },
        { field: 'interest', value: 'Management', score: 25 }, { field: 'interest', value: 'Entrepreneurship', score: 18 }, { field: 'interest', value: 'Government', score: -5 },
        { field: 'riskTolerance', value: 'High', score: 15 }, { field: 'riskTolerance', value: 'Medium', score: 12 }, { field: 'riskTolerance', value: 'Low', score: 5 },
        { field: 'salaryExpectation', value: '>8lpa', score: 18 }, { field: 'salaryExpectation', value: '5-8lpa', score: 10 },
        { field: 'studyPreference', value: 'Yes', score: 20 }, { field: 'studyPreference', value: 'No', score: 0 },
        { field: 'workLifeBalance', value: 'Low', score: 5 }, { field: 'workLifeBalance', value: 'Medium', score: 10 },
        { field: 'financialCondition', value: 'can-afford', score: 18 }, { field: 'financialCondition', value: 'limited', score: 5 },
    ],
    'psu-engineer': [
        { field: 'branch', value: 'ECE', score: 16 }, { field: 'branch', value: 'EEE', score: 16 }, { field: 'branch', value: 'Mechanical', score: 16 }, { field: 'branch', value: 'Civil', score: 16 },
        { field: 'interest', value: 'Government', score: 20 }, { field: 'interest', value: 'Research', score: 10 }, { field: 'interest', value: 'Entrepreneurship', score: -5 },
        { field: 'riskTolerance', value: 'Low', score: 18 }, { field: 'riskTolerance', value: 'Medium', score: 12 },
        { field: 'salaryExpectation', value: '5-8lpa', score: 15 }, { field: 'salaryExpectation', value: '<5lpa', score: 12 },
        { field: 'studyPreference', value: 'Yes', score: 12 }, { field: 'studyPreference', value: 'No', score: 8 },
        { field: 'workLifeBalance', value: 'High', score: 18 }, { field: 'workLifeBalance', value: 'Medium', score: 12 },
        { field: 'financialCondition', value: 'limited', score: 18 }, { field: 'financialCondition', value: 'can-afford', score: 10 },
    ],
    'mtech-gate': [
        { field: 'interest', value: 'Research', score: 25 }, { field: 'interest', value: 'Government', score: 10 }, { field: 'interest', value: 'Management', score: 5 },
        { field: 'riskTolerance', value: 'Low', score: 15 }, { field: 'riskTolerance', value: 'Medium', score: 12 },
        { field: 'studyPreference', value: 'Yes', score: 22 }, { field: 'studyPreference', value: 'No', score: -5 },
        { field: 'workLifeBalance', value: 'High', score: 12 }, { field: 'workLifeBalance', value: 'Medium', score: 10 },
        { field: 'financialCondition', value: 'limited', score: 18 }, { field: 'financialCondition', value: 'can-afford', score: 8 },
    ],
    'ms-abroad': [
        { field: 'branch', value: 'CSE', score: 15 }, { field: 'branch', value: 'ECE', score: 14 },
        { field: 'interest', value: 'Research', score: 22 }, { field: 'interest', value: 'Coding', score: 15 }, { field: 'interest', value: 'Government', score: -15 },
        { field: 'riskTolerance', value: 'High', score: 18 }, { field: 'riskTolerance', value: 'Low', score: 3 },
        { field: 'salaryExpectation', value: '>8lpa', score: 20 },
        { field: 'studyPreference', value: 'Yes', score: 25 }, { field: 'studyPreference', value: 'No', score: -10 },
        { field: 'financialCondition', value: 'can-afford', score: 25 }, { field: 'financialCondition', value: 'limited', score: -20 },
    ],
    'govt-ssc-je': [
        { field: 'branch', value: 'Civil', score: 18 }, { field: 'branch', value: 'Mechanical', score: 16 }, { field: 'branch', value: 'EEE', score: 16 },
        { field: 'interest', value: 'Government', score: 25 }, { field: 'interest', value: 'Entrepreneurship', score: -10 },
        { field: 'riskTolerance', value: 'Low', score: 20 }, { field: 'riskTolerance', value: 'Medium', score: 12 },
        { field: 'salaryExpectation', value: '<5lpa', score: 15 }, { field: 'salaryExpectation', value: '5-8lpa', score: 12 },
        { field: 'workLifeBalance', value: 'High', score: 18 }, { field: 'workLifeBalance', value: 'Medium', score: 12 },
        { field: 'financialCondition', value: 'limited', score: 20 }, { field: 'financialCondition', value: 'can-afford', score: 10 },
    ],
    'entrepreneurship': [
        { field: 'interest', value: 'Entrepreneurship', score: 30 }, { field: 'interest', value: 'Management', score: 15 }, { field: 'interest', value: 'Government', score: -20 },
        { field: 'riskTolerance', value: 'High', score: 25 }, { field: 'riskTolerance', value: 'Medium', score: 15 }, { field: 'riskTolerance', value: 'Low', score: -10 },
        { field: 'salaryExpectation', value: '>8lpa', score: 15 },
        { field: 'studyPreference', value: 'No', score: 15 },
        { field: 'workLifeBalance', value: 'Low', score: 18 },
        { field: 'financialCondition', value: 'can-afford', score: 15 }, { field: 'financialCondition', value: 'limited', score: 8 },
    ],
};

const LOCAL_CAREERS = {
    'data-analyst': { id: 'data-analyst', name: 'Data Analyst', subCategory: 'Data & Analytics', category: 'private', salary: { fresher: '₹4–8 LPA', fiveYears: '₹15–25 LPA' }, riskLevel: 'Medium', growthPotential: 'Very High', overview: 'Analyze data and provide business insights using SQL, Python, Power BI.' },
    'software-developer': { id: 'software-developer', name: 'Software Developer', subCategory: 'IT & Software', category: 'private', salary: { fresher: '₹5–12 LPA', fiveYears: '₹25–50 LPA' }, riskLevel: 'Medium', growthPotential: 'Very High', overview: 'Build software applications using modern tech stack and programming languages.' },
    'mba-cat': { id: 'mba-cat', name: 'MBA via CAT', subCategory: 'Business Management', category: 'higher-studies', salary: { fresher: '₹10–25 LPA', fiveYears: '₹35–80 LPA' }, riskLevel: 'High', growthPotential: 'Very High', overview: 'Transform into a business leader through top IIM/MBA programs via CAT exam.' },
    'psu-engineer': { id: 'psu-engineer', name: 'PSU Engineer (GATE)', subCategory: 'Public Sector', category: 'government', salary: { fresher: '₹6–10 LPA', fiveYears: '₹15–20 LPA' }, riskLevel: 'Low', growthPotential: 'Medium', overview: 'Secure government engineering job in ONGC, BHEL, NTPC via GATE score.' },
    'mtech-gate': { id: 'mtech-gate', name: 'M.Tech via GATE', subCategory: 'Technical Studies', category: 'higher-studies', salary: { fresher: '₹8–18 LPA', fiveYears: '₹25–50 LPA' }, riskLevel: 'Low', growthPotential: 'High', overview: 'Pursue advanced technical degree from IIT/NIT for deep engineering expertise.' },
    'ms-abroad': { id: 'ms-abroad', name: 'MS Abroad (USA/Europe)', subCategory: 'International Studies', category: 'higher-studies', salary: { fresher: '₹25–60 LPA', fiveYears: '₹60–150 LPA' }, riskLevel: 'High', growthPotential: 'Very High', overview: 'Study at world-class universities abroad for global career and FAANG opportunities.' },
    'govt-ssc-je': { id: 'govt-ssc-je', name: 'Govt Engineer (SSC JE)', subCategory: 'Civil Service', category: 'government', salary: { fresher: '₹3.5–6 LPA', fiveYears: '₹9–14 LPA' }, riskLevel: 'Low', growthPotential: 'Low', overview: 'Join Indian government as Junior Engineer through SSC JE / UPSC exams.' },
    'entrepreneurship': { id: 'entrepreneurship', name: 'Entrepreneurship / Startup', subCategory: 'Startup & Business', category: 'entrepreneurship', salary: { fresher: '₹0–5 LPA (initially)', fiveYears: 'Unlimited' }, riskLevel: 'High', growthPotential: 'Very High', overview: 'Build your own startup using engineering skills in India\'s booming startup ecosystem.' },
};

function runLocalScoring(answers) {
    const results = Object.entries(LOCAL_SCORING).map(([id, rules]) => {
        const score = rules.reduce((sum, r) => answers[r.field] === r.value ? sum + r.score : sum, 0);
        const max = rules.filter(r => r.score > 0).reduce((s, r) => s + r.score, 0);
        return { careerId: id, matchPercentage: Math.min(100, Math.max(0, Math.round((score / max) * 100))) };
    }).sort((a, b) => b.matchPercentage - a.matchPercentage).slice(0, 3);

    const EXPLANATIONS = {
        'data-analyst': `With your interest in ${answers.interest === 'Coding' ? 'coding' : 'analytics'} and ${answers.riskTolerance} risk tolerance, Data Analytics is a great fit. No expensive degree required.`,
        'software-developer': `Your ${answers.branch} background and passion for ${answers.interest === 'Coding' ? 'coding' : 'technology'} make Software Development a top choice.`,
        'mba-cat': `Your ${answers.interest === 'Management' ? 'management interest' : 'strategic thinking'} and ${answers.financialCondition === 'can-afford' ? 'financial readiness' : 'ambition'} align with an MBA.`,
        'psu-engineer': `Your preference for ${answers.riskTolerance === 'Low' ? 'job security' : 'stability'} and ${answers.workLifeBalance === 'High' ? 'work-life balance' : 'structured career'} fit PSU Engineer perfectly.`,
        'mtech-gate': `Your passion for ${answers.interest === 'Research' ? 'research' : 'deep learning'} and willingness to study more make M.Tech via GATE ideal.`,
        'ms-abroad': `Your ambition for global exposure and ${answers.financialCondition === 'can-afford' ? 'financial readiness' : 'drive'} make MS Abroad a compelling choice.`,
        'govt-ssc-je': `Your preference for ${answers.riskTolerance === 'Low' ? 'maximum job security' : 'government service'} and work-life balance make SSC JE an ideal path.`,
        'entrepreneurship': `Your ${answers.riskTolerance === 'High' ? 'high risk appetite' : 'ambitious mindset'} and ${answers.interest === 'Entrepreneurship' ? 'entrepreneurial drive' : 'innovative thinking'} are perfect for startups.`,
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

    {
        step: 1, field: 'branch',
        question: 'Which engineering branch are you from?',
        subtitle: 'Your branch helps us find careers that fit your background',
        icon: '🎓',
        options: [
            { id: 'cse', label: '💻 Computer Science (CSE/IT)', value: 'CSE' },
            { id: 'ece', label: '📡 Electronics & Communication (ECE)', value: 'ECE' },
            { id: 'mech', label: '⚙️ Mechanical Engineering', value: 'Mechanical' },
            { id: 'civil', label: '🏗️ Civil Engineering', value: 'Civil' },
            { id: 'eee', label: '⚡ Electrical & Electronics (EEE)', value: 'EEE' },
        ],
    },
    {
        step: 2, field: 'interest',
        question: 'What is your primary career interest?',
        subtitle: 'Choose the domain that excites you the most',
        icon: '💡',
        options: [
            { id: 'coding', label: '💻 Coding & Technology', value: 'Coding' },
            { id: 'management', label: '📊 Management & Business', value: 'Management' },
            { id: 'government', label: '🏛️ Government Service', value: 'Government' },
            { id: 'research', label: '🔬 Research & Development', value: 'Research' },
            { id: 'entrepreneurship', label: '🚀 Entrepreneurship', value: 'Entrepreneurship' },
        ],
    },
    {
        step: 3, field: 'riskTolerance',
        question: 'How much career risk can you handle?',
        subtitle: 'Risk affects which careers suit your personality',
        icon: '⚖️',
        options: [
            { id: 'low', label: '🛡️ Low — I prefer job security', value: 'Low' },
            { id: 'medium', label: '⚖️ Medium — Balanced risk is fine', value: 'Medium' },
            { id: 'high', label: '🎯 High — I accept high risk for high reward', value: 'High' },
        ],
    },
    {
        step: 4, field: 'salaryExpectation',
        question: 'What is your salary expectation (starting)?',
        subtitle: 'This helps match career paths with realistic outcomes',
        icon: '💰',
        options: [
            { id: 'low', label: '< ₹5 LPA — Stability over salary', value: '<5lpa' },
            { id: 'mid', label: '₹5–8 LPA — Comfortable range', value: '5-8lpa' },
            { id: 'high', label: '> ₹8 LPA — High earning is important', value: '>8lpa' },
        ],
    },
    {
        step: 5, field: 'studyPreference',
        question: 'Are you open to further studies after B.Tech?',
        subtitle: 'Some career paths require additional degrees',
        icon: '📚',
        options: [
            { id: 'no', label: '❌ No — I want to work immediately', value: 'No' },
            { id: 'yes', label: '✅ Yes — I can invest 1–2 years more in studies', value: 'Yes' },
        ],
    },
    {
        step: 6, field: 'workLifeBalance',
        question: 'How important is work-life balance to you?',
        subtitle: 'Different careers demand very different time commitments',
        icon: '🧘',
        options: [
            { id: 'low', label: '💪 Low — I can work 60+ hours/week', value: 'Low' },
            { id: 'medium', label: '⚖️ Medium — 45–55 hours/week is fine', value: 'Medium' },
            { id: 'high', label: '🏡 High — Family time & balance is priority', value: 'High' },
        ],
    },
    {
        step: 7, field: 'financialCondition',
        question: 'What is your financial situation for higher studies?',
        subtitle: 'This affects options like MS abroad or MBA',
        icon: '💵',
        options: [
            { id: 'limited', label: '💳 Limited budget — Need affordable paths', value: 'limited' },
            { id: 'can-afford', label: '💰 Can afford MS/MBA investment', value: 'can-afford' },
        ],
    },
];
