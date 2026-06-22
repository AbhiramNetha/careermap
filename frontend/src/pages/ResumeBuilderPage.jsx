import React, { useState, useEffect, useRef } from 'react';
import { 
  DocumentTextIcon,
  SparklesIcon,
  PlusIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  CloudArrowUpIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  AdjustmentsHorizontalIcon,
  CheckIcon
} from '@heroicons/react/24/solid';
import { fetchUserResumes, createResume, updateResume } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Standard layout font configurations
const FONTS = [
  { name: 'Inter', class: 'font-sans' },
  { name: 'Roboto', class: 'font-sans' },
  { name: 'Playfair Display', class: 'font-serif' },
  { name: 'Georgia', class: 'font-serif' },
  { name: 'Outfit', class: 'font-sans' }
];

const COLORS = [
  { name: 'Emerald', value: '#10b981' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Rose', value: '#f43f5e' },
  { name: 'Slate', value: '#0f172a' }
];

const INITIAL_RESUME_DATA = {
  contact: {
    name: 'Abhiram Netha',
    role: 'Full Stack Developer',
    email: 'abhiram@example.com',
    phone: '+91 98765 43210',
    location: 'Hyderabad, India',
    linkedin: 'linkedin.com/in/abhiramnetha',
    github: 'github.com/abhiramnetha',
    portfolio: 'way2fresher.com'
  },
  summary: 'Detail-oriented and passionate B.Tech Computer Science student with practical experience building responsive web applications. Proven ability in React, Node.js, and SQL databases. Eager to solve challenging real-world problems.',
  experience: [
    {
      company: 'Tech Solutions Inc.',
      role: 'Software Engineer Intern',
      location: 'Bangalore, India',
      startDate: 'May 2025',
      endDate: 'July 2025',
      current: false,
      description: '• Developed interactive dashboard screens in React, improving page loading performance by 25%.\n• Designed and optimized relational PostgreSQL database schemas.\n• Collaborated with core engineering team to implement secure user authentication API routes.'
    }
  ],
  education: [
    {
      school: 'Way2Fresher Engineering College',
      degree: 'B.Tech in Computer Science',
      location: 'Hyderabad, India',
      startDate: '2022',
      endDate: '2026',
      current: true,
      description: 'GPA: 8.9/10.0. Key modules: Database Management Systems, Data Structures & Algorithms.'
    }
  ],
  projects: [
    {
      name: 'CareerMap (Way2Fresher)',
      role: 'Lead Developer',
      techStack: 'React, Node.js, Sequelize, PostgreSQL',
      link: 'github.com/AbhiramNetha/careermap',
      description: '• Built full-stack platform helping freshers identify career roadmaps.\n• Designed modular ATS resume checker with rules-based compatibility scores.'
    }
  ],
  skills: [
    { category: 'Languages', tags: 'JavaScript, Python, C++, SQL, HTML/CSS' },
    { category: 'Frameworks/Tools', tags: 'React.js, Node.js, Express, Sequelize, Git, Docker' }
  ]
};

export default function ResumeBuilderPage() {
  const { currentUser } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [activeResumeId, setActiveResumeId] = useState(null);
  
  // Resume details state
  const [title, setTitle] = useState('My Resume');
  const [template, setTemplate] = useState('minimalist');
  const [styles, setStyles] = useState({
    fontFamily: 'Inter',
    fontSize: '11pt',
    lineHeight: '1.4',
    primaryColor: '#10b981'
  });
  const [data, setData] = useState(INITIAL_RESUME_DATA);

  // UI state
  const [activeFormTab, setActiveFormTab] = useState('contact'); // contact, summary, experience, education, projects, skills, custom
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Hidden print iframe reference
  const printIframeRef = useRef(null);

  useEffect(() => {
    loadUserResumes();
  }, []);

  const triggerToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadUserResumes = async () => {
    try {
      setLoading(true);
      const res = await fetchUserResumes();
      if (res.data && res.data.data.length > 0) {
        setResumes(res.data.data);
        loadResume(res.data.data[0]);
      } else {
        // No saved resumes yet, start with default template
        setData(INITIAL_RESUME_DATA);
      }
    } catch (err) {
      console.error('Failed to load saved resumes:', err);
      triggerToast('Could not load saved resumes from database.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadResume = (resume) => {
    setActiveResumeId(resume.id);
    setTitle(resume.title);
    setTemplate(resume.template);
    setStyles(resume.styles || {
      fontFamily: 'Inter',
      fontSize: '11pt',
      lineHeight: '1.4',
      primaryColor: '#10b981'
    });
    setData(resume.data || INITIAL_RESUME_DATA);
    triggerToast(`Loaded: "${resume.title}"`);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = { title, template, styles, data };

      if (activeResumeId) {
        // Update existing resume
        const res = await updateResume(activeResumeId, payload);
        if (res.data.success) {
          triggerToast('Resume updated successfully!');
          // Refresh list
          const listRes = await fetchUserResumes();
          setResumes(listRes.data.data);
        }
      } else {
        // Create new resume
        const res = await createResume(payload);
        if (res.data.success) {
          setActiveResumeId(res.data.data.id);
          triggerToast('Resume created & saved successfully!');
          // Refresh list
          const listRes = await fetchUserResumes();
          setResumes(listRes.data.data);
        }
      }
    } catch (err) {
      console.error('Failed to save resume:', err);
      triggerToast('Error saving resume. Make sure backend is running.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateNew = () => {
    setActiveResumeId(null);
    setTitle('New Resume');
    setTemplate('minimalist');
    setData({
      contact: { name: '', role: '', email: '', phone: '', location: '', linkedin: '', github: '', portfolio: '' },
      summary: '',
      experience: [],
      education: [],
      projects: [],
      skills: [{ category: '', tags: '' }]
    });
    triggerToast('Started a fresh blank template');
  };

  // State modification helpers
  const updateContactField = (field, val) => {
    setData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: val
      }
    }));
  };

  const updateExperienceItem = (index, field, val) => {
    setData(prev => {
      const exp = [...prev.experience];
      exp[index] = { ...exp[index], [field]: val };
      return { ...prev, experience: exp };
    });
  };

  const addExperienceItem = () => {
    setData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        { company: '', role: '', location: '', startDate: '', endDate: '', current: false, description: '' }
      ]
    }));
  };

  const removeExperienceItem = (index) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const updateEducationItem = (index, field, val) => {
    setData(prev => {
      const edu = [...prev.education];
      edu[index] = { ...edu[index], [field]: val };
      return { ...prev, education: edu };
    });
  };

  const addEducationItem = () => {
    setData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        { school: '', degree: '', location: '', startDate: '', endDate: '', current: false, description: '' }
      ]
    }));
  };

  const removeEducationItem = (index) => {
    setData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const updateProjectItem = (index, field, val) => {
    setData(prev => {
      const proj = [...prev.projects];
      proj[index] = { ...proj[index], [field]: val };
      return { ...prev, projects: proj };
    });
  };

  const addProjectItem = () => {
    setData(prev => ({
      ...prev,
      projects: [
        ...prev.projects,
        { name: '', role: '', techStack: '', link: '', description: '' }
      ]
    }));
  };

  const removeProjectItem = (index) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  const updateSkillItem = (index, field, val) => {
    setData(prev => {
      const sk = [...prev.skills];
      sk[index] = { ...sk[index], [field]: val };
      return { ...prev, skills: sk };
    });
  };

  const addSkillItem = () => {
    setData(prev => ({
      ...prev,
      skills: [
        ...prev.skills,
        { category: '', tags: '' }
      ]
    }));
  };

  const removeSkillItem = (index) => {
    setData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  // Generate resume HTML for print preview & export
  const renderResumeHTML = (isPrint = false) => {
    const { contact, summary, experience, education, projects, skills } = data;
    const { fontFamily, fontSize, lineHeight, primaryColor } = styles;

    const fontStyle = `font-family: '${fontFamily}', sans-serif;`;
    const themeColor = primaryColor;

    let templateSpecificCSS = '';
    if (template === 'tech') {
      templateSpecificCSS = `
        .resume-header { border-bottom: 2px solid ${themeColor}; padding-bottom: 12px; margin-bottom: 16px; }
        .main-layout { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; }
        .sidebar { border-left: 1px solid #e2e8f0; padding-left: 16px; }
      `;
    } else if (template === 'elegant') {
      templateSpecificCSS = `
        .resume-container { text-align: center; }
        .contact-row { justify-content: center; margin-top: 8px; }
        .section-title { text-transform: uppercase; letter-spacing: 1.5px; border-bottom: 1px solid ${themeColor}; color: ${themeColor}; text-align: left; }
        .job-header, .edu-header, .proj-header { text-align: left; }
        .desc-text { text-align: left; }
      `;
    } else { // Minimalist
      templateSpecificCSS = `
        .resume-header { border-bottom: 1px solid #cbd5e1; padding-bottom: 8px; margin-bottom: 14px; }
        .section-title { border-bottom: 1px solid #e2e8f0; font-weight: 700; color: #1e293b; padding-bottom: 2px; }
      `;
    }

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Outfit:wght@400;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Roboto:wght@400;700&display=swap" rel="stylesheet">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { 
            ${fontStyle}
            font-size: ${fontSize};
            line-height: ${lineHeight};
            color: #334155;
            background: #ffffff;
            -webkit-print-color-adjust: exact;
          }
          .resume-container {
            max-width: 800px;
            margin: 0 auto;
            padding: ${isPrint ? '0' : '20px'};
          }
          h1 { font-size: 24pt; font-weight: 700; color: #0f172a; line-height: 1.1; }
          h2 { font-size: 14pt; font-weight: 600; color: #1e293b; }
          .role-subtitle { font-size: 12pt; color: ${themeColor}; font-weight: 600; margin-top: 2px; }
          .contact-row { display: flex; flex-wrap: wrap; gap: 8px 16px; font-size: 9pt; color: #64748b; margin-top: 6px; }
          .contact-item { display: flex; align-items: center; }
          .section-block { margin-top: 14px; }
          .section-title { font-size: 10pt; text-transform: uppercase; font-weight: 700; color: ${themeColor}; border-bottom: 1.5px solid ${themeColor}; padding-bottom: 3px; margin-bottom: 8px; }
          .summary-text { font-size: 9.5pt; text-align: justify; color: #475569; }
          
          .job-item, .edu-item, .proj-item { margin-bottom: 10px; }
          .job-header, .edu-header, .proj-header { display: flex; justify-content: space-between; font-weight: 700; font-size: 9.5pt; color: #1e293b; }
          .job-subheader, .edu-subheader { display: flex; justify-content: space-between; font-size: 9pt; color: #64748b; font-style: italic; margin-bottom: 2px; }
          .desc-text { font-size: 9pt; color: #475569; white-space: pre-line; margin-top: 3px; }
          
          .skills-grid { display: flex; flex-direction: column; gap: 4px; }
          .skill-row { font-size: 9pt; color: #475569; }
          .skill-category { font-weight: 700; color: #1e293b; }

          ${templateSpecificCSS}

          @media print {
            body { background: white; color: black; }
            .resume-container { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="resume-container">
          
          <header class="resume-header">
            <h1>${contact.name || 'Your Name'}</h1>
            {role-subtitle-placeholder}
            <div class="contact-row">
              ${contact.email ? `<div class="contact-item">📧 ${contact.email}</div>` : ''}
              ${contact.phone ? `<div class="contact-item">📞 ${contact.phone}</div>` : ''}
              ${contact.location ? `<div class="contact-item">📍 ${contact.location}</div>` : ''}
              ${contact.linkedin ? `<div class="contact-item">🔗 ${contact.linkedin}</div>` : ''}
              ${contact.github ? `<div class="contact-item">💻 ${contact.github}</div>` : ''}
              ${contact.portfolio ? `<div class="contact-item">🌐 ${contact.portfolio}</div>` : ''}
            </div>
          </header>

          <div class="main-layout">
            <div class="main-content">
              
              <!-- Summary -->
              ${summary ? `
                <div class="section-block">
                  <div class="section-title">Professional Summary</div>
                  <div class="summary-text">${summary}</div>
                </div>
              ` : ''}

              <!-- Experience -->
              ${experience.length > 0 ? `
                <div class="section-block">
                  <div class="section-title">Professional Experience</div>
                  ${experience.map(exp => `
                    <div class="job-item">
                      <div class="job-header">
                        <span>${exp.role || 'Role'}</span>
                        <span>${exp.startDate || ''} - ${exp.current ? 'Present' : (exp.endDate || '')}</span>
                      </div>
                      <div class="job-subheader">
                        <span>${exp.company || 'Company'}</span>
                        <span>${exp.location || ''}</span>
                      </div>
                      ${exp.description ? `<div class="desc-text">${exp.description}</div>` : ''}
                    </div>
                  `).join('')}
                </div>
              ` : ''}

              <!-- Projects -->
              ${projects.length > 0 ? `
                <div class="section-block">
                  <div class="section-title">Projects</div>
                  ${projects.map(proj => `
                    <div class="proj-item">
                      <div class="proj-header">
                        <span>${proj.name || 'Project Name'} ${proj.role ? `(${proj.role})` : ''}</span>
                        <span>${proj.link || ''}</span>
                      </div>
                      ${proj.techStack ? `<div style="font-size: 8.5pt; color: ${themeColor}; font-weight:600; margin-top:1px;">Tech Stack: ${proj.techStack}</div>` : ''}
                      ${proj.description ? `<div class="desc-text">${proj.description}</div>` : ''}
                    </div>
                  `).join('')}
                </div>
              ` : ''}

              <!-- Education -->
              ${education.length > 0 ? `
                <div class="section-block">
                  <div class="section-title">Education</div>
                  ${education.map(edu => `
                    <div class="edu-item">
                      <div class="edu-header">
                        <span>${edu.degree || 'Degree'}</span>
                        <span>${edu.startDate || ''} - ${edu.endDate || ''}</span>
                      </div>
                      <div class="edu-subheader">
                        <span>${edu.school || 'School'}</span>
                        <span>${edu.location || ''}</span>
                      </div>
                      ${edu.description ? `<div class="desc-text">${edu.description}</div>` : ''}
                    </div>
                  `).join('')}
                </div>
              ` : ''}

            </div>

            <!-- Sidebar / Skills (Visible layout in Tech Template, else standard bottom content) -->
            <div class="${template === 'tech' ? 'sidebar' : 'main-content'}">
              
              <!-- Skills -->
              ${skills.length > 0 ? `
                <div class="section-block">
                  <div class="section-title">Key Skills</div>
                  <div class="skills-grid">
                    ${skills.map(sk => `
                      <div class="skill-row">
                        <span class="skill-category">${sk.category || 'Category'}:</span> 
                        <span>${sk.tags || ''}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : ''}

            </div>
          </div>

        </div>
      </body>
      </html>
    `
    .replace('{role-subtitle-placeholder}', contact.role ? `<div class="role-subtitle">${contact.role}</div>` : '');
  };

  // Perform PDF print download using hidden iframe
  const handleDownloadPDF = () => {
    const iframe = printIframeRef.current;
    if (!iframe) return;

    const resumeHTML = renderResumeHTML(true);
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(resumeHTML);
    doc.close();

    // Trigger printing once content is fully loaded
    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    }, 500);
  };

  return (
    <div className="container min-h-screen pt-24 pb-12 px-4 flex flex-col items-center">
      {/* Background radial effects */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full filter blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full filter blur-[100px] pointer-events-none z-0"></div>

      {/* Header Panel */}
      <div className="w-full max-w-7xl flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-10">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100 flex items-center gap-2">
            <DocumentTextIcon className="w-8 h-8 text-amber-400" />
            Interactive <span className="text-amber-400">Resume Builder</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Build clean, high-scoring ATS resumes, view visual updates, and export prints instantly.
          </p>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Saved templates dropdown */}
          {resumes.length > 0 && (
            <div className="relative group">
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs font-semibold text-slate-300 hover:border-white/20 transition-all">
                <ArrowPathIcon className="w-3.5 h-3.5" />
                Load Saved
              </button>
              <div className="absolute right-0 top-full mt-1.5 w-52 rounded-xl bg-slate-900 border border-white/10 p-1 shadow-2xl hidden group-hover:block z-[99]">
                {resumes.map(res => (
                  <button
                    key={res.id}
                    onClick={() => loadResume(res)}
                    className="w-full text-left rounded px-3 py-2 text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors truncate"
                  >
                    📝 {res.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleCreateNew}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs font-semibold text-slate-300 hover:border-white/20 transition-all"
          >
            + Create New
          </button>
          
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-amber-400 transition-all disabled:opacity-50"
          >
            <CloudArrowUpIcon className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Draft'}
          </button>

          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-emerald-400 transition-all"
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Toast Alert popup */}
      {toast && (
        <div className={`fixed top-24 z-[999] px-6 py-3 rounded-full border shadow-xl flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${
          toast.type === 'error' 
            ? 'bg-red-500/10 border-red-500/30 text-red-400' 
            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
        }`}>
          <span>{toast.type === 'error' ? '❌' : '✅'}</span>
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Main Split Screen Workspace */}
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* LEFT COLUMN: Input Form Controls (7cols on large) */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          
          {/* Config Title / Template selector */}
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1">Resume Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-amber-500"
                />
              </div>
              <div className="flex-1">
                <label className="block text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1">Template Style</label>
                <select
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-amber-500"
                >
                  <option value="minimalist">Minimalist (AATS Std)</option>
                  <option value="tech">Modern Tech Column</option>
                  <option value="elegant">Elegant Serif</option>
                </select>
              </div>
            </div>

            {/* Design Controls Accordion header */}
            <div className="border-t border-white/5 pt-2 flex flex-wrap gap-2 items-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <AdjustmentsHorizontalIcon className="w-3.5 h-3.5 text-amber-500" />
                Customize:
              </span>
              
              {/* Font chooser */}
              <select
                value={styles.fontFamily}
                onChange={(e) => setStyles(prev => ({ ...prev, fontFamily: e.target.value }))}
                className="bg-slate-950/40 border border-white/5 rounded-lg px-2 py-1 text-[10px] text-slate-300"
              >
                {FONTS.map(f => <option key={f.name} value={f.name}>{f.name}</option>)}
              </select>

              {/* Spacing chooser */}
              <select
                value={styles.lineHeight}
                onChange={(e) => setStyles(prev => ({ ...prev, lineHeight: e.target.value }))}
                className="bg-slate-950/40 border border-white/5 rounded-lg px-2 py-1 text-[10px] text-slate-300"
              >
                <option value="1.2">Compact spacing</option>
                <option value="1.4">Normal spacing</option>
                <option value="1.6">Relaxed spacing</option>
              </select>

              {/* Accent Colors */}
              <div className="flex gap-1.5 ml-auto">
                {COLORS.map(c => (
                  <button
                    key={c.name}
                    onClick={() => setStyles(prev => ({ ...prev, primaryColor: c.value }))}
                    className="w-4 h-4 rounded-full border border-white/20 relative"
                    style={{ backgroundColor: c.value }}
                    title={c.name}
                  >
                    {styles.primaryColor === c.value && <CheckIcon className="w-2.5 h-2.5 text-white absolute inset-0 m-auto" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ACCORDION INPUT MODULES */}
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-5 flex flex-col gap-3">
            
            {/* Contact Accordion */}
            <div className="border border-white/5 rounded-xl overflow-hidden">
              <button 
                onClick={() => setActiveFormTab(activeFormTab === 'contact' ? '' : 'contact')}
                className="w-full bg-slate-950/40 px-4 py-3 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-200"
              >
                <span>👤 Contact Details</span>
                {activeFormTab === 'contact' ? <ChevronUpIcon className="w-4 h-4 text-slate-400" /> : <ChevronDownIcon className="w-4 h-4 text-slate-400" />}
              </button>
              {activeFormTab === 'contact' && (
                <div className="p-4 bg-slate-950/20 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-slate-400 text-[10px] mb-1">Full Name</label>
                    <input type="text" value={data.contact.name} onChange={e => updateContactField('name', e.target.value)} className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none" />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[10px] mb-1">Subtitle / Role</label>
                    <input type="text" value={data.contact.role} onChange={e => updateContactField('role', e.target.value)} className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none" />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[10px] mb-1">Email</label>
                    <input type="email" value={data.contact.email} onChange={e => updateContactField('email', e.target.value)} className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none" />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[10px] mb-1">Phone</label>
                    <input type="text" value={data.contact.phone} onChange={e => updateContactField('phone', e.target.value)} className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none" />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[10px] mb-1">Location</label>
                    <input type="text" value={data.contact.location} onChange={e => updateContactField('location', e.target.value)} className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none" />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[10px] mb-1">LinkedIn Username</label>
                    <input type="text" value={data.contact.linkedin} onChange={e => updateContactField('linkedin', e.target.value)} className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none" />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[10px] mb-1">GitHub Username</label>
                    <input type="text" value={data.contact.github} onChange={e => updateContactField('github', e.target.value)} className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none" />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[10px] mb-1">Portfolio Link</label>
                    <input type="text" value={data.contact.portfolio} onChange={e => updateContactField('portfolio', e.target.value)} className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none" />
                  </div>
                </div>
              )}
            </div>

            {/* Summary Accordion */}
            <div className="border border-white/5 rounded-xl overflow-hidden">
              <button 
                onClick={() => setActiveFormTab(activeFormTab === 'summary' ? '' : 'summary')}
                className="w-full bg-slate-950/40 px-4 py-3 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-200"
              >
                <span>🖋️ Professional Summary</span>
                {activeFormTab === 'summary' ? <ChevronUpIcon className="w-4 h-4 text-slate-400" /> : <ChevronDownIcon className="w-4 h-4 text-slate-400" />}
              </button>
              {activeFormTab === 'summary' && (
                <div className="p-4 bg-slate-950/20 border-t border-white/5">
                  <label className="block text-slate-400 text-[10px] mb-1">Brief summary / Objective statement</label>
                  <textarea
                    value={data.summary}
                    onChange={e => setData(prev => ({ ...prev, summary: e.target.value }))}
                    rows={4}
                    className="w-full bg-slate-950/60 border border-white/10 rounded-xl p-3 text-xs text-slate-200 outline-none resize-none"
                    placeholder="Write a standard ATS summary explaining your technical skills and focus areas..."
                  />
                </div>
              )}
            </div>

            {/* Work Experience Accordion */}
            <div className="border border-white/5 rounded-xl overflow-hidden">
              <button 
                onClick={() => setActiveFormTab(activeFormTab === 'experience' ? '' : 'experience')}
                className="w-full bg-slate-950/40 px-4 py-3 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-200"
              >
                <span>💼 Work Experience</span>
                {activeFormTab === 'experience' ? <ChevronUpIcon className="w-4 h-4 text-slate-400" /> : <ChevronDownIcon className="w-4 h-4 text-slate-400" />}
              </button>
              {activeFormTab === 'experience' && (
                <div className="p-4 bg-slate-950/20 border-t border-white/5 flex flex-col gap-4">
                  {data.experience.map((exp, idx) => (
                    <div key={idx} className="p-3 bg-slate-950/40 border border-white/5 rounded-xl flex flex-col gap-2 relative">
                      <button 
                        onClick={() => removeExperienceItem(idx)}
                        className="absolute right-3 top-3 text-slate-500 hover:text-red-400"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                      <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wide">Role #{idx + 1}</span>
                      
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <div>
                          <label className="block text-slate-500 text-[9px] mb-0.5">Company</label>
                          <input type="text" value={exp.company} onChange={e => updateExperienceItem(idx, 'company', e.target.value)} className="w-full bg-slate-950/40 border border-white/5 rounded-lg px-2 py-1 text-xs text-slate-200" />
                        </div>
                        <div>
                          <label className="block text-slate-500 text-[9px] mb-0.5">Role/Title</label>
                          <input type="text" value={exp.role} onChange={e => updateExperienceItem(idx, 'role', e.target.value)} className="w-full bg-slate-950/40 border border-white/5 rounded-lg px-2 py-1 text-xs text-slate-200" />
                        </div>
                        <div>
                          <label className="block text-slate-500 text-[9px] mb-0.5">Location</label>
                          <input type="text" value={exp.location} onChange={e => updateExperienceItem(idx, 'location', e.target.value)} className="w-full bg-slate-950/40 border border-white/5 rounded-lg px-2 py-1 text-xs text-slate-200" />
                        </div>
                        <div>
                          <label className="block text-slate-500 text-[9px] mb-0.5">Start Date</label>
                          <input type="text" value={exp.startDate} onChange={e => updateExperienceItem(idx, 'startDate', e.target.value)} className="w-full bg-slate-950/40 border border-white/5 rounded-lg px-2 py-1 text-xs text-slate-200" />
                        </div>
                        <div>
                          <label className="block text-slate-500 text-[9px] mb-0.5">End Date</label>
                          <input type="text" value={exp.endDate} onChange={e => updateExperienceItem(idx, 'endDate', e.target.value)} className="w-full bg-slate-950/40 border border-white/5 rounded-lg px-2 py-1 text-xs text-slate-200" disabled={exp.current} />
                        </div>
                        <div className="flex items-center gap-1.5 mt-4">
                          <input type="checkbox" id={`exp-cur-${idx}`} checked={exp.current} onChange={e => updateExperienceItem(idx, 'current', e.target.checked)} className="rounded" />
                          <label htmlFor={`exp-cur-${idx}`} className="text-slate-400 text-[10px]">Current Role</label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-500 text-[9px] mb-0.5">Responsibilities (Use • bullet points)</label>
                        <textarea value={exp.description} onChange={e => updateExperienceItem(idx, 'description', e.target.value)} rows={3} className="w-full bg-slate-950/40 border border-white/5 rounded-lg p-2 text-xs text-slate-200 outline-none resize-none" placeholder="• Accomplished X by implementing Y, resulting in Z..." />
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={addExperienceItem}
                    className="w-full py-2 bg-slate-950/60 hover:bg-slate-950 border border-white/5 hover:border-white/10 rounded-xl text-xs font-semibold text-slate-300 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <PlusIcon className="w-4 h-4 text-amber-400" />
                    Add Work Experience
                  </button>
                </div>
              )}
            </div>

            {/* Projects Accordion */}
            <div className="border border-white/5 rounded-xl overflow-hidden">
              <button 
                onClick={() => setActiveFormTab(activeFormTab === 'projects' ? '' : 'projects')}
                className="w-full bg-slate-950/40 px-4 py-3 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-200"
              >
                <span>🚀 Projects</span>
                {activeFormTab === 'projects' ? <ChevronUpIcon className="w-4 h-4 text-slate-400" /> : <ChevronDownIcon className="w-4 h-4 text-slate-400" />}
              </button>
              {activeFormTab === 'projects' && (
                <div className="p-4 bg-slate-950/20 border-t border-white/5 flex flex-col gap-4">
                  {data.projects.map((proj, idx) => (
                    <div key={idx} className="p-3 bg-slate-950/40 border border-white/5 rounded-xl flex flex-col gap-2 relative">
                      <button 
                        onClick={() => removeProjectItem(idx)}
                        className="absolute right-3 top-3 text-slate-500 hover:text-red-400"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                      <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wide">Project #{idx + 1}</span>
                      
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <div>
                          <label className="block text-slate-500 text-[9px] mb-0.5">Project Name</label>
                          <input type="text" value={proj.name} onChange={e => updateProjectItem(idx, 'name', e.target.value)} className="w-full bg-slate-950/40 border border-white/5 rounded-lg px-2 py-1 text-xs text-slate-200" />
                        </div>
                        <div>
                          <label className="block text-slate-500 text-[9px] mb-0.5">Your Role</label>
                          <input type="text" value={proj.role} onChange={e => updateProjectItem(idx, 'role', e.target.value)} className="w-full bg-slate-950/40 border border-white/5 rounded-lg px-2 py-1 text-xs text-slate-200" />
                        </div>
                        <div>
                          <label className="block text-slate-500 text-[9px] mb-0.5">Tech Stack</label>
                          <input type="text" value={proj.techStack} onChange={e => updateProjectItem(idx, 'techStack', e.target.value)} className="w-full bg-slate-950/40 border border-white/5 rounded-lg px-2 py-1 text-xs text-slate-200" placeholder="e.g. React, Node.js" />
                        </div>
                        <div>
                          <label className="block text-slate-500 text-[9px] mb-0.5">Project Link</label>
                          <input type="text" value={proj.link} onChange={e => updateProjectItem(idx, 'link', e.target.value)} className="w-full bg-slate-950/40 border border-white/5 rounded-lg px-2 py-1 text-xs text-slate-200" placeholder="e.g. github.com/..." />
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-500 text-[9px] mb-0.5">Project Description (Use • bullet points)</label>
                        <textarea value={proj.description} onChange={e => updateProjectItem(idx, 'description', e.target.value)} rows={3} className="w-full bg-slate-950/40 border border-white/5 rounded-lg p-2 text-xs text-slate-200 outline-none resize-none" placeholder="• Designed high-fidelity wireframes...\n• Deployed API service to Cloud..." />
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={addProjectItem}
                    className="w-full py-2 bg-slate-950/60 hover:bg-slate-950 border border-white/5 hover:border-white/10 rounded-xl text-xs font-semibold text-slate-300 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <PlusIcon className="w-4 h-4 text-amber-400" />
                    Add Project
                  </button>
                </div>
              )}
            </div>

            {/* Education Accordion */}
            <div className="border border-white/5 rounded-xl overflow-hidden">
              <button 
                onClick={() => setActiveFormTab(activeFormTab === 'education' ? '' : 'education')}
                className="w-full bg-slate-950/40 px-4 py-3 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-200"
              >
                <span>🎓 Education</span>
                {activeFormTab === 'education' ? <ChevronUpIcon className="w-4 h-4 text-slate-400" /> : <ChevronDownIcon className="w-4 h-4 text-slate-400" />}
              </button>
              {activeFormTab === 'education' && (
                <div className="p-4 bg-slate-950/20 border-t border-white/5 flex flex-col gap-4">
                  {data.education.map((edu, idx) => (
                    <div key={idx} className="p-3 bg-slate-950/40 border border-white/5 rounded-xl flex flex-col gap-2 relative">
                      <button 
                        onClick={() => removeEducationItem(idx)}
                        className="absolute right-3 top-3 text-slate-500 hover:text-red-400"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                      <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wide">Education #{idx + 1}</span>
                      
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <div>
                          <label className="block text-slate-500 text-[9px] mb-0.5">School/University</label>
                          <input type="text" value={edu.school} onChange={e => updateEducationItem(idx, 'school', e.target.value)} className="w-full bg-slate-950/40 border border-white/5 rounded-lg px-2 py-1 text-xs text-slate-200" />
                        </div>
                        <div>
                          <label className="block text-slate-500 text-[9px] mb-0.5">Degree / Major</label>
                          <input type="text" value={edu.degree} onChange={e => updateEducationItem(idx, 'degree', e.target.value)} className="w-full bg-slate-950/40 border border-white/5 rounded-lg px-2 py-1 text-xs text-slate-200" />
                        </div>
                        <div>
                          <label className="block text-slate-500 text-[9px] mb-0.5">Location</label>
                          <input type="text" value={edu.location} onChange={e => updateEducationItem(idx, 'location', e.target.value)} className="w-full bg-slate-950/40 border border-white/5 rounded-lg px-2 py-1 text-xs text-slate-200" />
                        </div>
                        <div>
                          <label className="block text-slate-500 text-[9px] mb-0.5">Start Date</label>
                          <input type="text" value={edu.startDate} onChange={e => updateEducationItem(idx, 'startDate', e.target.value)} className="w-full bg-slate-950/40 border border-white/5 rounded-lg px-2 py-1 text-xs text-slate-200" />
                        </div>
                        <div>
                          <label className="block text-slate-500 text-[9px] mb-0.5">End Date</label>
                          <input type="text" value={edu.endDate} onChange={e => updateEducationItem(idx, 'endDate', e.target.value)} className="w-full bg-slate-950/40 border border-white/5 rounded-lg px-2 py-1 text-xs text-slate-200" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-500 text-[9px] mb-0.5">GPA & Other details</label>
                        <input type="text" value={edu.description} onChange={e => updateEducationItem(idx, 'description', e.target.value)} className="w-full bg-slate-950/40 border border-white/5 rounded-lg px-2 py-1.5 text-xs text-slate-200" placeholder="GPA: 9.0/10.0. Special accomplishments..." />
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={addEducationItem}
                    className="w-full py-2 bg-slate-950/60 hover:bg-slate-950 border border-white/5 hover:border-white/10 rounded-xl text-xs font-semibold text-slate-300 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <PlusIcon className="w-4 h-4 text-amber-400" />
                    Add Education
                  </button>
                </div>
              )}
            </div>

            {/* Skills Accordion */}
            <div className="border border-white/5 rounded-xl overflow-hidden">
              <button 
                onClick={() => setActiveFormTab(activeFormTab === 'skills' ? '' : 'skills')}
                className="w-full bg-slate-950/40 px-4 py-3 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-200"
              >
                <span>🏷️ Key Skills</span>
                {activeFormTab === 'skills' ? <ChevronUpIcon className="w-4 h-4 text-slate-400" /> : <ChevronDownIcon className="w-4 h-4 text-slate-400" />}
              </button>
              {activeFormTab === 'skills' && (
                <div className="p-4 bg-slate-950/20 border-t border-white/5 flex flex-col gap-4">
                  {data.skills.map((sk, idx) => (
                    <div key={idx} className="p-3 bg-slate-950/40 border border-white/5 rounded-xl flex flex-col gap-2 relative">
                      <button 
                        onClick={() => removeSkillItem(idx)}
                        className="absolute right-3 top-3 text-slate-500 hover:text-red-400"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                      <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wide">Category #{idx + 1}</span>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                        <div>
                          <label className="block text-slate-500 text-[9px] mb-0.5">Category Name</label>
                          <input type="text" value={sk.category} onChange={e => updateSkillItem(idx, 'category', e.target.value)} className="w-full bg-slate-950/40 border border-white/5 rounded-lg px-2 py-1.5 text-xs text-slate-200" placeholder="e.g. Programming Languages" />
                        </div>
                        <div>
                          <label className="block text-slate-500 text-[9px] mb-0.5">Skill tags (Comma separated)</label>
                          <input type="text" value={sk.tags} onChange={e => updateSkillItem(idx, 'tags', e.target.value)} className="w-full bg-slate-950/40 border border-white/5 rounded-lg px-2 py-1.5 text-xs text-slate-200" placeholder="e.g. JavaScript, Python, C++" />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={addSkillItem}
                    className="w-full py-2 bg-slate-950/60 hover:bg-slate-950 border border-white/5 hover:border-white/10 rounded-xl text-xs font-semibold text-slate-300 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <PlusIcon className="w-4 h-4 text-amber-400" />
                    Add Skill Category
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: Live Viewport Rendering (6cols on large) */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="w-full max-w-[595px] aspect-[1/1.414] bg-white rounded-xl shadow-2xl overflow-hidden border border-white/10 relative z-10 transition-transform hover:scale-[1.005]">
            <iframe
              srcDoc={renderResumeHTML(false)}
              className="w-full h-full border-none pointer-events-auto"
              title="Live Resume Preview"
            />
          </div>
        </div>

      </div>

      {/* Hidden print Iframe */}
      <iframe
        ref={printIframeRef}
        style={{ display: 'none', position: 'absolute', width: 0, height: 0 }}
        title="Resume Print Render Frame"
      />
    </div>
  );
}
