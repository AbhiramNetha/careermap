const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
  HeadingLevel,
} = require('docx');

/**
 * Build a simple styled TextRun
 */
const bold = (text, size = 22) =>
  new TextRun({ text: text || '', bold: true, size, font: 'Calibri' });

const normal = (text, size = 20) =>
  new TextRun({ text: text || '', size, font: 'Calibri' });

const muted = (text, size = 18) =>
  new TextRun({ text: text || '', size, color: '64748B', font: 'Calibri' });

const accent = (text, size = 20) =>
  new TextRun({ text: text || '', size, color: '0EA5E9', font: 'Calibri' });

/**
 * Section title paragraph with bottom border
 */
const sectionTitle = (text) =>
  new Paragraph({
    children: [bold(text.toUpperCase(), 22)],
    border: {
      bottom: { color: '0F172A', size: 6, style: BorderStyle.SINGLE },
    },
    spacing: { before: 280, after: 120 },
  });

/**
 * Generate DOCX buffer from resume data
 */
async function generateDOCX(resumeData) {
  const { personalInfo, summary, education, skills, experience, projects } = resumeData;

  const children = [
    // ── Name ──────────────────────────────────────────────────────────────────
    new Paragraph({
      children: [bold(personalInfo?.name || 'Name', 48)],
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
    }),

    // ── Contact Line ──────────────────────────────────────────────────────────
    new Paragraph({
      children: [
        muted(
          [personalInfo?.email, personalInfo?.phone, personalInfo?.location]
            .filter(Boolean)
            .join('  |  '),
          18
        ),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
    }),

    // ── Links ─────────────────────────────────────────────────────────────────
    new Paragraph({
      children: [
        ...(personalInfo?.linkedin ? [accent(`LinkedIn: ${personalInfo.linkedin}  `, 18)] : []),
        ...(personalInfo?.github ? [accent(`GitHub: ${personalInfo.github}  `, 18)] : []),
        ...(personalInfo?.portfolio ? [accent(`Portfolio: ${personalInfo.portfolio}`, 18)] : []),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
    }),

    // ── Divider ───────────────────────────────────────────────────────────────
    new Paragraph({
      border: { bottom: { color: '0F172A', size: 12, style: BorderStyle.SINGLE } },
      spacing: { after: 20 },
    }),

    // ── Summary ───────────────────────────────────────────────────────────────
    ...(summary
      ? [
          sectionTitle('Professional Summary'),
          new Paragraph({
            children: [normal(summary)],
            spacing: { after: 80 },
          }),
        ]
      : []),

    // ── Experience ────────────────────────────────────────────────────────────
    ...(experience?.length
      ? [
          sectionTitle('Professional Experience'),
          ...experience.flatMap((exp) => [
            new Paragraph({
              children: [
                bold(`${exp.role || ''}`, 22),
                normal(`  @  ${exp.company || ''}`, 22),
              ],
              spacing: { before: 120, after: 40 },
            }),
            new Paragraph({
              children: [muted(exp.duration || '')],
              spacing: { after: 60 },
            }),
            ...(exp.bullets || []).map(
              (b) =>
                new Paragraph({
                  bullet: { level: 0 },
                  children: [normal(b)],
                  spacing: { after: 40 },
                })
            ),
          ]),
        ]
      : []),

    // ── Projects ──────────────────────────────────────────────────────────────
    ...(projects?.length
      ? [
          sectionTitle('Projects'),
          ...projects.flatMap((proj) => [
            new Paragraph({
              children: [
                bold(proj.name || '', 22),
                ...(proj.techStack ? [accent(`  |  ${proj.techStack}`, 18)] : []),
              ],
              spacing: { before: 120, after: 40 },
            }),
            ...(proj.liveUrl
              ? [
                  new Paragraph({
                    children: [muted(`Live: ${proj.liveUrl}`, 17)],
                    spacing: { after: 40 },
                  }),
                ]
              : []),
            ...(proj.bullets || []).map(
              (b) =>
                new Paragraph({
                  bullet: { level: 0 },
                  children: [normal(b)],
                  spacing: { after: 40 },
                })
            ),
          ]),
        ]
      : []),

    // ── Education ─────────────────────────────────────────────────────────────
    ...(education?.length
      ? [
          sectionTitle('Education'),
          ...education.flatMap((edu) => [
            new Paragraph({
              children: [
                bold(`${edu.degree || ''} in ${edu.specialization || ''}`, 22),
                muted(`   ${edu.year || ''}`, 20),
              ],
              spacing: { before: 100, after: 40 },
            }),
            new Paragraph({
              children: [
                muted(`${edu.college || ''}${edu.cgpa ? `   |   CGPA: ${edu.cgpa}` : ''}`),
              ],
              spacing: { after: 80 },
            }),
          ]),
        ]
      : []),

    // ── Skills ────────────────────────────────────────────────────────────────
    ...(skills
      ? [
          sectionTitle('Key Skills'),
          ...(skills.technical?.length
            ? [
                new Paragraph({
                  children: [bold('Technical:  ', 20), normal(skills.technical.join(', '))],
                  spacing: { after: 60 },
                }),
              ]
            : []),
          ...(skills.soft?.length
            ? [
                new Paragraph({
                  children: [bold('Soft Skills:  ', 20), normal(skills.soft.join(', '))],
                  spacing: { after: 60 },
                }),
              ]
            : []),
        ]
      : []),
  ];

  const doc = new Document({
    creator: 'Way2Fresher Resume Builder',
    title: `${personalInfo?.name || 'Resume'} — Resume`,
    description: 'AI-generated ATS-optimized resume by Way2Fresher',
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, bottom: 720, left: 1080, right: 1080 },
          },
        },
        children,
      },
    ],
  });

  return await Packer.toBuffer(doc);
}

module.exports = { generateDOCX };
