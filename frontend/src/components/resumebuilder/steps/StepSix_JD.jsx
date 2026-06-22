import { useState, useEffect } from 'react';
import { SparklesIcon } from '@heroicons/react/24/solid';

const TECH_KEYWORDS = [
  'react', 'react.js', 'node.js', 'python', 'java', 'javascript', 'typescript',
  'sql', 'mongodb', 'postgresql', 'docker', 'git', 'rest api', 'express',
  'spring boot', 'next.js', 'tailwind', 'aws', 'mysql', 'redux', 'graphql',
  'microservices', 'agile', 'linux', 'c++', 'c#', 'angular', 'vue', 'firebase',
  'redis', 'kubernetes', 'ci/cd', 'machine learning', 'deep learning', 'flutter',
  'react native', 'figma', 'django', 'fastapi', 'sass', 'webpack', 'vite',
];

function extractKeywordsLocal(text) {
  const lower = text.toLowerCase();
  return TECH_KEYWORDS.filter((kw) => lower.includes(kw));
}

export default function StepSix_JD({ onGenerate, onBack, loading }) {
  const [jdText, setJdText] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [error, setError] = useState('');

  // Auto-extract keywords as user types
  useEffect(() => {
    if (jdText.length > 50) {
      const extracted = extractKeywordsLocal(jdText);
      setKeywords(extracted);
    } else {
      setKeywords([]);
    }
  }, [jdText]);

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!jdText.trim() || jdText.length < 50) {
      setError('Please paste a complete job description (at least 50 characters).');
      return;
    }
    if (!targetRole.trim()) {
      setError('Please enter your target role.');
      return;
    }
    setError('');
    onGenerate({ jdText, targetRole, extractedKeywords: keywords });
  };

  return (
    <form onSubmit={handleGenerate} className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-bold text-slate-100 mb-0.5">Job Description</h2>
        <p className="text-slate-500 text-xs">Paste the JD from any job portal — AI will tailor your resume to it.</p>
      </div>

      {/* Target Role */}
      <div>
        <label className="block text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1.5">
          Target Role <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
          placeholder="e.g. Full Stack Developer, Data Analyst, Backend Engineer..."
          className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-emerald-500 transition-all placeholder-slate-600"
        />
      </div>

      {/* JD Textarea */}
      <div>
        <label className="block text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1.5">
          Job Description <span className="text-red-400">*</span>
        </label>
        <textarea
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          rows={10}
          placeholder={`Paste the full job description here...

Example:
We are looking for a Full Stack Developer with experience in React.js, Node.js, and PostgreSQL. The candidate should be familiar with REST APIs, Docker, and Git. Experience with AWS is a plus...`}
          className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:border-emerald-500 transition-all placeholder-slate-600 resize-none"
        />
        <p className="text-slate-600 text-[10px] mt-1">{jdText.length} characters</p>
      </div>

      {/* Extracted Keywords */}
      {keywords.length > 0 && (
        <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
          <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider mb-2">
            ✓ Auto-Detected Keywords ({keywords.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {keywords.map((kw) => (
              <span
                key={kw}
                className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-medium"
              >
                {kw}
              </span>
            ))}
          </div>
          <p className="text-slate-600 text-[10px] mt-2">These keywords will be naturally woven into your resume</p>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
          {error}
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3 mt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="flex-1 py-3 rounded-xl bg-slate-900 border border-white/10 text-sm font-bold text-slate-300 hover:border-white/20 transition-all disabled:opacity-50"
        >
          ← Back
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-[2] py-3 rounded-xl bg-amber-500 text-slate-950 text-sm font-bold uppercase tracking-wider hover:bg-amber-400 transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Generating Resume...
            </>
          ) : (
            <>
              <SparklesIcon className="w-4 h-4" />
              🚀 Generate My Resume
            </>
          )}
        </button>
      </div>
    </form>
  );
}
