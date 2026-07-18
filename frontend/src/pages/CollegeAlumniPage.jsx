import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import API from '../services/api';


export default function CollegeAlumniPage() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const { isDark } = useTheme();
    const reqUserId = currentUser?.uid;

    const optionStyle = {
        background: isDark ? '#1e293b' : '#ffffff',
        color: isDark ? '#f3f4f6' : '#111827'
    };

    // App state
    const [loading, setLoading] = useState(true);
    const [membership, setMembership] = useState({ joined: false });
    const [activeTab, setActiveTab] = useState('directory');

    // Onboarding form state
    const [colleges, setColleges] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showRegister, setShowRegister] = useState(false);
    const [onboardingForm, setOnboardingForm] = useState({
        collegeId: '', role: 'student', batchYear: new Date().getFullYear(),
        branch: 'CSE', currentCompany: '', currentRole: '',
        availabilityTags: [], email: '', name: '', rollNo: ''
    });
    const [registerForm, setRegisterForm] = useState({
        name: '', slug: '', domain: '', logoUrl: '', bannerUrl: '',
        role: 'admin', batchYear: new Date().getFullYear(), branch: 'CSE',
        creatorName: '', rollNo: ''
    });
    const [formError, setFormError] = useState('');

    // Directory state
    const [directory, setDirectory] = useState([]);
    const [dirSearch, setDirSearch] = useState('');
    const [dirRole, setDirRole] = useState('');
    const [dirBranch, setDirBranch] = useState('');

    // Chat state
    const [rooms, setRooms] = useState([]);
    const [activeRoom, setActiveRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const chatEndRef = useRef(null);

    // Q&A state
    const [questions, setQuestions] = useState([]);
    const [questionInput, setQuestionInput] = useState('');
    const [answeringQuestionId, setAnsweringQuestionId] = useState(null);
    const [answerInput, setAnswerInput] = useState('');

    // Referrals state
    const [referrals, setReferrals] = useState([]);
    const [newReferral, setNewReferral] = useState({ targetCompany: '', targetRole: '', description: '' });
    const [referralMessage, setReferralMessage] = useState('');
    const [respondingReferralId, setRespondingReferralId] = useState(null);

    // Leaderboard state
    const [leaderboard, setLeaderboard] = useState([]);

    // AI Assistant state
    const [aiMessages, setAiMessages] = useState([
        { sender: 'ai', text: '👋 Hi! I am your AI Alumni Assistant. Ask me anything about alumni from your college, companies they work at, or career advice.' }
    ]);
    const [aiInput, setAiInput] = useState('');
    const [aiLoading, setAiLoading] = useState(false);

    // Load initial membership
    useEffect(() => {
        loadMembership();
    }, []);

    // Prefill name fields when currentUser details load
    useEffect(() => {
        if (currentUser) {
            setOnboardingForm(prev => ({
                ...prev,
                name: prev.name || currentUser.displayName || ''
            }));
            setRegisterForm(prev => ({
                ...prev,
                creatorName: prev.creatorName || currentUser.displayName || ''
            }));
        }
    }, [currentUser]);

    const loadMembership = async () => {
        try {
            setLoading(true);
            const res = await API.get('/alumni/membership');
            if (res.data.success) {
                setMembership(res.data);
                if (res.data.joined) {
                    loadDashboardData(res.data.member);
                } else {
                    loadColleges();
                }
            }
        } catch (err) {
            console.error('Error fetching membership:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadColleges = async (q = '') => {
        try {
            const res = await API.get(`/alumni/colleges/search?q=${q}`);
            if (res.data.success) {
                setColleges(res.data.colleges);
            }
        } catch (err) {
            console.error('Error searching colleges:', err);
        }
    };

    const loadDashboardData = (member) => {
        loadDirectory();
        loadRooms();
        loadQuestions();
        loadReferrals();
        loadLeaderboard();
    };

    // Directory
    const loadDirectory = async () => {
        try {
            const res = await API.get(`/alumni/directory?search=${dirSearch}&role=${dirRole}&branch=${dirBranch}`);
            if (res.data.success) {
                setDirectory(res.data.members);
            }
        } catch (err) {
            console.error('Error directory:', err);
        }
    };

    useEffect(() => {
        if (membership.joined) {
            loadDirectory();
        }
    }, [dirSearch, dirRole, dirBranch, membership.joined]);

    // Chat rooms
    const loadRooms = async () => {
        try {
            const res = await API.get('/alumni/rooms');
            if (res.data.success && res.data.rooms.length > 0) {
                setRooms(res.data.rooms);
                setActiveRoom(res.data.rooms[0]);
            }
        } catch (err) {
            console.error('Error rooms:', err);
        }
    };

    const loadRoomMessages = async (roomId) => {
        try {
            const res = await API.get(`/alumni/rooms/${roomId}/messages`);
            if (res.data.success) {
                setMessages(res.data.messages);
            }
        } catch (err) {
            console.error('Error messages:', err);
        }
    };

    useEffect(() => {
        if (activeRoom) {
            loadRoomMessages(activeRoom.id);
            const interval = setInterval(() => {
                loadRoomMessages(activeRoom.id);
            }, 3000); // Poll every 3 seconds for live updates
            return () => clearInterval(interval);
        }
    }, [activeRoom]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!chatInput.trim() || !activeRoom) return;
        try {
            const res = await API.post(`/alumni/rooms/${activeRoom.id}/messages`, {
                content: chatInput.trim(),
                senderName: currentUser.displayName || currentUser.email.split('@')[0],
                senderAvatar: currentUser.photoURL || ''
            });
            if (res.data.success) {
                setMessages(prev => [...prev, res.data.message]);
                setChatInput('');
            }
        } catch (err) {
            console.error('Error sending message:', err);
        }
    };

    // Questions (Q&A)
    const loadQuestions = async () => {
        try {
            const res = await API.get('/alumni/questions');
            if (res.data.success) {
                setQuestions(res.data.questions);
            }
        } catch (err) {
            console.error('Error questions:', err);
        }
    };

    const handlePostQuestion = async (e) => {
        e.preventDefault();
        if (!questionInput.trim()) return;
        try {
            const res = await API.post('/alumni/questions', { content: questionInput.trim() });
            if (res.data.success) {
                setQuestions(prev => [res.data.question, ...prev]);
                setQuestionInput('');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handlePostAnswer = async (questionId) => {
        if (!answerInput.trim()) return;
        try {
            const res = await API.post(`/alumni/questions/${questionId}/answers`, {
                content: answerInput.trim(),
                senderName: currentUser.displayName || currentUser.email.split('@')[0]
            });
            if (res.data.success) {
                setQuestions(prev => prev.map(q => {
                    if (q.id === questionId) {
                        return { ...q, answers: [...q.answers, res.data.answer] };
                    }
                    return q;
                }));
                setAnswerInput('');
                setAnsweringQuestionId(null);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpvoteAnswer = async (answerId, questionId) => {
        try {
            const res = await API.post(`/alumni/answers/${answerId}/upvote`);
            if (res.data.success) {
                setQuestions(prev => prev.map(q => {
                    if (q.id === questionId) {
                        return {
                            ...q,
                            answers: q.answers.map(ans => ans.id === answerId ? { ...ans, upvotes: ans.upvotes + 1 } : ans)
                        };
                    }
                    return q;
                }));
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Referrals
    const loadReferrals = async () => {
        try {
            const res = await API.get('/alumni/referrals');
            if (res.data.success) {
                setReferrals(res.data.requests);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handlePostReferralRequest = async (e) => {
        e.preventDefault();
        if (!newReferral.targetCompany || !newReferral.targetRole) return;
        try {
            const res = await API.post('/alumni/referrals', {
                ...newReferral,
                studentName: currentUser.displayName || currentUser.email.split('@')[0]
            });
            if (res.data.success) {
                setReferrals(prev => [res.data.request, ...prev]);
                setNewReferral({ targetCompany: '', targetRole: '', description: '' });
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleRespondReferral = async (requestId) => {
        if (!referralMessage.trim()) return;
        try {
            const res = await API.post(`/alumni/referrals/${requestId}/respond`, {
                message: referralMessage.trim(),
                senderName: currentUser.displayName || currentUser.email.split('@')[0]
            });
            if (res.data.success) {
                setReferrals(prev => prev.map(r => {
                    if (r.id === requestId) {
                        return { ...r, status: 'in_progress', responses: [...r.responses, res.data.response] };
                    }
                    return r;
                }));
                setReferralMessage('');
                setRespondingReferralId(null);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateReferralStatus = async (requestId, status) => {
        try {
            const res = await API.put(`/alumni/referrals/${requestId}/status`, { status });
            if (res.data.success) {
                setReferrals(prev => prev.map(r => r.id === requestId ? { ...r, status } : r));
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Leaderboard
    const loadLeaderboard = async () => {
        try {
            const res = await API.get('/alumni/leaderboard');
            if (res.data.success) {
                setLeaderboard(res.data.leaderboard);
            }
        } catch (err) {
            console.error(err);
        }
    };

    // AI Assistant
    const handleSendAiMessage = async (e) => {
        e.preventDefault();
        if (!aiInput.trim()) return;
        const userMsg = aiInput.trim();
        setAiMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
        setAiInput('');
        setAiLoading(true);

        try {
            // Count directory statistics to provide rich AI responses
            const alumniInCompany = directory.reduce((acc, m) => {
                if (m.role === 'alumnus' && m.currentCompany) {
                    acc[m.currentCompany.toLowerCase()] = (acc[m.currentCompany.toLowerCase()] || 0) + 1;
                }
                return acc;
            }, {});

            const alumniBranches = directory.reduce((acc, m) => {
                if (m.role === 'alumnus') {
                    acc[m.branch] = (acc[m.branch] || 0) + 1;
                }
                return acc;
            }, {});

            setTimeout(() => {
                let aiResponse = "";
                const lowerMsg = userMsg.toLowerCase();

                if (lowerMsg.includes('alumni') || lowerMsg.includes('who work') || lowerMsg.includes('directory')) {
                    const companies = Object.keys(alumniInCompany);
                    if (companies.length > 0) {
                        aiResponse = `According to our records, we have verified alumni working at ${companies.map(c => c.toUpperCase()).join(', ')}. You can find them under the "Directory" tab and filter by target company.`;
                    } else {
                        aiResponse = "Currently, we don't have registered alumni listed under specific companies in the database, but keep checking back as more sign up!";
                    }
                } else if (lowerMsg.includes('referral') || lowerMsg.includes('job') || lowerMsg.includes('apply')) {
                    aiResponse = "To get a job referral, go to the 'Referral Board' tab, click 'Request Referral' and specify the target company and role. Alumni working at those companies will be notified and can offer direct referrals.";
                } else if (lowerMsg.includes('cse') || lowerMsg.includes('ece') || lowerMsg.includes('branch')) {
                    aiResponse = `Yes! We have alumni from various disciplines. The branch breakdown in this network is: ${Object.entries(alumniBranches).map(([b, count]) => `${b}: ${count}`).join(', ')}.`;
                } else {
                    aiResponse = "As your college alumni AI guide, I recommend looking at the Top Alumni Contributors on the Leaderboard tab to find the most active members for resume review or interview preparation support.";
                }

                setAiMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
                setAiLoading(false);
            }, 1000);
        } catch (err) {
            setAiLoading(false);
        }
    };

    const handleJoinSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        let targetCollegeId = onboardingForm.collegeId;

        // Auto-resolve if user typed the name but didn't select from dropdown
        if (!targetCollegeId && searchQuery.trim()) {
            try {
                const searchRes = await API.get(`/alumni/colleges/search?q=${searchQuery.trim()}`);
                if (searchRes.data.success && searchRes.data.colleges.length > 0) {
                    const exactMatch = searchRes.data.colleges.find(
                        c => c.name.toLowerCase() === searchQuery.trim().toLowerCase()
                    );
                    if (exactMatch) {
                        targetCollegeId = exactMatch.id;
                    } else {
                        targetCollegeId = searchRes.data.colleges[0].id;
                    }
                }
            } catch (err) {
                console.error('Error auto-resolving college:', err);
            }
        }

        if (!targetCollegeId) {
            setFormError('Please select a college.');
            return;
        }

        try {
            const res = await API.post('/alumni/join', { ...onboardingForm, collegeId: targetCollegeId });
            if (res.data.success) {
                setMembership({ joined: true, ...res.data });
                loadDashboardData(res.data.member);
            }
        } catch (err) {
            setFormError(err.response?.data?.error || 'Join college failed.');
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        if (!registerForm.name || !registerForm.slug || !registerForm.domain) {
            setFormError('Please fill in name, slug, and email domain.');
            return;
        }
        try {
            const res = await API.post('/alumni/colleges', registerForm);
            if (res.data.success) {
                setMembership({ joined: true, ...res.data });
                loadDashboardData(res.data.member);
            }
        } catch (err) {
            setFormError(err.response?.data?.error || 'Register college failed.');
        }
    };

    // Render loading
    if (loading) {
        return (
            <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Loading college network...</p>
            </div>
        );
    }

    // Render Onboarding
    if (!membership.joined) {
        return (
            <div style={{ padding: '3rem 1.5rem', maxWidth: '600px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                        College Alumni Network
                    </h1>
                    <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto' }}>
                        Connect with verified alumni of your college for placement preparation, referrals, and career path mentorship.
                    </p>
                </div>

                {formError && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', padding: '0.8rem 1rem', borderRadius: '8px', color: '#f87171', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                        {formError}
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Join / search card */}
                    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.75rem' }}>
                        {!showRegister ? (
                            <>
                                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
                                    Join Your College Space
                                </h3>
                                <form onSubmit={handleJoinSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {/* Select dropdown */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                        <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Select College</label>
                                        <select
                                            value={onboardingForm.collegeId}
                                            onChange={e => {
                                                const cid = e.target.value;
                                                const cname = colleges.find(c => c.id === cid)?.name || '';
                                                setOnboardingForm(prev => ({ ...prev, collegeId: cid }));
                                                setSearchQuery(cname);
                                            }}
                                            style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '0.85rem' }}
                                        >
                                            <option value="" style={optionStyle}>-- Choose a College --</option>
                                            {colleges.map(c => (
                                                <option key={c.id} value={c.id} style={optionStyle}>
                                                    {c.name} ({c.domain})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Full Name */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                        <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Full Name</label>
                                        <input
                                            type="text"
                                            placeholder="Your Full Name"
                                            value={onboardingForm.name || ''}
                                            onChange={e => setOnboardingForm(prev => ({ ...prev, name: e.target.value }))}
                                            style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '0.85rem' }}
                                            required
                                        />
                                    </div>

                                    {/* Verification domain */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                        <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>College Email Domain Check (Optional)</label>
                                        <input
                                            type="email"
                                            placeholder="yourname@college.edu"
                                            value={onboardingForm.email}
                                            onChange={e => setOnboardingForm(prev => ({ ...prev, email: e.target.value }))}
                                            style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '0.85rem' }}
                                        />
                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>If provided, domain must match the college registration domain.</span>
                                    </div>

                                    {/* Role */}
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Role</label>
                                            <select
                                                value={onboardingForm.role}
                                                onChange={e => setOnboardingForm(prev => ({ ...prev, role: e.target.value }))}
                                                style={{ padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '0.85rem' }}
                                            >
                                                <option value="student" style={optionStyle}>Student</option>
                                                <option value="alumnus" style={optionStyle}>Alumnus/Alumna</option>
                                            </select>
                                        </div>
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Branch</label>
                                            <select
                                                value={onboardingForm.branch}
                                                onChange={e => setOnboardingForm(prev => ({ ...prev, branch: e.target.value }))}
                                                style={{ padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '0.85rem' }}
                                            >
                                                <option value="CSE" style={optionStyle}>CSE</option>
                                                <option value="ECE" style={optionStyle}>ECE</option>
                                                <option value="Mechanical" style={optionStyle}>Mechanical</option>
                                                <option value="Civil" style={optionStyle}>Civil</option>
                                                <option value="EEE" style={optionStyle}>EEE</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Batch Year</label>
                                            <input
                                                type="number"
                                                value={onboardingForm.batchYear}
                                                onChange={e => setOnboardingForm(prev => ({ ...prev, batchYear: parseInt(e.target.value) || 2026 }))}
                                                style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '0.85rem' }}
                                            />
                                        </div>
                                        {onboardingForm.role === 'student' && (
                                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Roll Number</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. 21H61A0501"
                                                    value={onboardingForm.rollNo || ''}
                                                    onChange={e => setOnboardingForm(prev => ({ ...prev, rollNo: e.target.value }))}
                                                    style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '0.85rem' }}
                                                    required
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {onboardingForm.role === 'alumnus' && (
                                        <>
                                            <div style={{ display: 'flex', gap: '1rem' }}>
                                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                                    <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Current Company</label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. Google"
                                                        value={onboardingForm.currentCompany}
                                                        onChange={e => setOnboardingForm(prev => ({ ...prev, currentCompany: e.target.value }))}
                                                        style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '0.85rem' }}
                                                    />
                                                </div>
                                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                                    <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Current Role</label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. Software Engineer"
                                                        value={onboardingForm.currentRole}
                                                        onChange={e => setOnboardingForm(prev => ({ ...prev, currentRole: e.target.value }))}
                                                        style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '0.85rem' }}
                                                    />
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Availability Prefs</label>
                                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                    {['referrals', 'mentorship', 'chat'].map(tag => {
                                                        const exists = onboardingForm.availabilityTags.includes(tag);
                                                        return (
                                                            <button
                                                                key={tag}
                                                                type="button"
                                                                onClick={() => {
                                                                    const updated = exists
                                                                        ? onboardingForm.availabilityTags.filter(t => t !== tag)
                                                                        : [...onboardingForm.availabilityTags, tag];
                                                                    setOnboardingForm(prev => ({ ...prev, availabilityTags: updated }));
                                                                }}
                                                                style={{ padding: '0.35rem 0.75rem', borderRadius: '20px', border: exists ? '1px solid #fbbf24' : '1px solid var(--border)', background: exists ? 'rgba(251,191,36,0.1)' : 'transparent', color: exists ? '#fbbf24' : 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                                                            >
                                                                Open for {tag}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>Join Space</button>
                                    <button type="button" onClick={() => setShowRegister(true)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                                        Register a New College instead
                                    </button>
                                </form>
                            </>
                        ) : (
                            <>
                                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
                                    Register New College Space
                                </h3>
                                <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                        <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>College Name</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. ACE Engineering College"
                                            value={registerForm.name}
                                            onChange={e => setRegisterForm(prev => ({ ...prev, name: e.target.value }))}
                                            style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '0.85rem' }}
                                            required
                                        />
                                    </div>

                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Slug</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. aceec"
                                                value={registerForm.slug}
                                                onChange={e => setRegisterForm(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
                                                style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '0.85rem' }}
                                                required
                                            />
                                        </div>
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Email Domain</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. aceec.ac.in"
                                                value={registerForm.domain}
                                                onChange={e => setRegisterForm(prev => ({ ...prev, domain: e.target.value.toLowerCase() }))}
                                                style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '0.85rem' }}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Creator Role</label>
                                            <select
                                                value={registerForm.role}
                                                onChange={e => setRegisterForm(prev => ({ ...prev, role: e.target.value }))}
                                                style={{ padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '0.85rem' }}
                                            >
                                                <option value="admin" style={optionStyle}>TPO/Admin</option>
                                                <option value="student" style={optionStyle}>Student Representative</option>
                                                <option value="alumnus" style={optionStyle}>Alumnus Representative</option>
                                            </select>
                                        </div>
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Branch</label>
                                            <select
                                                value={registerForm.branch}
                                                onChange={e => setRegisterForm(prev => ({ ...prev, branch: e.target.value }))}
                                                style={{ padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '0.85rem' }}
                                            >
                                                <option value="CSE" style={optionStyle}>CSE</option>
                                                <option value="ECE" style={optionStyle}>ECE</option>
                                                <option value="Mechanical" style={optionStyle}>Mechanical</option>
                                                <option value="Civil" style={optionStyle}>Civil</option>
                                                <option value="EEE" style={optionStyle}>EEE</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Your Name</label>
                                            <input
                                                type="text"
                                                placeholder="Your Full Name"
                                                value={registerForm.creatorName || ''}
                                                onChange={e => setRegisterForm(prev => ({ ...prev, creatorName: e.target.value }))}
                                                style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '0.85rem' }}
                                                required
                                            />
                                        </div>
                                        {registerForm.role === 'student' && (
                                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Your Roll Number</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. 21H61A0501"
                                                    value={registerForm.rollNo || ''}
                                                    onChange={e => setRegisterForm(prev => ({ ...prev, rollNo: e.target.value }))}
                                                    style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '0.85rem' }}
                                                    required
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>Register College</button>
                                    <button type="button" onClick={() => setShowRegister(false)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                                        Search & Join existing college
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Render Dashboard
    const { college, member } = membership;

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Header band */}
            <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', padding: '1.5rem 1.5rem 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                            🏫
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>{college.name} Space</h2>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    {college.domain}
                                </span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    verified community
                                </span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={async () => { if (confirm('Are you sure you want to leave this college space?')) { try { await API.delete('/alumni/membership'); loadMembership(); } catch (err) {} } }}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.45rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: '#f87171', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                    >
                        Leave Network
                    </button>
                </div>

                {/* Main Tabs */}
                <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {[
                        { id: 'directory', label: 'Directory' },
                        { id: 'chat', label: 'Chat Channels' },
                        { id: 'qa', label: 'Ask Alumni' },
                        { id: 'referrals', label: 'Referral Board' },
                        { id: 'leaderboard', label: 'Leaderboard' },
                        { id: 'ai', label: 'AI Assistant' }
                    ].map(t => {
                        const active = activeTab === t.id;
                        return (
                            <button
                                key={t.id}
                                onClick={() => setActiveTab(t.id)}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.6rem 1rem', borderRadius: '8px 8px 0 0', border: 'none', background: 'transparent', color: active ? '#fbbf24' : 'var(--text-secondary)', borderBottom: active ? '2px solid #fbbf24' : '2px solid transparent', fontSize: '0.8rem', fontWeight: active ? 700 : 500, cursor: 'pointer', whiteSpace: 'nowrap' }}
                            >
                                {t.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Dashboard Content area */}
            <div style={{ flex: 1, padding: '1.5rem', maxWidth: '1200px', width: '100%', margin: '0 auto' }}>

                {/* ── 1. Directory Tab ── */}
                {activeTab === 'directory' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                            <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
                                <input
                                    type="text"
                                    placeholder="Search by company or role..."
                                    value={dirSearch}
                                    onChange={e => setDirSearch(e.target.value)}
                                    style={{ width: '100%', padding: '0.55rem 0.8rem 0.55rem 2.2rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '0.82rem' }}
                                />
                            </div>
                            <select
                                value={dirRole}
                                onChange={e => setDirRole(e.target.value)}
                                style={{ padding: '0.55rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '0.82rem' }}
                            >
                                <option value="" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>All Roles</option>
                                <option value="alumnus" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>Alumni</option>
                                <option value="student" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>Students</option>
                            </select>
                            <select
                                value={dirBranch}
                                onChange={e => setDirBranch(e.target.value)}
                                style={{ padding: '0.55rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '0.82rem' }}
                            >
                                <option value="" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>All Branches</option>
                                <option value="CSE" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>CSE</option>
                                <option value="ECE" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>ECE</option>
                                <option value="Mechanical" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>Mechanical</option>
                                <option value="Civil" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>Civil</option>
                                <option value="EEE" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>EEE</option>
                            </select>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 100%))', gap: '1rem' }}>
                            {directory.map(m => (
                                <div key={m.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                                                {m.role === 'alumnus' ? '' : '🎓'} {m.name || `${m.branch} Member`}
                                            </h4>
                                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Class of {m.batchYear} • {m.branch}{m.rollNo ? ` • Roll No: ${m.rollNo}` : ''}</span>
                                        </div>
                                        <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: '12px', fontWeight: 700, background: m.role === 'alumnus' ? 'rgba(16,185,129,0.1)' : 'rgba(59,130,246,0.1)', color: m.role === 'alumnus' ? '#10b981' : '#3b82f6', textTransform: 'uppercase' }}>
                                            {m.role}
                                        </span>
                                    </div>

                                    {m.role === 'alumnus' && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{m.currentRole || 'Associate'}</span>
                                            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{m.currentCompany || 'Technology Co'}</span>
                                        </div>
                                    )}

                                    {m.role === 'alumnus' && m.availabilityTags?.length > 0 && (
                                        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', borderTop: '1px solid var(--border)', paddingTop: '0.6rem', marginTop: '0.25rem' }}>
                                            {m.availabilityTags.map(tag => (
                                                <span key={tag} style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', color: '#fbbf24', fontWeight: 600 }}>
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── 2. Chat tab ── */}
                {activeTab === 'chat' && (
                    <div style={{ display: 'flex', gap: '1rem', height: '62vh', minHeight: '440px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
                        {/* Channel selector */}
                        <div style={{ width: '220px', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.02)' }}>
                            <div style={{ padding: '0.8rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Channels
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', padding: '0 0.5rem' }}>
                                {rooms.map(r => (
                                    <button
                                        key={r.id}
                                        onClick={() => setActiveRoom(r)}
                                        style={{ padding: '0.55rem 0.75rem', borderRadius: '8px', border: 'none', background: activeRoom?.id === r.id ? 'rgba(251,191,36,0.1)' : 'transparent', color: activeRoom?.id === r.id ? '#fbbf24' : 'var(--text-secondary)', textAlign: 'left', fontSize: '0.8rem', fontWeight: activeRoom?.id === r.id ? 700 : 500, cursor: 'pointer' }}
                                    >
                                        {r.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Chat window */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            {activeRoom ? (
                                <>
                                    <div style={{ padding: '0.8rem 1.25rem', borderBottom: '1px solid var(--border)', fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                                        {activeRoom.name}
                                    </div>
                                    {/* Messages list */}
                                    <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                        {messages.map(m => {
                                            const isMe = m.senderId === reqUserId;
                                            return (
                                                <div key={m.id} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
                                                    {!isMe && (
                                                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#111' }}>
                                                            {m.senderName[0].toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div style={{ background: isMe ? '#fbbf24' : 'rgba(255,255,255,0.06)', color: isMe ? '#111' : 'var(--text-primary)', border: isMe ? 'none' : '1px solid var(--border)', borderRadius: '12px', padding: '0.6rem 0.85rem', fontSize: '0.82rem' }}>
                                                        {!isMe && <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>{m.senderName}</div>}
                                                        <div style={{ lineHeight: 1.45 }}>{m.content}</div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        <div ref={chatEndRef} />
                                    </div>
                                    {/* Message input */}
                                    <form onSubmit={handleSendMessage} style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.5rem' }}>
                                        <input
                                            type="text"
                                            placeholder={`Message ${activeRoom.name}...`}
                                            value={chatInput}
                                            onChange={e => setChatInput(e.target.value)}
                                            style={{ flex: 1, padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '0.82rem' }}
                                        />
                                        <button type="submit" className="btn-primary" style={{ padding: '0.55rem 1rem', borderRadius: '8px' }}>
                                            Send
                                        </button>
                                    </form>
                                </>
                            ) : (
                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                    Select a channel to start chatting
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ── 3. Ask Alumni tab ── */}
                {activeTab === 'qa' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* New question form */}
                        <form onSubmit={handlePostQuestion} style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem' }}>
                            <input
                                type="text"
                                placeholder="Ask an anonymous career question..."
                                value={questionInput}
                                onChange={e => setQuestionInput(e.target.value)}
                                style={{ flex: 1, padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '0.85rem' }}
                            />
                            <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.55rem 1.1rem' }}>
                                Post
                            </button>
                        </form>

                        {/* Questions list */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {questions.map(q => (
                                <div key={q.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ display: 'flex', justifySelf: 'space-between', alignItems: 'center' }}>
                                        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, flex: 1 }}>❓ {q.content}</h4>
                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Anonymous Asker</span>
                                    </div>

                                    {/* Answers list */}
                                    {q.answers?.length > 0 ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingLeft: '1rem', borderLeft: '2px solid var(--border)' }}>
                                            {q.answers.map(ans => (
                                                <div key={ans.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fbbf24' }}>{ans.alumnusName}</span>
                                                            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>({ans.alumnusRole} at {ans.alumnusCompany})</span>
                                                        </div>
                                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem', lineHeight: 1.5 }}>{ans.content}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleUpvoteAnswer(ans.id, q.id)}
                                                        style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', fontSize: '0.7rem', cursor: 'pointer' }}
                                                    >
                                                        ▲ {ans.upvotes}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', italic: true }}>No answers yet. Alumni can post answers below.</div>
                                    )}

                                    {/* Answer button or input */}
                                    {member.role === 'alumnus' && (
                                        <div>
                                            {answeringQuestionId === q.id ? (
                                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                                    <input
                                                        type="text"
                                                        placeholder="Write your expert answer..."
                                                        value={answerInput}
                                                        onChange={e => setAnswerInput(e.target.value)}
                                                        style={{ flex: 1, padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '0.8rem' }}
                                                    />
                                                    <button onClick={() => handlePostAnswer(q.id)} className="btn-primary" style={{ padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.8rem' }}>Submit</button>
                                                    <button onClick={() => setAnsweringQuestionId(null)} style={{ padding: '0.5rem 0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', fontSize: '0.8rem', cursor: 'pointer' }}>Cancel</button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setAnsweringQuestionId(q.id)}
                                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.8rem', borderRadius: '6px', border: '1px solid #fbbf24', background: 'transparent', color: '#fbbf24', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}
                                                >
                                                    Answer as Alumnus
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── 4. Referrals tab ── */}
                {activeTab === 'referrals' && (
                    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                        {/* New referral request card */}
                        <div style={{ flex: '1 1 320px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem', height: 'fit-content' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>Request Job Referral</h3>
                            <form onSubmit={handlePostReferralRequest} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Target Company</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Google"
                                        value={newReferral.targetCompany}
                                        onChange={e => setNewReferral(prev => ({ ...prev, targetCompany: e.target.value }))}
                                        style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '0.82rem' }}
                                        required
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Target Role</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. SWE Intern"
                                        value={newReferral.targetRole}
                                        onChange={e => setNewReferral(prev => ({ ...prev, targetRole: e.target.value }))}
                                        style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '0.82rem' }}
                                        required
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Brief Description / Job URL</label>
                                    <textarea
                                        placeholder="Explain your fit or provide the Job ID link..."
                                        value={newReferral.description}
                                        onChange={e => setNewReferral(prev => ({ ...prev, description: e.target.value }))}
                                        rows={3}
                                        style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '0.82rem', fontFamily: 'inherit' }}
                                    />
                                </div>
                                <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.25rem' }}>Post Request</button>
                            </form>
                        </div>

                        {/* Referral requests feed */}
                        <div style={{ flex: '2 1 480px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {referrals.map(r => (
                                <div key={r.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                                        <div>
                                            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                                                Referral at {r.targetCompany}
                                            </h4>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Role: {r.targetRole} • Requested by {r.studentName}</span>
                                        </div>
                                        <span style={{
                                            fontSize: '0.65rem', padding: '2px 8px', borderRadius: '12px', fontWeight: 700,
                                            background: r.status === 'fulfilled' ? 'rgba(16,185,129,0.1)' : r.status === 'in_progress' ? 'rgba(245,158,11,0.1)' : 'rgba(255,255,255,0.06)',
                                            color: r.status === 'fulfilled' ? '#10b981' : r.status === 'in_progress' ? '#f59e0b' : 'var(--text-secondary)',
                                            border: '1px solid currentColor'
                                        }}>
                                            {r.status.toUpperCase()}
                                        </span>
                                    </div>

                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>{r.description}</p>

                                    {/* Offers of referrals */}
                                    {r.responses?.length > 0 && (
                                        <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>Offers from Alumni:</span>
                                            {r.responses.map(resp => (
                                                <div key={resp.id} style={{ fontSize: '0.78rem', color: 'var(--text-primary)', borderBottom: '1px solid var(--border)', pb: '4px', last: { border: 'none' } }}>
                                                    <strong>{resp.alumnusName}</strong>: {resp.message}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                                        {member.role === 'alumnus' && r.status !== 'fulfilled' && (
                                            <div>
                                                {respondingReferralId === r.id ? (
                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                        <input
                                                            type="text"
                                                            placeholder="Leave message for student..."
                                                            value={referralMessage}
                                                            onChange={e => setReferralMessage(e.target.value)}
                                                            style={{ padding: '0.45rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '0.78rem' }}
                                                        />
                                                        <button onClick={() => handleRespondReferral(r.id)} className="btn-primary" style={{ padding: '0.45rem 0.85rem', borderRadius: '6px', fontSize: '0.78rem' }}>Refer</button>
                                                        <button onClick={() => setRespondingReferralId(null)} style={{ padding: '0.45rem 0.85rem', borderRadius: '6px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', fontSize: '0.78rem', cursor: 'pointer' }}>Cancel</button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setRespondingReferralId(r.id)}
                                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.45rem 0.85rem', borderRadius: '6px', border: '1px solid #fbbf24', background: 'transparent', color: '#fbbf24', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                                                    >
                                                        Offer Referral
                                                    </button>
                                                )}
                                            </div>
                                        )}

                                        {r.studentId === reqUserId && r.status !== 'fulfilled' && (
                                            <button
                                                onClick={() => handleUpdateReferralStatus(r.id, 'fulfilled')}
                                                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.45rem 0.85rem', borderRadius: '6px', border: 'none', background: '#10b981', color: '#111827', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                                            >
                                                Mark Fulfilled
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── 5. Leaderboard tab ── */}
                {activeTab === 'leaderboard' && (
                    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Top Alumni Contributors</h3>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {leaderboard.map((item, idx) => (
                                <div key={item.userId} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 800, width: '28px', color: idx === 0 ? '#fbbf24' : idx === 1 ? '#94a3b8' : idx === 2 ? '#b45309' : 'var(--text-muted)' }}>
                                        #{idx + 1}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>{item.name || 'Alumni Member'}</div>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.currentRole} at {item.currentCompany} ({item.branch})</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1.5rem', textAlign: 'center', flexWrap: 'wrap' }}>
                                        <div>
                                            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>{item.referralCount}</div>
                                            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>referrals</span>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>{item.answerCount}</div>
                                            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>answers</span>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fbbf24' }}>{item.points}</div>
                                            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>points</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── 6. AI Assistant tab ── */}
                {activeTab === 'ai' && (
                    <div style={{ display: 'flex', flexDirection: 'column', height: '62vh', minHeight: '440px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
                        <div style={{ padding: '0.8rem 1.25rem', borderBottom: '1px solid var(--border)', fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            AI Alumni Assistant
                        </div>
                        {/* Conversation list */}
                        <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            {aiMessages.map((m, idx) => (
                                <div key={idx} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
                                    {m.sender === 'ai' && (
                                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.8rem', color: '#fbbf24' }}>
                                            AI
                                        </div>
                                    )}
                                    <div style={{ background: m.sender === 'user' ? '#fbbf24' : 'rgba(255,255,255,0.06)', color: m.sender === 'user' ? '#111' : 'var(--text-primary)', border: m.sender === 'user' ? 'none' : '1px solid var(--border)', borderRadius: '12px', padding: '0.6rem 0.85rem', fontSize: '0.82rem' }}>
                                        <div style={{ lineHeight: 1.45 }}>{m.text}</div>
                                    </div>
                                </div>
                            ))}
                            {aiLoading && (
                                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                                    Thinking...
                                </div>
                            )}
                        </div>
                        {/* Input */}
                        <form onSubmit={handleSendAiMessage} style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="text"
                                placeholder="Ask AI: 'Who works at Google?' or 'How to request referral?'..."
                                value={aiInput}
                                onChange={e => setAiInput(e.target.value)}
                                style={{ flex: 1, padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '0.82rem' }}
                            />
                            <button type="submit" className="btn-primary" style={{ padding: '0.55rem 1rem', borderRadius: '8px' }}>
                                Send
                            </button>
                        </form>
                    </div>
                )}

            </div>
        </div>
    );
}


