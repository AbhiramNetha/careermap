import React, { useState, useRef, useEffect } from 'react';
import {
  CloudArrowUpIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  DocumentTextIcon,
  ClipboardDocumentCheckIcon,
  ChevronDownIcon,
  ArrowPathIcon
} from '@heroicons/react/24/solid';
import { analyzeResume } from '../services/api';
import posthog from '../posthog.js';

const factorConfig = {
  keywordMatch: { label: "Keyword Match", weight: "25%", color: "emerald" },
  sectionDetection: { label: "Section Detection", weight: "20%", color: "blue" },
  formatting: { label: "Formatting", weight: "15%", color: "indigo" },
  contactInfo: { label: "Contact Info", weight: "10%", color: "purple" },
  bulletPoints: { label: "Bullet Points", weight: "10%", color: "pink" },
  fileFormat: { label: "File Format", weight: "5%", color: "teal" },
  length: { label: "Length", weight: "5%", color: "amber" },
  actionVerbs: { label: "Action Verbs", weight: "5%", color: "orange" },
  readability: { label: "Readability", weight: "5%", color: "cyan" }
};

export default function AtsCheckerPage() {
  const [file, setFile] = useState(null);
  const [mode, setMode] = useState('generic'); // 'generic' or 'jd'
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('summary'); // 'summary', 'keywords', 'structure', 'text'
  const [isDragActive, setIsDragActive] = useState(false);

  const fileInputRef = useRef(null);

  // Steps shown during fake scan progress
  const scanningSteps = [
    "Reading file buffer...",
    "Extracting plain text layout...",
    "Analyzing resume section structure...",
    "Detecting formatting elements & tables...",
    "Extracting contact details & social profiles...",
    "Matching keywords with job requirements...",
    "Evaluating experience bullets and action verbs...",
    "Calculating final ATS compatibility score..."
  ];

  useEffect(() => {
    let interval;
    if (loading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => {
          if (prev >= scanningSteps.length - 1) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    const ext = selectedFile.name.split('.').pop().toLowerCase();
    if (ext === 'pdf' || ext === 'docx') {
      setFile(selectedFile);
      setError(null);
    } else {
      setError("Unsupported file format. Please upload a PDF or DOCX file.");
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select or drag-and-drop a file first.");
      return;
    }

    if (mode === 'jd' && !jobDescription.trim()) {
      setError("Please paste a job description to match against.");
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('mode', mode);
    if (mode === 'jd') {
      formData.append('jobDescription', jobDescription);
    }

    posthog.capture('ats_scan_submitted', { mode, file_type: file.name.split('.').pop().toLowerCase() });

    try {
      // Minimum duration of 2.5s to let users appreciate the high-tech scanning process!
      const [res] = await Promise.all([
        analyzeResume(formData),
        new Promise(resolve => setTimeout(resolve, 4000))
      ]);

      setResults(res.data);
      posthog.capture('ats_results_received', { score: res.data.overallScore, mode, issues_count: res.data.issues?.length });
    } catch (err) {
      posthog.captureException(err, { mode });
      console.error(err);
      setError(err.response?.data?.error || "Failed to analyze the resume. Please make sure the file is valid and try again.");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-amber-400";
    return "text-red-400";
  };

  const getScoreBg = (score) => {
    if (score >= 80) return "bg-emerald-500/10 border-emerald-500/30";
    if (score >= 60) return "bg-amber-500/10 border-amber-500/30";
    return "bg-red-500/10 border-red-500/30";
  };

  const getScoreRating = (score) => {
    if (score >= 80) return "ATS Ready";
    if (score >= 60) return "Needs Review";
    return "Poor Format";
  };

  // SVG Gauge calculations
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = results ? circumference - (results.overallScore / 100) * circumference : circumference;

  return (
    <div className="min-h-screen pt-16 lg:pt-[98px] pb-12 px-4 flex flex-col items-center relative">
      {/* Background glow effects matching main page themes */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full filter blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full filter blur-[100px] pointer-events-none z-0"></div>

      {/* Hero Header */}
      <div className="text-center max-w-2xl mt-8 mb-12 relative z-10 animate-fade-in">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4 uppercase tracking-wider">
          💡 Interactive Auditor
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-slate-100">
          ATS <span className="text-emerald-400">Auditor</span> & Optimizer
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Ensure your resume passes automatic parsers. Upload your PDF or DOCX file below to generate a detailed factor score analysis, list detected errors, and apply optimization recommendations.
        </p>
      </div>

      {!results && !loading && (
        <form onSubmit={handleSubmit} className="w-full max-w-3xl bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 transition-all hover:border-white/15">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-400 text-xs sm:text-sm">
              <XCircleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          {/* Mode Switcher */}
          <div className="mb-6">
            <label className="block text-slate-300 text-xs uppercase font-bold tracking-wider mb-2">Scan Mode</label>
            <div className="ats-mode-container">
              <button
                type="button"
                onClick={() => setMode('generic')}
                className={`ats-mode-btn ${mode === 'generic' ? 'ats-mode-btn--active' : ''}`}
              >
                Generic Technology Check
              </button>
              <button
                type="button"
                onClick={() => setMode('jd')}
                className={`ats-mode-btn ${mode === 'jd' ? 'ats-mode-btn--active' : ''}`}
              >
                Job Description Match
              </button>
            </div>
          </div>

          {/* Job Description Textarea */}
          {mode === 'jd' && (
            <div className="mb-6 animate-fade-in">
              <label className="block text-slate-300 text-xs uppercase font-bold tracking-wider mb-2">Paste Job Description</label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description or requirements list here to scan for specific skill matches..."
                rows={5}
                className="w-full bg-slate-950/60 border border-white/10 rounded-2xl p-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all outline-none resize-none"
              />
            </div>
          )}

          {/* File Upload zone */}
          <div className="mb-8">
            <label className="block text-slate-300 text-xs uppercase font-bold tracking-wider mb-2">Upload Resume File</label>
            {!file ? (
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
                className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center group ${isDragActive
                  ? 'border-emerald-500 bg-emerald-500/5'
                  : 'border-slate-800 bg-slate-950/30 hover:border-emerald-500/40 hover:bg-slate-950/50'
                  }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <CloudArrowUpIcon className="w-12 h-12 text-slate-500 group-hover:text-emerald-400 group-hover:scale-110 transition-all mb-4" />
                <p className="text-slate-200 text-sm font-semibold mb-1">Drag and drop your resume file here</p>
                <p className="text-slate-500 text-xs mb-3">or click to browse your local computer</p>
                <div className="inline-flex gap-2 text-[10px] uppercase tracking-wider font-bold text-slate-400 bg-slate-900 border border-white/5 px-3 py-1.5 rounded-full">
                  <span>PDF</span>
                  <span className="text-slate-700">•</span>
                  <span>DOCX</span>
                </div>
              </div>
            ) : (
              <div className="bg-slate-950/60 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <DocumentTextIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-slate-200 text-sm font-semibold max-w-[200px] sm:max-w-md truncate">{file.name}</p>
                    <p className="text-slate-500 text-xs">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-white/5 transition-all text-xs uppercase font-bold  ${activeTab === 'structure'
                  ? 'bg-amber-500/25 text-amber-300 border-amber-400 shadow-lg shadow-amber-500/20'
                  : 'text-amber-400 border-amber-400 bg-transparent hover:bg-amber-500/10'"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={!file}
            className={`w-full py-4 px-6 rounded-full font-bold uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${file
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/20 transform hover:scale-[1.01]'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
          >
            <ClipboardDocumentCheckIcon className="w-5 h-5" />
            Audit Resume
          </button>
        </form>
      )}

      {/* Loading Scanning Screen */}
      {loading && (
        <div className="w-full max-w-xl bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center relative z-10 shadow-2xl animate-pulse">
          {/* Scanning animation bar */}
          <div className="relative w-24 h-24 mx-auto mb-8 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-slate-800"></div>
            <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
            <DocumentTextIcon className="w-10 h-10 text-emerald-400 animate-bounce" />
          </div>

          <h3 className="text-lg font-bold text-slate-200 mb-2">Analyzing Resume Metrics</h3>
          <p className="text-slate-400 text-xs sm:text-sm mb-6 h-6 transition-all duration-300">
            {scanningSteps[loadingStep]}
          </p>

          {/* Glowing bar */}
          <div className="w-full bg-slate-950/80 rounded-full h-2 overflow-hidden border border-white/5">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-500"
              style={{ width: `${((loadingStep + 1) / scanningSteps.length) * 100}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-2 font-bold">
            Audit in progress
          </p>
        </div>
      )}

      {/* Results Panel */}
      {results && !loading && (
        <div className="w-full max-w-6xl relative z-10 flex flex-col gap-8 animate-fade-in">

          {/* Back button & meta bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950/40 border border-white/5 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <DocumentTextIcon className="w-5 h-5" />
              </span>
              <div className="text-center sm:text-left">
                <p className="text-slate-300 text-xs uppercase font-bold tracking-wider">Audited File</p>
                <p className="text-slate-200 text-sm font-semibold truncate max-w-xs sm:max-w-md">{results.filename}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500 bg-slate-900 border border-white/5 px-2.5 py-1 rounded-full uppercase tracking-wider font-bold">
                {results.details.meta.pageCount} {results.details.meta.pageCount === 1 ? 'Page' : 'Pages'}
              </span>
              <span className="text-[10px] text-slate-500 bg-slate-900 border border-white/5 px-2.5 py-1 rounded-full uppercase tracking-wider font-bold">
                {results.details.meta.wordCount} Words
              </span>
              <button
                onClick={() => {
                  setResults(null);
                  setFile(null);
                }}
                className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-bold uppercase tracking-wider bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2 transition-all"
              >
                <ArrowPathIcon className="w-4 h-4" />
                Scan New
              </button>
            </div>
          </div>

          {/* Core Score Section (Radial Gauge + Factor Breakdown) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Overall Score Circle Card */}
            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-transparent to-transparent opacity-50 z-0"></div>

              <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-6 relative z-10">Overall ATS Score</p>

              {/* Radial gauge SVG */}
              <div className="relative w-36 h-36 flex items-center justify-center mb-6 z-10 transition-transform group-hover:scale-105 duration-300">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r={radius}
                    className="stroke-slate-800"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r={radius}
                    stroke="url(#gradient-score)"
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-1000 ease-out"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient-score" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute text-center flex flex-col">
                  <span className="text-4xl font-extrabold tracking-tight text-white SpaceGrotesk">
                    {results.overallScore}
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-0.5">/ 100</span>
                </div>
              </div>

              {/* Status Indicator */}
              <div className={`px-4 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-wider relative z-10 mb-4 ${getScoreBg(results.overallScore)} ${getScoreColor(results.overallScore)}`}>
                {getScoreRating(results.overallScore)}
              </div>

              <p className="text-slate-500 text-[11px] leading-relaxed relative z-10 max-w-[200px]">
                {results.overallScore >= 80
                  ? "Your resume has a strong layout and section indicators. Perfect for automated scans!"
                  : results.overallScore >= 60
                    ? "Decent score, but minor parsing triggers (formatting details, missing sections) need attention."
                    : "Critical fixes required. Layout anomalies or low keyword relevance might cause automatic failure."}
              </p>
            </div>

            {/* Section Scores grid */}
            <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-200 mb-4">Factor Breakdown</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                  {Object.entries(results.breakdown).map(([key, value]) => {
                    const config = factorConfig[key] || { label: key, weight: "", color: "emerald" };
                    return (
                      <div key={key} className="flex flex-col gap-1 bg-slate-950/20 border border-white/5 rounded-xl p-3">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-300 font-semibold">{config.label}</span>
                          <span className="text-slate-400 font-medium">
                            <span className="text-slate-200 font-bold">{value.score}</span> / {value.max}
                          </span>
                        </div>
                        {/* Custom visual progress bar */}
                        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-white/5">
                          <div
                            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-1000"
                            style={{ width: `${value.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <p className="text-[10px] text-slate-500 italic mt-4 text-right">Weights are dynamically adjusted by compliance logic.</p>
            </div>
          </div>

          {/* Issues Found & Suggestions lists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Issues Card */}
            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col">
              <h3 className="text-base font-bold text-slate-200 mb-4 flex items-center gap-2">
                <ExclamationTriangleIcon className="w-5 h-5 text-amber-500" />
                Issues Detected ({results.issues.length})
              </h3>

              {results.issues.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-slate-950/20 border border-white/5 rounded-2xl">
                  <CheckCircleIcon className="w-10 h-10 text-emerald-400 mb-2 animate-bounce" />
                  <p className="text-slate-200 text-sm font-semibold">No issues flagged!</p>
                  <p className="text-slate-500 text-xs">Your layout structure is clean and valid.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3 overflow-y-auto max-h-[300px] pr-2">
                  {results.issues.map((issue, idx) => (
                    <div key={idx} className="flex gap-3 bg-slate-950/30 border border-white/5 p-3 rounded-xl">
                      {issue.type === 'error' ? (
                        <XCircleIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <ExclamationTriangleIcon className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      )}
                      <p className="text-xs text-slate-300 font-medium leading-relaxed">{issue.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Suggestions Card */}
            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col">
              <h3 className="text-base font-bold text-slate-200 mb-4 flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5 text-emerald-400" />
                Recommended Action Items
              </h3>

              {/* Show AI suggestions if available, otherwise rules suggestions */}
              {results.aiSuggestions ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-1 text-[10px] text-amber-400 uppercase font-bold tracking-widest bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md self-start mb-1 animate-pulse">
                    AI Optimized Recommendations
                  </div>
                  <div className="flex flex-col gap-3 overflow-y-auto max-h-[280px] pr-2">
                    {results.aiSuggestions.map((suggestion, idx) => (
                      <div key={idx} className="flex gap-3 bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-xl">
                        <CheckCircleIcon className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-slate-300 font-medium leading-relaxed">{suggestion}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3 overflow-y-auto max-h-[300px] pr-2">
                  {results.suggestions.map((suggestion, idx) => (
                    <div key={idx} className="flex gap-3 bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-xl">
                      <CheckCircleIcon className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-300 font-medium leading-relaxed">{suggestion}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Interactive Details Tabs (Keywords, Sections, Formatting details) */}
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <div className="flex bg-slate-950/60 border-b border-white/5 scroll-x-auto">
              <button
                onClick={() => setActiveTab('summary')}
                className={`py-3.5 px-6 font-bold uppercase tracking-wider text-[11px] border-b-2 transition-all ${activeTab === 'summary'
                  ? 'bg-amber-500/25 text-amber-300 border-amber-400 shadow-lg shadow-amber-500/20'
                  : 'text-amber-400 border-amber-400 bg-transparent hover:bg-amber-500/10'
                  }`}
              >
                Auditor Summary
              </button>
              <button
                onClick={() => setActiveTab('keywords')}
                className={`py-3.5 px-6 font-bold uppercase tracking-wider text-[11px] border-b-2 transition-all ${activeTab === 'keywords'
                  ? 'bg-amber-500/25 text-amber-300 border-amber-400 shadow-lg shadow-amber-500/20'
                  : 'text-amber-400 border-amber-400 bg-transparent hover:bg-amber-500/10'
                  }`}
              >
                Keywords & Sections
              </button>
              <button
                onClick={() => setActiveTab('structure')}
                className={`py-3.5 px-6 font-bold uppercase tracking-wider text-[11px] border-b-2 transition-all ${activeTab === 'structure'
                  ? 'bg-amber-500/25 text-amber-300 border-amber-400 shadow-lg shadow-amber-500/20'
                  : 'text-amber-400 border-amber-400 bg-transparent hover:bg-amber-500/10'
                  }`}
              >
                Layout Integrity
              </button>
              <button
                onClick={() => setActiveTab('text')}
                className={`py-3.5 px-6 font-bold uppercase tracking-wider text-[11px] border-b-2 transition-all ${activeTab === 'text'
                  ? 'bg-amber-500/25 text-amber-300 border-amber-400 shadow-lg shadow-amber-500/20'
                  : 'text-amber-400 border-amber-400 bg-transparent hover:bg-amber-500/10'
                  }`}
              >
                Extracted Text
              </button>
            </div>

            <div className="p-6 sm:p-8">

              {/* Tab 1: Auditor Summary */}
              {activeTab === 'summary' && (
                <div className="animate-fade-in flex flex-col gap-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-950/40 p-4 rounded-2xl border border-white/5 text-center">
                      <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">Extracted Name</p>
                      <p className="text-slate-200 text-sm font-semibold truncate">{results.details.contact.name || "Not Detected"}</p>
                    </div>
                    <div className="bg-slate-950/40 p-4 rounded-2xl border border-white/5 text-center">
                      <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">Email Address</p>
                      <p className="text-slate-200 text-sm font-semibold truncate">{results.details.contact.email || "Not Detected"}</p>
                    </div>
                    <div className="bg-slate-950/40 p-4 rounded-2xl border border-white/5 text-center">
                      <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">Phone Number</p>
                      <p className="text-slate-200 text-sm font-semibold truncate">{results.details.contact.phone || "Not Detected"}</p>
                    </div>
                    <div className="bg-slate-950/40 p-4 rounded-2xl border border-white/5 text-center">
                      <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">LinkedIn Profile</p>
                      {results.details.contact.linkedin ? (
                        <a
                          href={results.details.contact.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-400 text-sm font-semibold hover:underline truncate block"
                        >
                          Profile Connected 🔗
                        </a>
                      ) : (
                        <p className="text-slate-500 text-sm font-semibold">Not Detected</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-950/30 border border-white/5 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0">
                      <DocumentTextIcon className="w-8 h-8" />
                    </div>
                    <div className="text-center sm:text-left">
                      <h4 className="text-sm font-bold text-slate-200 mb-1">Understanding compliance standards</h4>
                      <p className="text-slate-400 text-xs leading-relaxed max-w-2xl">
                        Applicant Tracking Systems parse documents line-by-line as raw plaintext. Any tables, decorative header blocks, graphics, or nested text boxes will break reading sequences. Matching keywords should occur within clear sentences under corresponding standard header tags to gain maximum scores.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Keywords & Sections */}
              {activeTab === 'keywords' && (
                <div className="animate-fade-in flex flex-col gap-6">
                  {/* Keywords Subsection */}
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-3">Skills & Technology Keywords Detected</h4>

                    {results.details.keywords.detected.length === 0 && results.details.keywords.missing.length === 0 ? (
                      <p className="text-slate-500 text-xs">No keywords scanned in this mode.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {results.details.keywords.detected.map(kw => (
                          <span key={kw} className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {kw}
                          </span>
                        ))}
                        {results.details.keywords.missing.map(kw => (
                          <span key={kw} className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-950/80 text-slate-500 border border-white/5 select-none line-through">
                            {kw}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-slate-500 text-[11px]">
                      {results.details.keywords.missing.length > 0
                        ? `Missing ${results.details.keywords.missing.length} primary skill keywords. Integrating these in your Experience or Projects section increases ATS relevancy match.`
                        : "Excellent! Your resume matches the scanned keyword profile."}
                    </p>
                  </div>

                  <hr className="border-white/5" />

                  {/* Sections Subsection */}
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-3">Structural Section Headers Detection</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                      {results.details.sections.detected.map(sec => (
                        <div key={sec} className="bg-slate-950/40 border border-emerald-500/20 p-3 rounded-xl flex items-center justify-between text-xs">
                          <span className="text-slate-300 font-semibold">{sec}</span>
                          <CheckCircleIcon className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        </div>
                      ))}
                      {results.details.sections.missing.map(sec => (
                        <div key={sec} className="bg-slate-950/40 border border-red-500/20 p-3 rounded-xl flex items-center justify-between text-xs opacity-60">
                          <span className="text-slate-400 font-medium">{sec}</span>
                          <XCircleIcon className="w-4 h-4 text-red-500 flex-shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Structure Details */}
              {activeTab === 'structure' && (
                <div className="animate-fade-in flex flex-col gap-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Bullet Points */}
                    <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 sm:p-5">
                      <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-3">Bullet Points & Action Verbs</h4>
                      <ul className="flex flex-col gap-3">
                        <li className="flex justify-between text-xs">
                          <span className="text-slate-400">Total Bullets Identified:</span>
                          <span className="text-slate-200 font-bold">{results.details.bullets.total}</span>
                        </li>
                        <li className="flex justify-between text-xs">
                          <span className="text-slate-400">Starting with Action Verbs:</span>
                          <span className="text-emerald-400 font-bold">{results.details.bullets.startingWithActionVerb}</span>
                        </li>
                      </ul>
                      {results.details.bullets.nonActionVerbBullets.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-white/5">
                          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">Passive Bullet Examples</p>
                          <div className="flex flex-col gap-2">
                            {results.details.bullets.nonActionVerbBullets.map((b, i) => (
                              <div key={i} className="text-xs text-slate-400 italic bg-slate-950 p-2 rounded-lg border border-white/5 leading-relaxed">
                                "{b}"
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Layout Rules */}
                    <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 sm:p-5">
                      <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-3">Layout Flags</h4>
                      <ul className="flex flex-col gap-3">
                        <li className="flex justify-between items-center text-xs">
                          <span className="text-slate-400">Tables or Grids:</span>
                          {results.details.formatting.hasTables ? (
                            <span className="text-red-400 font-bold flex items-center gap-1">Detected ❌</span>
                          ) : (
                            <span className="text-emerald-400 font-bold flex items-center gap-1">Clean Layout ✅</span>
                          )}
                        </li>
                        <li className="flex justify-between items-center text-xs">
                          <span className="text-slate-400">Fancy Special Symbols:</span>
                          {results.details.formatting.hasSpecialChars ? (
                            <span className="text-amber-400 font-bold flex items-center gap-1">Detected ⚠️</span>
                          ) : (
                            <span className="text-emerald-400 font-bold flex items-center gap-1">Clean Layout ✅</span>
                          )}
                        </li>
                        <li className="flex justify-between items-center text-xs">
                          <span className="text-slate-400">Multi-Column Layout:</span>
                          {results.details.formatting.hasMultipleColumns ? (
                            <span className="text-amber-400 font-bold flex items-center gap-1">Detected ⚠️</span>
                          ) : (
                            <span className="text-emerald-400 font-bold flex items-center gap-1">Clean Layout ✅</span>
                          )}
                        </li>
                        <li className="flex justify-between items-center text-xs">
                          <span className="text-slate-400">Scanned Document (Images):</span>
                          {results.details.formatting.hasImages ? (
                            <span className="text-red-400 font-bold flex items-center gap-1">Scanned PDF ❌</span>
                          ) : (
                            <span className="text-emerald-400 font-bold flex items-center gap-1">Searchable Text ✅</span>
                          )}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Extracted Text */}
              {activeTab === 'text' && (
                <div className="animate-fade-in">
                  <p className="text-slate-400 text-xs mb-3 leading-relaxed">
                    This is the plain text that was parsed from your resume file buffer. Verify that no word tokens are joined together incorrectly or truncated due to styling.
                  </p>
                  <div className="bg-slate-950 p-4 rounded-2xl border border-white/5 max-h-[300px] overflow-y-auto text-slate-300 font-mono text-xs leading-relaxed whitespace-pre-wrap select-all">
                    {results.parsedText || "Extracted text is unavailable."}
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      )}
    </div>
  );
}
