/* ==========================================
   CareerMap India – Complete JavaScript App
   ========================================== */

// ==================== DATA ====================
const CAREERS = [
    {
        id: 'data-analyst', icon: '📊', name: 'Data Analyst',
        category: 'private', salary: '₹4–15 LPA', risk: 'Medium',
        riskScore: 2, branches: ['CSE', 'ECE', 'EEE', 'Mechanical', 'Civil'],
        desc: 'Collect, clean, analyze, and visualize data to help companies make strategic decisions.',
        freshSalary: 6, threeYSalary: 12, fiveYSalary: 22,
        demand: 'High', studyReq: 'No', workLife: 'Medium', competition: 'High',
        prepTime: '6–12 months',
        skills: ['SQL', 'Python', 'Power BI', 'Excel', 'Statistics', 'Tableau', 'NumPy', 'Pandas'],
        roadmap: [
            { period: 'Month 1–2', items: ['Excel Advanced', 'Pivot Tables', 'Data Cleaning'] },
            { period: 'Month 3–4', items: ['SQL (SELECT, JOIN, GROUP BY)', 'Real Datasets'] },
            { period: 'Month 5–6', items: ['Power BI / Tableau', 'Build 2 Dashboards'] },
            { period: 'Month 7–8', items: ['Python (Pandas, NumPy)', 'Data Visualization'] },
            { period: 'Month 9–10', items: ['3 Real Projects (Sales, HR, E-commerce)'] },
            { period: 'Month 11–12', items: ['Resume', 'LinkedIn', 'Apply 200+ Companies', 'Mock Interviews'] },
        ],
        who: 'Enjoy numbers, analytical thinking, prefer corporate work.',
        scores: {
            CSE: 15, ECE: 12, Mechanical: 10, Civil: 8, EEE: 12,
            Coding: 20, Management: 8, Government: -10, Research: 10, Entrepreneurship: 5,
            lowRisk: 5, medRisk: 15, highRisk: 10,
            salLow: 5, salMed: 10, salHigh: 15,
            studyNo: 15, studyYes: 5,
            wlbLow: 5, wlbMed: 15, wlbHigh: 10,
            budgetLow: 15, budgetHigh: 5
        }
    },
    {
        id: 'software-dev', icon: '💻', name: 'Software Developer',
        category: 'private', salary: '₹5–25 LPA', risk: 'Medium',
        riskScore: 2, branches: ['CSE', 'ECE'],
        desc: 'Design, code, and maintain software applications for web, mobile, or enterprise systems.',
        freshSalary: 8, threeYSalary: 18, fiveYSalary: 30,
        demand: 'Very High', studyReq: 'No', workLife: 'Low', competition: 'Very High',
        prepTime: '6–10 months',
        skills: ['DSA', 'Java/Python/JS', 'React', 'Node.js', 'Git', 'System Design', 'REST APIs', 'SQL'],
        roadmap: [
            { period: 'Month 1–2', items: ['DSA Basics', 'Language Mastery (Java/Python)'] },
            { period: 'Month 3–4', items: ['Web Development (Frontend/Backend)', 'Projects'] },
            { period: 'Month 5–6', items: ['Advanced DSA', 'System Design Basics'] },
            { period: 'Month 7–8', items: ['Full Stack Projects', 'GitHub Portfolio'] },
            { period: 'Month 9–10', items: ['LeetCode 300+', 'Resume', 'Apply to Companies'] },
        ],
        who: 'Love coding, enjoy problem-solving, want high salary.',
        scores: {
            CSE: 20, ECE: 15, Mechanical: 5, Civil: 3, EEE: 8,
            Coding: 25, Management: 3, Government: -15, Research: 8, Entrepreneurship: 10,
            lowRisk: 8, medRisk: 15, highRisk: 12,
            salLow: 3, salMed: 12, salHigh: 20,
            studyNo: 18, studyYes: 5,
            wlbLow: 15, wlbMed: 10, wlbHigh: 5,
            budgetLow: 18, budgetHigh: 8
        }
    },
    {
        id: 'psu-engineer', icon: '🏭', name: 'PSU Engineer',
        category: 'govt', salary: '₹6–12 LPA', risk: 'Low',
        riskScore: 1, branches: ['Mechanical', 'Civil', 'EEE', 'ECE', 'CSE'],
        desc: 'Work in government-owned corporations (BHEL, ONGC, NTPC) with excellent job security and benefits.',
        freshSalary: 7, threeYSalary: 9, fiveYSalary: 12,
        demand: 'Steady', studyReq: 'Yes (GATE)', workLife: 'High', competition: 'High',
        prepTime: '12–18 months',
        skills: ['GATE Preparation', 'Core Engineering', 'Aptitude', 'English', 'Domain Knowledge'],
        roadmap: [
            { period: 'Month 1–3', items: ['GATE Syllabus Analysis', 'Engineering Maths', 'Core Subjects'] },
            { period: 'Month 4–8', items: ['Subject-wise Practice', 'Previous Year Papers'] },
            { period: 'Month 9–12', items: ['Mock Tests', 'Weak Area Focus', 'Revision'] },
            { period: 'Month 13–18', items: ['GATE Exam', 'PSU Notifications', 'Interview Prep'] },
        ],
        who: 'Want stability, prefer government sector, willing to prepare 1–2 years.',
        scores: {
            CSE: 8, ECE: 12, Mechanical: 18, Civil: 16, EEE: 16,
            Coding: 5, Management: 8, Government: 25, Research: 10, Entrepreneurship: -10,
            lowRisk: 20, medRisk: 12, highRisk: 5,
            salLow: 15, salMed: 12, salHigh: 5,
            studyNo: 5, studyYes: 15,
            wlbLow: 5, wlbMed: 12, wlbHigh: 20,
            budgetLow: 18, budgetHigh: 8
        }
    },
    {
        id: 'mba-cat', icon: '📈', name: 'MBA via CAT',
        category: 'higher', salary: '₹10–30 LPA', risk: 'High',
        riskScore: 3, branches: ['CSE', 'ECE', 'Mechanical', 'Civil', 'EEE'],
        desc: 'Management degree from IIMs/top B-schools for a business career in strategy, consulting, or finance.',
        freshSalary: 12, threeYSalary: 22, fiveYSalary: 35,
        demand: 'High', studyReq: 'Yes', workLife: 'Low', competition: 'Very High',
        prepTime: '12–18 months',
        skills: ['CAT Prep (Quant, VARC, DILR)', 'Leadership', 'Communication', 'Excel', 'Finance Basics'],
        roadmap: [
            { period: 'Month 1–4', items: ['CAT Quant Foundation', 'VARC Reading Habit', 'DILR Practice'] },
            { period: 'Month 5–8', items: ['Mock CAT Tests', 'Sectional Tests', 'Weak Area Focus'] },
            { period: 'Month 9–12', items: ['Full Mocks', 'GD-PI Preparation', 'Shortlist Notifications'] },
            { period: 'Month 13–18', items: ['B-School Interviews', 'Group Discussions', 'Admission'] },
        ],
        who: 'Want business leadership role, comfortable with high investment and competition.',
        scores: {
            CSE: 10, ECE: 8, Mechanical: 12, Civil: 10, EEE: 10,
            Coding: 5, Management: 25, Government: 5, Research: 8, Entrepreneurship: 15,
            lowRisk: 3, medRisk: 10, highRisk: 20,
            salLow: 3, salMed: 12, salHigh: 22,
            studyNo: -5, studyYes: 20,
            wlbLow: 15, wlbMed: 8, wlbHigh: 3,
            budgetLow: -10, budgetHigh: 20
        }
    },
    {
        id: 'cloud-engineer', icon: '☁️', name: 'Cloud Engineer',
        category: 'private', salary: '₹6–20 LPA', risk: 'Medium',
        riskScore: 2, branches: ['CSE', 'ECE', 'EEE'],
        desc: 'Design and manage cloud infrastructure on AWS, Azure, or GCP for enterprises.',
        freshSalary: 7, threeYSalary: 14, fiveYSalary: 22,
        demand: 'Very High', studyReq: 'No', workLife: 'Medium', competition: 'Medium',
        prepTime: '6–9 months',
        skills: ['AWS/Azure/GCP', 'Linux', 'Networking', 'Docker', 'Kubernetes', 'Terraform', 'Python'],
        roadmap: [
            { period: 'Month 1–2', items: ['Linux Fundamentals', 'Networking Basics', 'Cloud Concepts'] },
            { period: 'Month 3–4', items: ['AWS Core Services', 'AWS Solutions Architect Cert'] },
            { period: 'Month 5–6', items: ['Docker & Kubernetes', 'CI/CD Pipelines'] },
            { period: 'Month 7–9', items: ['Projects on Cloud', 'Resume & Apply'] },
        ],
        who: 'Enjoy infrastructure and DevOps, want high salary without MBA.',
        scores: {
            CSE: 18, ECE: 14, Mechanical: 5, Civil: 3, EEE: 12,
            Coding: 18, Management: 5, Government: -8, Research: 8, Entrepreneurship: 8,
            lowRisk: 8, medRisk: 15, highRisk: 10,
            salLow: 5, salMed: 12, salHigh: 18,
            studyNo: 18, studyYes: 6,
            wlbLow: 10, wlbMed: 16, wlbHigh: 8,
            budgetLow: 16, budgetHigh: 8
        }
    },
    {
        id: 'ms-abroad', icon: '✈️', name: 'MS Abroad (USA/Germany)',
        category: 'higher', salary: '₹20–50 LPA', risk: 'High',
        riskScore: 3, branches: ['CSE', 'ECE'],
        desc: 'Masters in Engineering from a top foreign university, leading to global career opportunities.',
        freshSalary: 25, threeYSalary: 40, fiveYSalary: 60,
        demand: 'High', studyReq: 'Yes', workLife: 'Low', competition: 'High',
        prepTime: '12–24 months',
        skills: ['GRE/IELTS', 'Research Papers', 'SOP Writing', 'Networking', 'Core Subject Mastery'],
        roadmap: [
            { period: 'Month 1–4', items: ['GRE Prep', 'IELTS/TOEFL', 'Build CGPA & Profile'] },
            { period: 'Month 5–8', items: ['Research & Choose Universities', 'SOP Writing', 'LOR Collection'] },
            { period: 'Month 9–12', items: ['Apply to Universities', 'Financial Aid / Loans'] },
            { period: 'Month 13–24', items: ['MS Program', 'Internships', 'Job Search in USA/Germany'] },
        ],
        who: 'Want international career, have strong acads, can take education loan.',
        scores: {
            CSE: 18, ECE: 16, Mechanical: 8, Civil: 6, EEE: 10,
            Coding: 15, Management: 8, Government: -15, Research: 22, Entrepreneurship: 10,
            lowRisk: -5, medRisk: 8, highRisk: 22,
            salLow: -5, salMed: 10, salHigh: 25,
            studyNo: -10, studyYes: 25,
            wlbLow: 15, wlbMed: 8, wlbHigh: 3,
            budgetLow: -15, budgetHigh: 25
        }
    },
    {
        id: 'ssc-je', icon: '📋', name: 'SSC Junior Engineer',
        category: 'govt', salary: '₹4–8 LPA', risk: 'Low',
        riskScore: 1, branches: ['Civil', 'Mechanical', 'EEE'],
        desc: 'Central government technical post in PWD, CPWD, CWC with excellent job security and allowances.',
        freshSalary: 5, threeYSalary: 7, fiveYSalary: 9,
        demand: 'Steady', studyReq: 'Yes (SSC JE Exam)', workLife: 'High', competition: 'Medium',
        prepTime: '6–12 months',
        skills: ['Civil/Mech/Electrical Fundamentals', 'Reasoning', 'General Awareness', 'Aptitude'],
        roadmap: [
            { period: 'Month 1–4', items: ['Core Subject Revision', 'Aptitude & Reasoning'] },
            { period: 'Month 5–8', items: ['SSC JE Previous Papers', 'Mock Tests', 'GS Preparation'] },
            { period: 'Month 9–12', items: ['Final Revision', 'Document Verification Prep', 'Exam Attempt'] },
        ],
        who: 'From Civil/Mech/EEE, want government job stability, moderate preparation.',
        scores: {
            CSE: 3, ECE: 5, Mechanical: 18, Civil: 20, EEE: 18,
            Coding: -5, Management: 5, Government: 25, Research: 5, Entrepreneurship: -10,
            lowRisk: 22, medRisk: 12, highRisk: 3,
            salLow: 20, salMed: 10, salHigh: 2,
            studyNo: 8, studyYes: 12,
            wlbLow: 5, wlbMed: 14, wlbHigh: 20,
            budgetLow: 20, budgetHigh: 8
        }
    },
    {
        id: 'startup', icon: '🚀', name: 'Tech Startup / Entrepreneurship',
        category: 'entrepreneurship', salary: '₹0–Unlimited', risk: 'High',
        riskScore: 3, branches: ['CSE', 'ECE', 'Mechanical', 'Civil', 'EEE'],
        desc: 'Build your own tech startup or join an early-stage startup as a founding member.',
        freshSalary: 0, threeYSalary: 20, fiveYSalary: 50,
        demand: 'High', studyReq: 'No', workLife: 'Low', competition: 'High',
        prepTime: 'Ongoing',
        skills: ['Full Stack Development', 'Product Thinking', 'Business Model', 'Networking', 'Fundraising'],
        roadmap: [
            { period: 'Phase 1', items: ['Validate Problem', 'Build MVP', 'Get 10 Users'] },
            { period: 'Phase 2', items: ['Iterate Product', 'Build Team', 'Seek Funding'] },
            { period: 'Phase 3', items: ['Scale', 'Revenue Model', 'Growth Hacking'] },
        ],
        who: 'High risk appetite, entrepreneurial mindset, willing to work long hours.',
        scores: {
            CSE: 15, ECE: 10, Mechanical: 8, Civil: 6, EEE: 8,
            Coding: 15, Management: 18, Government: -20, Research: 8, Entrepreneurship: 30,
            lowRisk: -15, medRisk: 5, highRisk: 25,
            salLow: -5, salMed: 10, salHigh: 18,
            studyNo: 12, studyYes: 5,
            wlbLow: 20, wlbMed: 8, wlbHigh: -10,
            budgetLow: 8, budgetHigh: 15
        }
    },
    {
        id: 'gate-mtech', icon: '🔬', name: 'M.Tech via GATE',
        category: 'higher', salary: '₹8–20 LPA', risk: 'Low',
        riskScore: 1, branches: ['CSE', 'ECE', 'Mechanical', 'Civil', 'EEE'],
        desc: 'Postgraduate engineering degree from IITs/NITs for research or specialized technical roles.',
        freshSalary: 9, threeYSalary: 15, fiveYSalary: 22,
        demand: 'Medium', studyReq: 'Yes', workLife: 'High', competition: 'Medium',
        prepTime: '12–18 months',
        skills: ['GATE Preparation', 'Research Aptitude', 'Core Subjects', 'Technical Writing', 'Lab Work'],
        roadmap: [
            { period: 'Month 1–6', items: ['Full Syllabus Coverage', 'Engineering Maths', '2 Subjects/Month'] },
            { period: 'Month 7–12', items: ['Mock Tests', 'Previous Papers', 'Subject Revision'] },
            { period: 'Month 13–18', items: ['GATE Exam', 'IIT/NIT Counselling', 'Research Projects'] },
        ],
        who: 'Want deep technical expertise, interested in research or premium companies.',
        scores: {
            CSE: 14, ECE: 16, Mechanical: 16, Civil: 14, EEE: 16,
            Coding: 10, Management: 3, Government: 10, Research: 25, Entrepreneurship: 3,
            lowRisk: 18, medRisk: 12, highRisk: 5,
            salLow: 10, salMed: 14, salHigh: 8,
            studyNo: -5, studyYes: 22,
            wlbLow: 5, wlbMed: 14, wlbHigh: 18,
            budgetLow: 16, budgetHigh: 8
        }
    },
    {
        id: 'product-manager', icon: '🗂️', name: 'Product Manager',
        category: 'private', salary: '₹10–30 LPA', risk: 'Medium',
        riskScore: 2, branches: ['CSE', 'ECE'],
        desc: 'Lead product strategy, define roadmaps, and work across engineering, design, and business teams.',
        freshSalary: 8, threeYSalary: 18, fiveYSalary: 28,
        demand: 'High', studyReq: 'No', workLife: 'Medium', competition: 'High',
        prepTime: '8–14 months',
        skills: ['Product Strategy', 'User Research', 'Data Analysis', 'Communication', 'Agile/Scrum', 'SQL', 'Roadmapping'],
        roadmap: [
            { period: 'Month 1–3', items: ['PM Fundamentals', 'Product Frameworks', 'Case Studies'] },
            { period: 'Month 4–6', items: ['Side Projects', 'SQL & Analytics', 'User Testing'] },
            { period: 'Month 7–10', items: ['PM Community', 'Referrals', 'Interview Prep', 'Apply'] },
        ],
        who: 'Tech background + business thinking, excellent communication, leadership interest.',
        scores: {
            CSE: 16, ECE: 12, Mechanical: 8, Civil: 5, EEE: 8,
            Coding: 10, Management: 22, Government: -5, Research: 8, Entrepreneurship: 15,
            lowRisk: 5, medRisk: 16, highRisk: 12,
            salLow: 3, salMed: 12, salHigh: 20,
            studyNo: 14, studyYes: 8,
            wlbLow: 10, wlbMed: 16, wlbHigh: 8,
            budgetLow: 12, budgetHigh: 10
        }
    },
];

// ==================== QUIZ CONFIG ====================
const QUIZ_QUESTIONS = [
    {
        id: 'branch', title: 'Select Your Branch', sub: 'This helps us calibrate career recommendations to your core education.',
        type: 'grid',
        options: [
            { icon: '💻', text: 'CSE', sub: 'Computer Science', value: 'CSE' },
            { icon: '📡', text: 'ECE', sub: 'Electronics & Communication', value: 'ECE' },
            { icon: '⚙️', text: 'Mechanical', sub: 'Mechanical Engineering', value: 'Mechanical' },
            { icon: '🏗️', text: 'Civil', sub: 'Civil Engineering', value: 'Civil' },
            { icon: '⚡', text: 'EEE', sub: 'Electrical Engineering', value: 'EEE' },
        ]
    },
    {
        id: 'interest', title: 'What is your primary interest?', sub: 'Choose the field that excites you most.',
        type: 'grid',
        options: [
            { icon: '👨‍💻', text: 'Coding', sub: 'Software, Data, Cloud', value: 'Coding' },
            { icon: '📊', text: 'Management', sub: 'Business, Strategy, Finance', value: 'Management' },
            { icon: '🏛️', text: 'Government', sub: 'PSU, Civil Services, Defense', value: 'Government' },
            { icon: '🔬', text: 'Research', sub: 'M.Tech, MS, PhD', value: 'Research' },
            { icon: '🚀', text: 'Entrepreneurship', sub: 'Startups, Freelancing', value: 'Entrepreneurship' },
        ]
    },
    {
        id: 'risk', title: 'How much risk can you handle?', sub: 'Risk = uncertainty in career outcome and income stability.',
        type: 'horizontal',
        options: [
            { icon: '🛡️', text: 'Low Risk', sub: 'Stable job, lower upside', value: 'lowRisk' },
            { icon: '⚖️', text: 'Medium Risk', sub: 'Balanced reward/risk', value: 'medRisk' },
            { icon: '🎲', text: 'High Risk', sub: 'High reward potential', value: 'highRisk' },
        ]
    },
    {
        id: 'salary', title: 'Your salary expectation?', sub: 'What starting salary do you realistically aim for?',
        type: 'horizontal',
        options: [
            { icon: '💵', text: '< ₹5 LPA', sub: 'Any stable income works', value: 'salLow' },
            { icon: '💰', text: '₹5–8 LPA', sub: 'Decent starting salary', value: 'salMed' },
            { icon: '💎', text: '> ₹8 LPA', sub: 'Aiming for premium pack', value: 'salHigh' },
        ]
    },
    {
        id: 'study', title: 'Are you willing to study more?', sub: 'Some careers require additional education (GATE, CAT, MS, etc.).',
        type: 'horizontal',
        options: [
            { icon: '🎓', text: 'Yes, happy to', sub: 'Ready for more exams/degrees', value: 'studyYes' },
            { icon: '💼', text: 'No, start working', sub: 'Want to start career directly', value: 'studyNo' },
        ]
    },
    {
        id: 'wlb', title: 'Work-Life Balance importance?', sub: 'How much do you value personal time vs career progression?',
        type: 'horizontal',
        options: [
            { icon: '🔥', text: 'Low (Hustle)', sub: 'Career first, long hours OK', value: 'wlbLow' },
            { icon: '⚖️', text: 'Medium', sub: 'Reasonable balance', value: 'wlbMed' },
            { icon: '🌿', text: 'High', sub: 'Personal time is important', value: 'wlbHigh' },
        ]
    },
    {
        id: 'finance', title: 'Financial situation?', sub: 'Can you afford higher studies (MS abroad, MBA)?',
        type: 'horizontal',
        options: [
            { icon: '✈️', text: 'Can afford', sub: 'Education loan or family support OK', value: 'budgetHigh' },
            { icon: '💸', text: 'Limited budget', sub: 'Need to start earning soon', value: 'budgetLow' },
        ]
    },
];

// ==================== STATE ====================
let state = {
    currentPage: 'home',
    quiz: { step: 0, answers: {}, started: false },
    careers: { filtered: [...CAREERS], categoryFilter: 'all', riskFilter: 'all', branchFilter: 'all' },
    compare: { selected: [] },
    quizResults: [],
};

// ==================== NAVIGATION ====================
function showPage(pageId, updateHistory = true) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById('page-' + pageId);
    if (target) {
        target.classList.add('active');
        state.currentPage = pageId;
        window.scrollTo(0, 0);
    }
    if (pageId === 'careers') renderCareers();
    if (pageId === 'compare') renderCompare();
    if (pageId === 'quiz') initQuiz();
}

function toggleMenu() {
    const links = document.getElementById('navLinks');
    const cta = document.getElementById('navCta');
    links.classList.toggle('open');
    cta.style.display = links.classList.contains('open') ? 'block' : '';
}

// ==================== PARTICLES ====================
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    for (let i = 0; i < 20; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = Math.random() * 4 + 2;
        p.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${Math.random() * 100}%;
      background: rgba(${Math.random() > 0.5 ? '99,102,241' : '16,185,129'},${Math.random() * 0.4 + 0.1});
      animation-duration: ${Math.random() * 15 + 10}s;
      animation-delay: -${Math.random() * 15}s;
    `;
        container.appendChild(p);
    }
}

// ==================== QUIZ ====================
function initQuiz() {
    state.quiz.step = 0;
    state.quiz.answers = {};
    renderQuizStep();
}

function renderQuizStep() {
    const step = state.quiz.step;
    const totalSteps = QUIZ_QUESTIONS.length;

    // Update progress
    const pct = (step / totalSteps) * 100;
    document.getElementById('quiz-progress-fill').style.width = pct + '%';
    document.getElementById('quiz-step-label').textContent = step < totalSteps
        ? `Step ${step + 1} of ${totalSteps}`
        : 'Analyzing...';

    const container = document.getElementById('quiz-container');

    if (step >= totalSteps) {
        // Show processing
        container.innerHTML = `
      <div class="quiz-step quiz-processing">
        <div class="processing-ring"></div>
        <h2>Analyzing your responses...</h2>
        <p>Running our career matching algorithm ✨</p>
      </div>`;
        document.getElementById('quiz-progress-fill').style.width = '100%';
        setTimeout(calculateResults, 2000);
        return;
    }

    const q = QUIZ_QUESTIONS[step];
    const optionsHtml = q.options.map(opt => `
    <button class="quiz-opt ${state.quiz.answers[q.id] === opt.value ? 'selected' : ''}"
      onclick="selectOption('${q.id}', '${opt.value}', this)">
      <span class="opt-icon">${opt.icon}</span>
      <div>
        <div class="opt-text">${opt.text}</div>
        <div class="opt-sub">${opt.sub}</div>
      </div>
    </button>
  `).join('');

    container.innerHTML = `
    <div class="quiz-step">
      <div class="quiz-question">
        <div class="quiz-q-num">QUESTION ${step + 1}</div>
        <div class="quiz-q-text">${q.title}</div>
        <div class="quiz-q-sub">${q.sub}</div>
        <div class="quiz-options ${q.type === 'horizontal' ? 'horizontal' : ''}">
          ${optionsHtml}
        </div>
        <div class="quiz-nav">
          <button class="quiz-btn-back" onclick="quizBack()" ${step === 0 ? 'style="visibility:hidden"' : ''}>
            ← Previous
          </button>
          <button class="quiz-btn-next" id="quiz-next-btn"
            onclick="quizNext()" ${!state.quiz.answers[q.id] ? 'disabled' : ''}>
            ${step === totalSteps - 1 ? 'Get My Results 🎯' : 'Next →'}
          </button>
        </div>
      </div>
    </div>`;
}

function selectOption(questionId, value, btn) {
    state.quiz.answers[questionId] = value;
    document.querySelectorAll('.quiz-opt').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    const nextBtn = document.getElementById('quiz-next-btn');
    if (nextBtn) nextBtn.disabled = false;
}

function quizNext() {
    const q = QUIZ_QUESTIONS[state.quiz.step];
    if (!state.quiz.answers[q.id]) return;
    state.quiz.step++;
    renderQuizStep();
    window.scrollTo(0, 0);
}

function quizBack() {
    if (state.quiz.step > 0) {
        state.quiz.step--;
        renderQuizStep();
    }
}

function calculateResults() {
    const answers = state.quiz.answers;
    const scored = CAREERS.map(career => {
        let score = 0;
        const s = career.scores;
        if (answers.branch) score += (s[answers.branch] || 0);
        if (answers.interest) score += (s[answers.interest] || 0);
        if (answers.risk) score += (s[answers.risk] || 0);
        if (answers.salary) score += (s[answers.salary] || 0);
        if (answers.study) score += (s[answers.study] || 0);
        if (answers.wlb) score += (s[answers.wlb] || 0);
        if (answers.finance) score += (s[answers.finance] || 0);
        return { ...career, totalScore: score };
    });

    scored.sort((a, b) => b.totalScore - a.totalScore);
    const maxScore = scored[0].totalScore;
    state.quizResults = scored.slice(0, 3).map(c => ({
        ...c, matchPct: Math.round(Math.min((c.totalScore / maxScore) * 100, 98))
    }));

    renderQuizResults();
    showPage('quiz-result');
}

function renderQuizResults() {
    const container = document.getElementById('result-cards');
    const ranks = ['🥇', '🥈', '🥉'];
    container.innerHTML = state.quizResults.map((career, i) => `
    <div class="result-card ${i === 0 ? 'rank-1' : ''}">
      <div class="result-rank ${i === 0 ? 'gold' : ''}">${ranks[i]}</div>
      <div class="result-career-info">
        <div class="result-career-name">${career.icon} ${career.name}</div>
        <div class="result-match">
          <div class="match-bar">
            <div class="match-fill" style="width: ${career.matchPct}%"></div>
          </div>
          <span class="match-pct">${career.matchPct}% Match</span>
        </div>
        <div class="result-why">${getWhyText(career, state.quiz.answers)}</div>
        <div class="result-card-actions">
          <button class="rc-btn primary" onclick="openCareerDetail('${career.id}')">View Roadmap →</button>
          <button class="rc-btn outline" onclick="addToCompare('${career.id}')">+ Compare</button>
        </div>
      </div>
    </div>
  `).join('');
}

function getWhyText(career, answers) {
    const reasons = [];
    if (answers.branch && career.branches.includes(answers.branch)) {
        reasons.push(`good fit for ${answers.branch}`);
    }
    if (career.riskScore === 1 && answers.risk === 'lowRisk') reasons.push('matches your low-risk preference');
    if (career.riskScore === 3 && answers.risk === 'highRisk') reasons.push('fits your high-risk appetite');
    if (career.studyReq === 'No' && answers.study === 'studyNo') reasons.push("no further studies required");
    if (reasons.length === 0) reasons.push(`strong overall match for your profile`);
    return `Recommended because ${reasons.join(', ')}.`;
}

// ==================== CAREERS ====================
function renderCareers() {
    const grid = document.getElementById('careers-grid');
    if (!grid) return;
    const filtered = getFilteredCareers();
    if (filtered.length === 0) {
        grid.innerHTML = '<div class="compare-empty"><p>No careers match your current filters. Try adjusting.</p></div>';
        return;
    }
    grid.innerHTML = filtered.map(c => careerCardHTML(c)).join('');
}

function careerCardHTML(c) {
    const riskClass = { 'Low': 'low', 'Medium': 'medium', 'High': 'high' }[c.risk] || 'medium';
    return `
    <div class="career-card-item" onclick="openCareerDetail('${c.id}')">
      <div class="cci-header">
        <span class="cci-icon">${c.icon}</span>
        <div class="cci-tags">
          <span class="cci-tag tag-${riskClass}">${c.risk} Risk</span>
          <span class="cci-tag tag-cat">${c.category === 'private' ? 'Private' : c.category === 'govt' ? 'Govt' : c.category === 'higher' ? 'Higher Studies' : 'Startup'}</span>
        </div>
      </div>
      <div class="cci-name">${c.name}</div>
      <div class="cci-salary">${c.salary}</div>
      <div class="cci-desc">${c.desc}</div>
      <div class="cci-footer">
        <span class="cci-branch">Branches: ${c.branches.join(', ')}</span>
        <span class="cci-btn">Details →</span>
      </div>
    </div>`;
}

function getFilteredCareers() {
    return CAREERS.filter(c => {
        const catOk = state.careers.categoryFilter === 'all' || c.category === state.careers.categoryFilter;
        const riskOk = state.careers.riskFilter === 'all' || c.risk === state.careers.riskFilter;
        const branchOk = state.careers.branchFilter === 'all' || c.branches.includes(state.careers.branchFilter);
        return catOk && riskOk && branchOk;
    });
}

function filterCareers(cat, btn) {
    state.careers.categoryFilter = cat;
    if (btn) {
        document.querySelectorAll('#cat-filter .filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    }
    if (state.currentPage === 'careers') renderCareers();
    else showPage('careers');
}

function filterByRisk(risk, btn) {
    state.careers.riskFilter = risk;
    if (btn) {
        document.querySelectorAll('#risk-filter .filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    }
    renderCareers();
}

function filterByBranch(val) {
    state.careers.branchFilter = val;
    renderCareers();
}

// ==================== CAREER DETAIL ====================
function openCareerDetail(careerId) {
    const career = CAREERS.find(c => c.id === careerId);
    if (!career) return;

    const riskColors = { 'Low': '#10b981', 'Medium': '#f59e0b', 'High': '#ef4444' };
    const riskColor = riskColors[career.risk] || '#94a3b8';

    const maxSal = 60;
    const freshPct = Math.round((career.freshSalary / maxSal) * 100);
    const threePct = Math.round((career.threeYSalary / maxSal) * 100);
    const fivePct = Math.round((career.fiveYSalary / maxSal) * 100);

    const roadmapHtml = career.roadmap.map((r, i) => `
    <div class="roadmap-month">
      <div class="rm-dot">${String(i + 1).padStart(2, '0')}</div>
      <div class="rm-content">
        <h4>${r.period}</h4>
        <div class="rm-items">${r.items.map(it => `<div class="rm-item">${it}</div>`).join('')}</div>
      </div>
    </div>`).join('');

    const content = `
    <div class="career-detail-wrapper">
      <div class="cd-back">
        <button class="back-btn" onclick="showPage('careers')">← Back to Careers</button>
      </div>
      <div class="cd-header">
        <div class="cd-title-group">
          <div class="cd-tags">
            <span class="cd-tag tag-cat" style="background:rgba(99,102,241,0.14);color:var(--primary-light)">${career.icon} ${career.category === 'private' ? 'Private Sector' : career.category === 'govt' ? 'Government' : career.category === 'higher' ? 'Higher Studies' : 'Entrepreneurship'}</span>
            <span class="cd-tag" style="background:${riskColor}20;color:${riskColor}">${career.risk} Risk</span>
          </div>
          <h1>${career.name}</h1>
          <p style="color:var(--text-muted); margin-top:8px">${career.desc}</p>
        </div>
        <div class="cd-actions">
          <button class="btn-secondary" onclick="addToCompare('${career.id}')">⚖️ Add to Compare</button>
          <button class="btn-primary" onclick="showPage('quiz')">🧠 Take Quiz</button>
        </div>
      </div>
      
      <div class="cd-grid">
        <div class="cd-main">
          <div class="cd-section">
            <h3>💰 Salary Progression (India)</h3>
            <div class="salary-bars">
              <div class="salary-row">
                <div class="salary-meta"><span class="salary-label">Fresher (0–1 yr)</span><span class="salary-value">₹${career.freshSalary} LPA</span></div>
                <div class="salary-bar"><div class="salary-fill" style="width:${freshPct}%"></div></div>
              </div>
              <div class="salary-row">
                <div class="salary-meta"><span class="salary-label">Mid-Level (3 yrs)</span><span class="salary-value">₹${career.threeYSalary} LPA</span></div>
                <div class="salary-bar"><div class="salary-fill" style="width:${threePct}%"></div></div>
              </div>
              <div class="salary-row">
                <div class="salary-meta"><span class="salary-label">Senior (5+ yrs)</span><span class="salary-value">₹${career.fiveYSalary} LPA</span></div>
                <div class="salary-bar"><div class="salary-fill" style="width:${fivePct}%"></div></div>
              </div>
            </div>
          </div>
          
          <div class="cd-section">
            <h3>🛠️ Skills Required</h3>
            <div class="skills-list">${career.skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}</div>
          </div>
          
          <div class="cd-section">
            <h3>🗓️ 12-Month Preparation Roadmap</h3>
            <div class="roadmap-timeline">${roadmapHtml}</div>
          </div>
        </div>
        
        <div class="cd-sidebar">
          <div class="cd-section">
            <h3>📊 Quick Facts</h3>
            <div class="info-grid">
              <div class="info-row"><span class="info-label">Demand Level</span><span class="info-value" style="color:var(--secondary)">${career.demand}</span></div>
              <div class="info-row"><span class="info-label">Risk Level</span><span class="info-value" style="color:${riskColor}">${career.risk}</span></div>
              <div class="info-row"><span class="info-label">Further Studies</span><span class="info-value">${career.studyReq}</span></div>
              <div class="info-row"><span class="info-label">Work-Life Balance</span><span class="info-value">${career.workLife}</span></div>
              <div class="info-row"><span class="info-label">Competition</span><span class="info-value">${career.competition}</span></div>
              <div class="info-row"><span class="info-label">Prep Time</span><span class="info-value">${career.prepTime}</span></div>
            </div>
          </div>
          <div class="cd-section">
            <h3>🎯 Who Should Choose This?</h3>
            <p style="color:var(--text-muted);font-size:0.9rem;line-height:1.7">${career.who}</p>
          </div>
          <div class="cd-section">
            <h3>🎓 Best Branch Fit</h3>
            <div class="skills-list">${career.branches.map(b => `<span class="skill-tag">${b}</span>`).join('')}</div>
          </div>
        </div>
      </div>
    </div>`;

    document.getElementById('career-detail-content').innerHTML = content;
    showPage('career-detail');
    setTimeout(() => document.querySelectorAll('.salary-fill').forEach(el => el.style.width = el.style.width), 100);
}

// ==================== BRANCHES ====================
const BRANCH_DATA = {
    CSE: {
        icon: '💻', name: 'Computer Science & Engineering',
        overview: 'CSE graduates have the widest career options in India. Strong placement records at IITs/NITs/private colleges.',
        chart: [
            { label: 'IT / Software', pct: 55, color: '#6366f1' },
            { label: 'Data & Analytics', pct: 20, color: '#10b981' },
            { label: 'Management (MBA)', pct: 12, color: '#f59e0b' },
            { label: 'Government (PSU)', pct: 8, color: '#3b82f6' },
            { label: 'Research / MS', pct: 5, color: '#8b5cf6' },
        ],
        core: [{ name: 'Software Developer', salary: '₹5–25 LPA' }, { name: 'Data Scientist', salary: '₹8–30 LPA' }, { name: 'Cloud Engineer', salary: '₹6–20 LPA' }],
        it: [{ name: 'ML Engineer', salary: '₹10–35 LPA' }, { name: 'DevOps Engineer', salary: '₹7–22 LPA' }],
        govt: [{ name: 'PSU IT Role', salary: '₹6–12 LPA' }, { name: 'ISRO/DRDO', salary: '₹7–14 LPA' }],
        higher: [{ name: 'MS Abroad', salary: '₹20–50 LPA' }, { name: 'MBA via CAT', salary: '₹10–30 LPA' }],
    },
    ECE: {
        icon: '📡', name: 'Electronics & Communication Engineering',
        overview: 'ECE graduates bridge hardware and software worlds. Good fit for both embedded systems and IT switch.',
        chart: [
            { label: 'IT / Software Switch', pct: 40, color: '#6366f1' },
            { label: 'Core Electronics', pct: 25, color: '#10b981' },
            { label: 'Telecom / VLSI', pct: 20, color: '#f59e0b' },
            { label: 'Government (PSU)', pct: 10, color: '#3b82f6' },
            { label: 'Higher Studies', pct: 5, color: '#8b5cf6' },
        ],
        core: [{ name: 'Embedded Engineer', salary: '₹4–12 LPA' }, { name: 'VLSI Design', salary: '₹6–20 LPA' }, { name: 'Telecom Engineer', salary: '₹4–10 LPA' }],
        it: [{ name: 'Software Developer', salary: '₹5–25 LPA' }, { name: 'Data Analyst', salary: '₹4–15 LPA' }],
        govt: [{ name: 'PSU Engineer', salary: '₹6–12 LPA' }, { name: 'Defense (CDS/SSB)', salary: '₹7–15 LPA' }],
        higher: [{ name: 'M.Tech (VLSI/Signal)', salary: '₹8–20 LPA' }, { name: 'MS Abroad', salary: '₹20–50 LPA' }],
    },
    Mechanical: {
        icon: '⚙️', name: 'Mechanical Engineering',
        overview: 'Mechanical graduates have strong PSU demand and growing IT crossover through Data/Cloud upskilling.',
        chart: [
            { label: 'Core Mechanical', pct: 35, color: '#10b981' },
            { label: 'Government / PSU', pct: 30, color: '#3b82f6' },
            { label: 'IT Switch', pct: 20, color: '#6366f1' },
            { label: 'MBA/Management', pct: 10, color: '#f59e0b' },
            { label: 'Higher Studies', pct: 5, color: '#8b5cf6' },
        ],
        core: [{ name: 'Mechanical Engineer', salary: '₹3–8 LPA' }, { name: 'Automobile Engineer', salary: '₹4–10 LPA' }],
        it: [{ name: 'Data Analyst (upskilled)', salary: '₹4–12 LPA' }, { name: 'Product Manager', salary: '₹8–20 LPA' }],
        govt: [{ name: 'PSU Engineer (BHEL/ONGC)', salary: '₹6–12 LPA' }, { name: 'SSC JE', salary: '₹4–8 LPA' }],
        higher: [{ name: 'MBA via CAT', salary: '₹10–30 LPA' }, { name: 'M.Tech (Thermal/Mfg)', salary: '₹7–15 LPA' }],
    },
    Civil: {
        icon: '🏗️', name: 'Civil Engineering',
        overview: 'Infrastructure boom in India creates strong demand. Government sector is highly preferred path.',
        chart: [
            { label: 'Government / PSU', pct: 40, color: '#3b82f6' },
            { label: 'Construction / Infra', pct: 30, color: '#10b981' },
            { label: 'Higher Studies', pct: 15, color: '#8b5cf6' },
            { label: 'Consulting', pct: 10, color: '#f59e0b' },
            { label: 'IT Switch', pct: 5, color: '#6366f1' },
        ],
        core: [{ name: 'Site Engineer', salary: '₹3–8 LPA' }, { name: 'Structural Engineer', salary: '₹4–12 LPA' }],
        it: [{ name: 'GIS Analyst', salary: '₹4–10 LPA' }, { name: 'BIM Modeler', salary: '₹4–10 LPA' }],
        govt: [{ name: 'SSC JE', salary: '₹4–8 LPA' }, { name: 'PSU (NHAI/NHPC)', salary: '₹6–12 LPA' }],
        higher: [{ name: 'M.Tech (Structures)', salary: '₹7–16 LPA' }, { name: 'MBA', salary: '₹10–25 LPA' }],
    },
    EEE: {
        icon: '⚡', name: 'Electrical & Electronics Engineering',
        overview: 'Strong in power sector, renewable energy, and smart grids. PSU demand is very high.',
        chart: [
            { label: 'Power / Electrical', pct: 35, color: '#f59e0b' },
            { label: 'Government / PSU', pct: 30, color: '#3b82f6' },
            { label: 'IT Switch', pct: 20, color: '#6366f1' },
            { label: 'Renewable Energy', pct: 10, color: '#10b981' },
            { label: 'Higher Studies', pct: 5, color: '#8b5cf6' },
        ],
        core: [{ name: 'Power Systems Engineer', salary: '₹4–10 LPA' }, { name: 'Electrical Design Eng', salary: '₹4–9 LPA' }],
        it: [{ name: 'Data Analyst (upskilled)', salary: '₹4–12 LPA' }, { name: 'IOT Engineer', salary: '₹5–14 LPA' }],
        govt: [{ name: 'PSU (NTPC/BHEL/NPCIL)', salary: '₹6–13 LPA' }, { name: 'SSC JE (Electrical)', salary: '₹4–8 LPA' }],
        higher: [{ name: 'M.Tech (Power Systems)', salary: '₹7–16 LPA' }, { name: 'MBA', salary: '₹10–25 LPA' }],
    },
};

function openBranchDetail(branch) {
    const data = BRANCH_DATA[branch];
    if (!data) return;

    const chartHtml = data.chart.map(row => `
    <div class="chart-row">
      <div class="chart-label">${row.label}</div>
      <div class="chart-bar-outer">
        <div class="chart-bar-inner" style="width:${row.pct}%; background: linear-gradient(90deg, ${row.color}cc, ${row.color});">
          <span class="chart-bar-val">${row.pct}%</span>
        </div>
      </div>
    </div>`).join('');

    const makeList = (arr) => arr.map(it => `
    <div class="bd-career-item" onclick="showPage('careers')">
      <span class="bd-career-name">${it.name}</span>
      <span class="bd-career-sal">${it.salary}</span>
    </div>`).join('');

    const html = `
    <div class="branch-detail-wrapper">
      <button class="back-btn" onclick="showPage('branches')">← Branch Guide</button>
      <div class="bd-header">
        <div style="font-size:3rem;margin-top:16px">${data.icon}</div>
        <h1>${data.name}</h1>
        <p>${data.overview}</p>
      </div>
      <div class="bd-chart-container">
        <h3>📊 Career Distribution</h3>
        <div class="chart-bars">${chartHtml}</div>
      </div>
      <div class="bd-sections">
        <div class="bd-section">
          <h3>🔧 Core Careers</h3>
          <div class="bd-career-list">${makeList(data.core)}</div>
        </div>
        <div class="bd-section">
          <h3>💻 IT Switch Careers</h3>
          <div class="bd-career-list">${makeList(data.it)}</div>
        </div>
        <div class="bd-section">
          <h3>🏛️ Government / PSU</h3>
          <div class="bd-career-list">${makeList(data.govt)}</div>
        </div>
        <div class="bd-section">
          <h3>🎓 Higher Studies</h3>
          <div class="bd-career-list">${makeList(data.higher)}</div>
        </div>
      </div>
      <div style="text-align:center; margin-top:40px; display:flex; gap:14px; justify-content:center; flex-wrap:wrap;">
        <button class="btn-primary" onclick="showPage('quiz')">🧠 Take Career Quiz</button>
        <button class="btn-secondary" onclick="showPage('careers')">📋 View All Careers</button>
      </div>
    </div>`;

    document.getElementById('branch-detail-content').innerHTML = html;
    showPage('branch-detail');
}

// ==================== COMPARE ====================
function addToCompare(careerId) {
    if (state.compare.selected.includes(careerId)) {
        showToast('Already in comparison list!');
        return;
    }
    if (state.compare.selected.length >= 3) {
        showToast('Maximum 3 careers can be compared. Remove one first.');
        return;
    }
    state.compare.selected.push(careerId);
    showToast('Added to comparison! ✅');
}

function renderCompare() {
    renderCompareSelector();
    renderCompareTable();
}

function renderCompareSelector() {
    const list = document.getElementById('compare-career-list');
    if (!list) return;
    list.innerHTML = CAREERS.map(c => `
    <button class="compare-career-btn ${state.compare.selected.includes(c.id) ? 'selected' : ''}"
      onclick="toggleCompare('${c.id}', this)">
      ${c.icon} ${c.name}
    </button>`).join('');
}

function toggleCompare(id, btn) {
    if (state.compare.selected.includes(id)) {
        state.compare.selected = state.compare.selected.filter(s => s !== id);
        btn.classList.remove('selected');
    } else {
        if (state.compare.selected.length >= 3) {
            showToast('Maximum 3 careers only!'); return;
        }
        state.compare.selected.push(id);
        btn.classList.add('selected');
    }
    renderCompareTable();
}

function renderCompareTable() {
    const wrapper = document.getElementById('compare-table-wrapper');
    if (!wrapper) return;

    const selected = state.compare.selected.map(id => CAREERS.find(c => c.id === id)).filter(Boolean);

    if (selected.length < 2) {
        wrapper.innerHTML = `<div class="compare-empty"><p>${selected.length === 0 ? 'Select 2–3 careers from above to compare.' : 'Select at least one more career to compare.'}</p></div>`;
        return;
    }

    const rows = [
        { label: '💰 Fresher Salary', key: 'freshSalary', format: v => `₹${v} LPA`, betterFn: Math.max },
        { label: '📈 5-Year Salary', key: 'fiveYSalary', format: v => `₹${v} LPA`, betterFn: Math.max },
        { label: '⚠️ Risk Level', key: 'riskScore', format: (v, c) => c.risk, betterFn: Math.min },
        { label: '📊 Demand', key: 'demand', format: v => v, betterFn: null },
        { label: '📚 Further Study', key: 'studyReq', format: v => v, betterFn: null },
        { label: '🌿 Work-Life Balance', key: 'workLife', format: v => v, betterFn: null },
        { label: '🏆 Competition', key: 'competition', format: v => v, betterFn: null },
        { label: '⏱️ Prep Time', key: 'prepTime', format: v => v, betterFn: null },
    ];

    const headers = `<th>Factor</th>${selected.map(c => `<th>${c.icon}<br/>${c.name}</th>`).join('')}`;

    const tableRows = rows.map(row => {
        let bestIdx = -1;
        if (row.betterFn) {
            const vals = selected.map(c => c[row.key]);
            const best = row.betterFn(...vals);
            bestIdx = vals.findIndex(v => v === best);
        }
        const cells = selected.map((c, i) => {
            const val = row.format(c[row.key], c);
            const isBest = i === bestIdx;
            return `<td class="${isBest ? 'best' : ''}">${val}${isBest ? ' ✓' : ''}</td>`;
        }).join('');
        return `<tr><td>${row.label}</td>${cells}</tr>`;
    }).join('');

    wrapper.innerHTML = `
    <div class="compare-table">
      <table>
        <thead><tr>${headers}</tr></thead>
        <tbody>${tableRows}</tbody>
      </table>
    </div>`;
}

// ==================== UTILS ====================
function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 20) navbar.style.background = 'rgba(10,10,15,0.97)';
    else navbar.style.background = 'rgba(10,10,15,0.85)';
});

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    showPage('home');
});
