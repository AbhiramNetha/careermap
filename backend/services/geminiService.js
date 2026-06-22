const { GoogleGenerativeAI } = require('@google/generative-ai');
const { buildPrompt } = require('../prompts/resumePrompt');

// Support up to 3 Gemini API keys with rotation on 429
const API_KEYS = [
  process.env.GEMINI_KEY_1,
  process.env.GEMINI_KEY_2,
  process.env.GEMINI_KEY_3,
].filter(Boolean); // Remove undefined keys

let currentKeyIndex = 0;

/**
 * Generate resume content using Gemini AI with key rotation
 */
async function generateResumeContent(userData, jdKeywords) {
  if (API_KEYS.length === 0) {
    throw new Error('NO_API_KEYS: No Gemini API keys configured. Add GEMINI_KEY_1 to your .env file.');
  }

  const prompt = buildPrompt(userData, jdKeywords);

  for (let attempt = 0; attempt < API_KEYS.length; attempt++) {
    try {
      const key = API_KEYS[currentKeyIndex];
      const genAI = new GoogleGenerativeAI(key);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      // Strip markdown fences if AI adds them
      const clean = text
        .replace(/```json\s*/gi, '')
        .replace(/```\s*/g, '')
        .trim();

      const parsed = JSON.parse(clean);
      return parsed;

    } catch (error) {
      console.error(`Gemini key [${currentKeyIndex}] failed:`, error.message);

      if (error.status === 429 || error.message?.includes('429')) {
        // Rate limited — rotate to next key
        currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
        continue;
      }

      // JSON parse error — try to fix and parse again
      if (error instanceof SyntaxError) {
        throw new Error('AI returned malformed JSON. Please try again.');
      }

      throw error;
    }
  }

  throw new Error('ALL_KEYS_EXHAUSTED');
}

/**
 * Extract relevant tech keywords from a job description
 */
function extractKeywords(jdText) {
  const TECH_KEYWORDS = [
    // Languages
    'python', 'java', 'javascript', 'typescript', 'c++', 'c#', 'ruby', 'go', 'rust', 'kotlin', 'swift',
    // Frontend
    'react', 'react.js', 'angular', 'vue', 'next.js', 'tailwind', 'bootstrap', 'html', 'css', 'sass',
    // Backend
    'node.js', 'express', 'spring boot', 'django', 'fastapi', 'flask', 'laravel', 'graphql', 'rest api',
    // Database
    'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'firebase', 'dynamodb', 'elasticsearch',
    // DevOps / Cloud
    'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'linux', 'git', 'github', 'ci/cd', 'jenkins',
    // Tools & Concepts
    'redux', 'microservices', 'agile', 'scrum', 'jira', 'figma', 'webpack', 'vite',
    'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'pandas', 'numpy',
    // Mobile
    'react native', 'flutter', 'android', 'ios',
  ];

  const jdLower = jdText.toLowerCase();
  return TECH_KEYWORDS.filter(kw => jdLower.includes(kw));
}

module.exports = { generateResumeContent, extractKeywords };
