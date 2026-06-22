/**
 * Compute a numeric ATS score (0-100) based on:
 *  - keyword matching (60 pts)
 *  - section completeness (40 pts)
 */
export function calculateAtsScore(resumeData, keywords) {
  if (!resumeData) return 0;

  // Section score (up to 40 pts)
  const sections = {
    summary: !!resumeData.summary,
    education: resumeData.education?.length > 0,
    technicalSkills: resumeData.skills?.technical?.length > 0,
    experience: resumeData.experience?.length > 0,
    projects: resumeData.projects?.length > 0,
  };
  const sectionScore = Object.values(sections).filter(Boolean).length * 8; // 5 sections × 8 = 40

  // Keyword score (up to 60 pts)
  let keywordScore = 0;
  if (keywords?.length > 0) {
    const resumeText = JSON.stringify(resumeData).toLowerCase();
    const matched = keywords.filter((kw) => resumeText.includes(kw.toLowerCase()));
    keywordScore = Math.round((matched.length / keywords.length) * 60);
  } else {
    keywordScore = 55; // no JD = assume decent match
  }

  return Math.min(sectionScore + keywordScore, 100);
}

export default function AtsScoreBadge({ score, keywords, resumeData }) {
  const computedScore = score ?? calculateAtsScore(resumeData, keywords);

  const getColor = (s) => {
    if (s >= 80) return { ring: 'stroke-emerald-400', text: 'text-emerald-400', bg: 'bg-emerald-500/10', badge: 'Excellent' };
    if (s >= 65) return { ring: 'stroke-amber-400', text: 'text-amber-400', bg: 'bg-amber-500/10', badge: 'Good' };
    return { ring: 'stroke-red-400', text: 'text-red-400', bg: 'bg-red-500/10', badge: 'Needs Work' };
  };

  const { ring, text, bg, badge } = getColor(computedScore);

  // SVG donut dimensions
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (computedScore / 100) * circumference;

  // Matched keywords
  const resumeText = resumeData ? JSON.stringify(resumeData).toLowerCase() : '';
  const matched = (keywords || []).filter((kw) => resumeText.includes(kw.toLowerCase()));

  return (
    <div className={`rounded-2xl border border-white/10 p-4 ${bg} flex flex-col gap-3`}>
      <div className="flex items-center gap-4">
        {/* Donut chart */}
        <svg width="90" height="90" viewBox="0 0 90 90" className="flex-shrink-0">
          {/* Background circle */}
          <circle cx="45" cy="45" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
          {/* Progress circle */}
          <circle
            cx="45"
            cy="45"
            r={radius}
            fill="none"
            className={ring}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 45 45)"
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
          <text
            x="45"
            y="49"
            textAnchor="middle"
            className={`font-bold text-base fill-current ${text}`}
            fontSize="18"
            fontWeight="700"
          >
            {computedScore}
          </text>
        </svg>

        {/* Score label */}
        <div>
          <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">ATS Score</p>
          <p className={`text-2xl font-extrabold ${text}`}>{computedScore}<span className="text-sm font-normal">/100</span></p>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
            computedScore >= 80
              ? 'border-emerald-500/30 text-emerald-400'
              : computedScore >= 65
              ? 'border-amber-500/30 text-amber-400'
              : 'border-red-500/30 text-red-400'
          }`}>
            {badge}
          </span>
        </div>
      </div>

      {/* Matched Keywords */}
      {keywords?.length > 0 && (
        <div>
          <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-2">
            JD Keywords Matched ({matched.length}/{keywords.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {keywords.map((kw) => {
              const isMatch = resumeText.includes(kw.toLowerCase());
              return (
                <span
                  key={kw}
                  className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${
                    isMatch
                      ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
                      : 'border-slate-700 text-slate-500 bg-slate-900/50'
                  }`}
                >
                  {isMatch ? '✓' : '✗'} {kw}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
