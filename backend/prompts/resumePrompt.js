const buildPrompt = (userData, jdKeywords) => `
You are an expert ATS resume writer for Indian freshers and engineering graduates.

Generate a professional, ATS-optimized resume using the following user data:
${JSON.stringify(userData, null, 2)}

Job Description Keywords to include naturally throughout the resume:
${jdKeywords.join(', ')}

STRICT RULES:
- Every experience and project bullet MUST start with a strong action verb (Built, Developed, Engineered, Designed, Implemented, Optimized, Led, Architected, Created, Deployed, Reduced, Increased, Automated)
- Naturally include JD keywords in bullet points and summary — do NOT force them awkwardly
- Professional Summary must be 3-4 lines maximum, focused on skills and value proposition
- Keep all bullet points concise, impactful and quantified where possible (mention metrics like 25%, 3x, etc.)
- Use single-column layout structure only
- If experience array is empty, leave the experience array empty — do not fabricate experience
- If projects array is empty, leave it empty — do not fabricate projects
- Return ONLY valid JSON with absolutely no extra text, no markdown code fences, no explanation

Return exactly this JSON structure:
{
  "personalInfo": {
    "name": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "github": "",
    "portfolio": ""
  },
  "summary": "",
  "education": [
    {
      "degree": "",
      "specialization": "",
      "college": "",
      "cgpa": "",
      "year": ""
    }
  ],
  "skills": {
    "technical": [],
    "soft": []
  },
  "experience": [
    {
      "company": "",
      "role": "",
      "duration": "",
      "bullets": []
    }
  ],
  "projects": [
    {
      "name": "",
      "techStack": "",
      "liveUrl": "",
      "bullets": []
    }
  ]
}
`;

module.exports = { buildPrompt };
