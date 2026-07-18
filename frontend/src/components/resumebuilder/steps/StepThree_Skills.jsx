import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';

const inputCls = 'resume-builder-input';
const labelCls = 'block text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1.5';

function TagInput({ tags, onAdd, onRemove, placeholder, accentColor = 'emerald' }) {
  const [inputVal, setInputVal] = useState('');

  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && inputVal.trim()) {
      e.preventDefault();
      const tag = inputVal.trim().replace(/,$/, '');
      if (tag && !tags.includes(tag)) {
        onAdd(tag);
      }
      setInputVal('');
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1.5 min-h-[28px]">
        {tags.map((tag) => (
          <span
            key={tag}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
              accentColor === 'amber'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            }`}
          >
            {tag}
            <button
              type="button"
              onClick={() => onRemove(tag)}
              className="hover:text-white transition-colors ml-0.5"
            >
              <XMarkIcon className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={inputCls}
      />
      <p className="text-slate-600 text-[10px]">Press Enter or comma to add a skill</p>
    </div>
  );
}

export default function StepThree_Skills({ onNext, onBack, defaultValues }) {
  const [techSkills, setTechSkills] = useState(defaultValues?.technicalSkills || []);
  const [softSkills, setSoftSkills] = useState(defaultValues?.softSkills || []);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (techSkills.length === 0) {
      setError('Please add at least one technical skill.');
      return;
    }
    setError('');
    onNext({ technicalSkills: techSkills, softSkills });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-bold text-slate-100 mb-0.5">Skills</h2>
        <p className="text-slate-500 text-xs">Add your technical and soft skills as tags.</p>
      </div>

      {/* Technical Skills */}
      <div>
        <label className={labelCls}>
          Technical Skills <span className="text-red-400">*</span>
        </label>
        <TagInput
          tags={techSkills}
          onAdd={(t) => setTechSkills((prev) => [...prev, t])}
          onRemove={(t) => setTechSkills((prev) => prev.filter((s) => s !== t))}
          placeholder="e.g. React.js, Node.js, Python... (press Enter)"
          accentColor="emerald"
        />
        {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
      </div>

      {/* Soft Skills */}
      <div>
        <label className={labelCls}>
          Soft Skills <span className="text-slate-600 font-normal normal-case">(optional)</span>
        </label>
        <TagInput
          tags={softSkills}
          onAdd={(t) => setSoftSkills((prev) => [...prev, t])}
          onRemove={(t) => setSoftSkills((prev) => prev.filter((s) => s !== t))}
          placeholder="e.g. Leadership, Communication... (press Enter)"
          accentColor="amber"
        />
      </div>

      {/* Quick suggestions */}
      <div>
        <p className={labelCls}>Common suggestions (click to add)</p>
        <div className="flex flex-wrap gap-1.5">
          {['JavaScript', 'Python', 'React.js', 'Node.js', 'SQL', 'Git', 'Docker', 'REST API', 'MongoDB', 'AWS'].map(
            (s) => (
              <button
                key={s}
                type="button"
                onClick={() => !techSkills.includes(s) && setTechSkills((p) => [...p, s])}
                disabled={techSkills.includes(s)}
                className="text-[10px] px-2 py-0.5 rounded-full border border-slate-700 text-slate-400 hover:border-emerald-500/40 hover:text-emerald-400 transition-all disabled:opacity-30"
              >
                {s}
              </button>
            )
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 rounded-xl bg-slate-900 border border-white/10 text-sm font-bold text-slate-300 hover:border-white/20 transition-all"
        >
          ← Back
        </button>
        <button
          type="submit"
          className="flex-[2] py-3 rounded-xl bg-emerald-500 text-slate-950 text-sm font-bold uppercase tracking-wider hover:bg-emerald-400 transition-all"
        >
          Continue — Experience →
        </button>
      </div>
    </form>
  );
}
