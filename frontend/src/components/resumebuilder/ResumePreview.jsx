import { useRef } from 'react';
import AtsScoreBadge, { calculateAtsScore } from './AtsScoreBadge';
import DownloadButtons from './DownloadButtons';

/**
 * Generate full HTML string for the resume (used for preview & PDF print)
 */
export function generateResumeHTML(resumeData, isPrint = false) {
  const { personalInfo, summary, education, skills, experience, projects } = resumeData;

  const contactLine = [personalInfo?.email, personalInfo?.phone, personalInfo?.location]
    .filter(Boolean)
    .join(' &nbsp;|&nbsp; ');

  const linksLine = [
    personalInfo?.linkedin ? `LinkedIn: ${personalInfo.linkedin}` : '',
    personalInfo?.github ? `GitHub: ${personalInfo.github}` : '',
    personalInfo?.portfolio ? `Portfolio: ${personalInfo.portfolio}` : '',
  ]
    .filter(Boolean)
    .join(' &nbsp;|&nbsp; ');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Inter', 'Segoe UI', sans-serif;
    font-size: 10.5pt;
    line-height: 1.45;
    color: #1e293b;
    background: #ffffff;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .container {
    max-width: 780px;
    margin: 0 auto;
    padding: ${isPrint ? '0' : '24px'};
  }

  /* ── Header ─────────────────────────────────── */
  .header { border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 0; }
  .name { font-size: 24pt; font-weight: 700; color: #0f172a; letter-spacing: -0.5px; }
  .contact-line { font-size: 9pt; color: #64748b; margin-top: 5px; }
  .links-line { font-size: 9pt; color: #0284c7; margin-top: 3px; }

  /* ── Section ─────────────────────────────────── */
  .section { margin-top: 13px; }
  .section-title {
    font-size: 9.5pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #0f172a;
    border-bottom: 1px solid #cbd5e1;
    padding-bottom: 3px;
    margin-bottom: 8px;
  }

  /* ── Summary ─────────────────────────────────── */
  .summary-text { font-size: 9.5pt; color: #334155; line-height: 1.55; text-align: justify; }

  /* ── Experience / Projects ───────────────────── */
  .entry { margin-bottom: 10px; }
  .entry-top { display: flex; justify-content: space-between; align-items: baseline; }
  .entry-title { font-size: 10pt; font-weight: 700; color: #0f172a; }
  .entry-date { font-size: 8.5pt; color: #64748b; }
  .entry-sub { display: flex; justify-content: space-between; font-size: 9pt; color: #64748b; font-style: italic; margin-top: 1px; }
  .tech-badge { font-size: 8.5pt; color: #0284c7; font-weight: 600; margin-top: 2px; }
  ul { margin-left: 16px; margin-top: 5px; }
  li { font-size: 9pt; color: #475569; margin-bottom: 3px; line-height: 1.4; }

  /* ── Education ───────────────────────────────── */
  .edu-top { display: flex; justify-content: space-between; align-items: baseline; }
  .edu-degree { font-size: 10pt; font-weight: 700; color: #0f172a; }
  .edu-year { font-size: 8.5pt; color: #64748b; }
  .edu-college { font-size: 9pt; color: #64748b; margin-top: 1px; }

  /* ── Skills ──────────────────────────────────── */
  .skill-line { font-size: 9.5pt; color: #334155; margin-bottom: 4px; }
  .skill-label { font-weight: 700; color: #0f172a; }

  @media print {
    body { background: white; }
    .container { padding: 0; }
    @page { size: A4; margin: 12mm 15mm; }
  }
</style>
</head>
<body>
<div class="container">

  <!-- Header -->
  <div class="header">
    <div class="name">${personalInfo?.name || 'Your Name'}</div>
    <div class="contact-line">${contactLine}</div>
    ${linksLine ? `<div class="links-line">${linksLine}</div>` : ''}
  </div>

  ${summary ? `
  <div class="section">
    <div class="section-title">Professional Summary</div>
    <div class="summary-text">${summary}</div>
  </div>` : ''}

  ${experience?.length ? `
  <div class="section">
    <div class="section-title">Professional Experience</div>
    ${experience.map(exp => `
    <div class="entry">
      <div class="entry-top">
        <span class="entry-title">${exp.role || ''}</span>
        <span class="entry-date">${exp.duration || ''}</span>
      </div>
      <div class="entry-sub"><span>${exp.company || ''}</span></div>
      ${exp.bullets?.length ? `<ul>${exp.bullets.map(b => `<li>${b}</li>`).join('')}</ul>` : ''}
    </div>`).join('')}
  </div>` : ''}

  ${projects?.length ? `
  <div class="section">
    <div class="section-title">Projects</div>
    ${projects.map(proj => `
    <div class="entry">
      <div class="entry-title">${proj.name || ''}</div>
      ${proj.techStack ? `<div class="tech-badge">Tech Stack: ${proj.techStack}</div>` : ''}
      ${proj.liveUrl ? `<div style="font-size:8.5pt;color:#64748b;margin-top:2px;">🔗 ${proj.liveUrl}</div>` : ''}
      ${proj.bullets?.length ? `<ul>${proj.bullets.map(b => `<li>${b}</li>`).join('')}</ul>` : ''}
    </div>`).join('')}
  </div>` : ''}

  ${education?.length ? `
  <div class="section">
    <div class="section-title">Education</div>
    ${education.map(edu => `
    <div class="entry">
      <div class="edu-top">
        <span class="edu-degree">${edu.degree || ''} in ${edu.specialization || ''}</span>
        <span class="edu-year">${edu.year || ''}</span>
      </div>
      <div class="edu-college">${edu.college || ''}${edu.cgpa ? ` &nbsp;|&nbsp; CGPA: ${edu.cgpa}` : ''}</div>
    </div>`).join('')}
  </div>` : ''}

  ${skills ? `
  <div class="section">
    <div class="section-title">Key Skills</div>
    ${skills.technical?.length ? `<div class="skill-line"><span class="skill-label">Technical: </span>${skills.technical.join(', ')}</div>` : ''}
    ${skills.soft?.length ? `<div class="skill-line"><span class="skill-label">Soft Skills: </span>${skills.soft.join(', ')}</div>` : ''}
  </div>` : ''}

</div>
</body>
</html>`;
}

export default function ResumePreview({ resumeData, keywords, onDownload }) {
  const iframeRef = useRef(null);
  const printIframeRef = useRef(null);

  const score = calculateAtsScore(resumeData, keywords);

  const handlePrintPDF = () => {
    const iframe = printIframeRef.current;
    if (!iframe) return;

    const html = generateResumeHTML(resumeData, true);
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    doc.open();
    doc.write(html);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    }, 400);
  };

  const handleDownload = async (format) => {
    if (format === 'pdf') {
      handlePrintPDF();
    } else {
      onDownload(format); // DOCX goes to backend
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* ATS Score */}
      <AtsScoreBadge score={score} keywords={keywords} resumeData={resumeData} />

      {/* Download Buttons */}
      <DownloadButtons onDownload={handleDownload} />

      {/* A4 Preview Frame */}
      <div className="flex-1 rounded-xl overflow-hidden border border-white/10 bg-white shadow-xl" style={{ minHeight: '600px' }}>
        <iframe
          ref={iframeRef}
          srcDoc={generateResumeHTML(resumeData)}
          className="w-full h-full border-none"
          style={{ minHeight: '600px' }}
          title="Resume Preview"
        />
      </div>

      {/* Hidden iframe for printing only */}
      <iframe
        ref={printIframeRef}
        style={{ display: 'none', position: 'absolute', width: 0, height: 0 }}
        title="Print Resume"
      />
    </div>
  );
}
