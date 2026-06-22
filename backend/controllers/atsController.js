const { PDFParse } = require('pdf-parse');
const mammoth = require('mammoth');

// List of action verbs (case-insensitive)
const actionVerbs = [
  "built", "developed", "engineered", "designed", "implemented",
  "architected", "optimized", "deployed", "integrated", "led",
  "created", "managed", "improved", "reduced", "increased"
];

// Predefined tech/fresher keywords for generic mode
const techKeywords = [
  "React", "Node.js", "Python", "Java", "SQL", "REST API",
  "Git", "Docker", "PostgreSQL", "MongoDB", "TypeScript"
];

// Rich technical vocabulary to extract keywords from JD
const TECHNICAL_VOCABULARY = [
  "react", "node.js", "node", "python", "java", "sql", "rest api", "api", "git", "docker", 
  "postgresql", "postgres", "mongodb", "typescript", "javascript", "html", "css", "c++", "c#", 
  "ruby", "php", "swift", "go", "golang", "aws", "azure", "gcp", "kubernetes", "devops", 
  "ci/cd", "agile", "scrum", "project management", "machine learning", "ai", "data analysis", 
  "react native", "angular", "vue", "express", "django", "flask", "spring boot", "hibernate", 
  "redux", "graphql", "firebase", "linux", "webpack", "vite", "next.js", "nextjs", "svelte", 
  "tailwind", "bootstrap", "prisma", "sequelize", "redis", "elasticsearch", "testing", "jest", 
  "cypress", "qa", "mobile", "ios", "android", "ui/ux", "figma", "product management", 
  "marketing", "sales", "business development", "finance", "accounting", "hr", "customer support", 
  "data science", "analytics", "tensorflow", "pytorch", "c", "rust", "sass", "less", "jquery", 
  "oracle", "mysql", "sqlite", "nosql", "dynamodb", "microservices", "docker-compose", "bash", 
  "shell", "security", "cybersecurity", "blockchain", "solidity", "web3"
];

// Common English stopwords to filter when extracting keywords
const STOPWORDS = new Set([
  "the", "and", "a", "of", "to", "in", "is", "that", "it", "on", "for", "with", "as", "at", 
  "by", "an", "be", "this", "are", "from", "your", "our", "their", "we", "you", "or", "will", 
  "can", "should", "must", "have", "has", "had", "about", "job", "description", "requirements", 
  "responsibilities", "skills", "experience", "role", "work", "team", "development", "developer", 
  "engineer", "working", "using", "knowledge", "required", "preferred", "looking", "candidate"
]);

/**
 * Clean and normalize text
 */
function cleanText(text) {
  if (!text) return "";
  // Strip double spaces, keep spacing clean
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Extract keywords from job description
 */
function extractKeywordsFromJD(jdText) {
  if (!jdText) return [];
  const normalizedJD = jdText.toLowerCase();
  
  // Find technical vocabulary keywords matching in JD
  const foundTech = TECHNICAL_VOCABULARY.filter(keyword => {
    // Regex boundary check for word match (e.g. c++ or next.js needs manual escaping)
    const escaped = keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    return regex.test(normalizedJD);
  });

  if (foundTech.length > 0) {
    // Return capitalized versions for readability
    return foundTech.map(word => {
      // Find matching item in techKeywords to preserve case, or capitalize first letter
      const matchedTech = techKeywords.find(k => k.toLowerCase() === word);
      if (matchedTech) return matchedTech;
      return word.split('.').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('.');
    });
  }

  // Fallback to extracting distinct words of length >= 4, filtering stopwords
  const cleanWords = jdText
    .replace(/[^\w\s+#.-]/g, '') // Keep letters, spaces, + (C++), # (C#), . (Node.js)
    .split(/\s+/)
    .map(w => w.trim())
    .filter(w => w.length >= 4);

  const uniqueWords = new Set();
  cleanWords.forEach(w => {
    const lower = w.toLowerCase();
    if (!STOPWORDS.has(lower) && isNaN(Number(w))) {
      // Capitalize first letter
      uniqueWords.add(w.charAt(0).toUpperCase() + w.slice(1));
    }
  });

  return Array.from(uniqueWords).slice(0, 15); // limit to 15 keywords
}

/**
 * Core Scoring Engine
 */
function analyzeResumeText(text, fileMetadata, mode, jobDescriptionText) {
  const issues = [];
  const suggestions = [];
  
  const textCleaned = cleanText(text);
  const textLower = text.toLowerCase();
  
  // 1. File Format Check (5%)
  let fileFormatScore = 5;
  const isPdf = fileMetadata.extension === 'pdf';
  const isDocx = fileMetadata.extension === 'docx';
  
  if (!isPdf && !isDocx) {
    fileFormatScore = 0;
    issues.push({ type: "error", message: `Unsupported file format: .${fileMetadata.extension}` });
    suggestions.push("Upload your resume in PDF or DOCX format. Avoid formats like JPG, PNG, or TXT.");
  } else {
    // Perfect format
    fileFormatScore = 5;
  }

  // 2. Keyword Matching (25%)
  let keywordsToMatch = techKeywords;
  if (mode === 'jd' && jobDescriptionText) {
    const jdKeywords = extractKeywordsFromJD(jobDescriptionText);
    if (jdKeywords.length > 0) {
      keywordsToMatch = jdKeywords;
    }
  }

  const detectedKeywords = [];
  const missingKeywords = [];

  keywordsToMatch.forEach(kw => {
    const escaped = kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(textCleaned)) {
      detectedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  });

  const keywordMatchPercent = keywordsToMatch.length > 0 
    ? (detectedKeywords.length / keywordsToMatch.length) * 100 
    : 100;
  
  // Scaled keyword score
  const keywordScore = Math.round((detectedKeywords.length / Math.max(keywordsToMatch.length, 1)) * 25);

  if (missingKeywords.length > 0) {
    issues.push({ 
      type: "warning", 
      message: `Missing keywords: ${missingKeywords.slice(0, 4).join(', ')}${missingKeywords.length > 4 ? '...' : ''}` 
    });
    suggestions.push(`Integrate relevant keywords in context, e.g., ${missingKeywords.slice(0, 3).join(', ')}.`);
  }

  // 3. Section Detection (20%)
  const sectionSpecs = [
    { key: "experience", label: "Experience", regex: /experience|employment|work history|career history|professional background/i },
    { key: "education", label: "Education", regex: /education|academic|university|degree|schooling/i },
    { key: "skills", label: "Skills", regex: /skills|technologies|proficiencies|competencies|expertise|technical/i },
    { key: "summary", label: "Summary", regex: /summary|objective|profile|about me|personal statement/i },
    { key: "projects", label: "Projects", regex: /projects|key achievements|accomplishments/i },
    { key: "contact", label: "Contact", regex: /contact|personal info|address|phone|email/i }
  ];

  const detectedSections = [];
  const missingSections = [];
  let sectionScore = 0;

  sectionSpecs.forEach(spec => {
    // Check if section header is detected on a separate line or starts a paragraph
    if (spec.regex.test(text)) {
      detectedSections.push(spec.label);
      sectionScore += 20 / sectionSpecs.length;
    } else {
      missingSections.push(spec.label);
    }
  });

  sectionScore = Math.min(Math.round(sectionScore), 20);

  if (missingSections.length > 0) {
    issues.push({ type: "warning", message: `Missing sections: ${missingSections.join(', ')}` });
    missingSections.forEach(sec => {
      suggestions.push(`Add a distinct '${sec}' section header to help the ATS parser identify this information.`);
    });
  }

  // 4. Formatting Checks (15%)
  let formattingScore = 15;
  let hasTables = false;
  let hasSpecialChars = false;
  let hasMultipleColumns = false;
  let hasImages = false;

  // Detect tables: search for consecutive lines containing columns or tab blocks
  // Check for piping characters | or custom border characters +---+ or multiple spaces separating sections
  const pipeRegex = /\|/g;
  const matchPipes = text.match(pipeRegex);
  if (matchPipes && matchPipes.length > 5) {
    hasTables = true;
    formattingScore -= 4;
    issues.push({ type: "error", message: "Tables or grid layout detected — may break ATS parsing" });
    suggestions.push("Replace tables with simple lists or tab-spaced layouts, as tables break standard ATS parsing flow.");
  }

  // Detect special characters: ★ ● ◆ ■ ▲ ▼ ✔ ✘ ♦ • ➔ ❖
  const specialCharsRegex = /[★●◆■▲▼✔✘♦➔❖]/g;
  const matchSpecial = text.match(specialCharsRegex);
  if (matchSpecial && matchSpecial.length > 2) {
    hasSpecialChars = true;
    formattingScore -= 3;
    issues.push({ type: "warning", message: `Fancy symbols/bullets detected: ${Array.from(new Set(matchSpecial)).slice(0, 3).join(' ')}` });
    suggestions.push("Replace fancy bullet characters (stars, diamonds) with standard bullets (• or -) or clean formatting.");
  }

  // Check if text is too short for its file size (suggesting scanned image/logos)
  if (fileMetadata.size > 50000 && textCleaned.length < 300) {
    hasImages = true;
    formattingScore -= 4;
    issues.push({ type: "error", message: "Very little readable text extracted — file might be a scanned image/logo" });
    suggestions.push("Ensure your PDF is text-searchable, not a flattened image. Do not use online tools that output resumes as images.");
  }

  // Double columns check: look for large spacings inside lines which indicate tabular/columnar conversion
  const columnSpacingRegex = /[a-zA-Z0-9]{3,}\s{5,}[a-zA-Z0-9]{3,}/;
  if (columnSpacingRegex.test(text)) {
    hasMultipleColumns = true;
    formattingScore -= 4;
    issues.push({ type: "warning", message: "Potential multi-column layout detected" });
    suggestions.push("Use a clean, single-column layout. Multi-column templates often mix up text order when read by an ATS.");
  }

  formattingScore = Math.max(formattingScore, 0);

  // 5. Contact Info Checks (10%)
  let contactScore = 0;
  const contactDetails = {
    email: null,
    phone: null,
    linkedin: null,
    name: null
  };

  // Email regex
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i;
  const emailMatch = textCleaned.match(emailRegex);
  if (emailMatch) {
    contactDetails.email = emailMatch[0];
    contactScore += 2.5;
  } else {
    issues.push({ type: "error", message: "No email address detected" });
    suggestions.push("Include a professional email address in your contact information.");
  }

  // Phone regex: matches formats like +1 234 567 8900, 123-456-7890, (123) 456-7890
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const phoneMatch = textCleaned.match(phoneRegex);
  if (phoneMatch) {
    contactDetails.phone = phoneMatch[0];
    contactScore += 2.5;
  } else {
    issues.push({ type: "warning", message: "No phone number detected" });
    suggestions.push("Add a direct phone number so recruiters can easily reach out.");
  }

  // LinkedIn URL regex
  const linkedinRegex = /linkedin\.com\/in\/[a-zA-Z0-9_-]+/i;
  const linkedinMatch = textCleaned.match(linkedinRegex);
  if (linkedinMatch) {
    contactDetails.linkedin = `https://${linkedinMatch[0]}`;
    contactScore += 2.5;
  } else {
    issues.push({ type: "warning", message: "No LinkedIn URL detected" });
    suggestions.push("Include your LinkedIn profile link to showcase your complete professional network.");
  }

  // Name detection: Look at first 3 lines of text
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  let nameFound = false;
  if (lines.length > 0) {
    // Check if the first line looks like a name (contains words, is capitalized, doesn't contain common resume header words)
    const possibleName = lines[0];
    const uppercaseWords = possibleName.split(' ').filter(w => w[0] === w[0]?.toUpperCase());
    const isHeaderWord = /resume|cv|portfolio|curriculum|fresher|internship|job/i.test(possibleName);
    
    if (uppercaseWords.length >= 2 && !isHeaderWord && possibleName.length < 35) {
      contactDetails.name = possibleName;
      contactScore += 2.5;
      nameFound = true;
    }
  }

  if (!nameFound && lines.length > 1) {
    const possibleName = lines[1];
    const uppercaseWords = possibleName.split(' ').filter(w => w[0] === w[0]?.toUpperCase());
    const isHeaderWord = /resume|cv|portfolio|curriculum|fresher|internship|job/i.test(possibleName);
    if (uppercaseWords.length >= 2 && !isHeaderWord && possibleName.length < 35) {
      contactDetails.name = possibleName;
      contactScore += 2.5;
      nameFound = true;
    }
  }

  if (!nameFound) {
    issues.push({ type: "warning", message: "Name detection failed or not placed at the top" });
    suggestions.push("Place your full name in a large, clear font at the very top of your resume.");
  }

  contactScore = Math.min(contactScore, 10);

  // 6. Bullet Points (10%)
  // Find lines starting with bullets
  const bulletLines = text.split('\n')
    .map(l => l.trim())
    .filter(l => /^[•\-\*▪◦○♦▪\-]\s*/.test(l) || /^\d+\.\s+/.test(l));

  const totalBullets = bulletLines.length;
  let bulletPointsScore = 0;
  
  if (totalBullets >= 5) {
    bulletPointsScore = 10;
  } else if (totalBullets >= 1) {
    bulletPointsScore = 5;
    issues.push({ type: "warning", message: `Few bullet points detected (${totalBullets} found) — paragraphs are hard to scan` });
    suggestions.push("Write your project details and experience sections in bullet points rather than paragraphs.");
  } else {
    bulletPointsScore = 0;
    issues.push({ type: "error", message: "No bullet points detected in the experience/projects section" });
    suggestions.push("Always format your professional achievements as bullet points to improve recruiter readability.");
  }

  // 7. Length (5%)
  let lengthScore = 5;
  let estimatedPageCount = 1;
  
  if (isPdf && fileMetadata.pageCount) {
    estimatedPageCount = fileMetadata.pageCount;
  } else {
    // Heuristic: Word count. Under 600 words is typically 1 page, under 1200 is typically 2 pages.
    const wordCount = textCleaned.split(/\s+/).length;
    estimatedPageCount = Math.ceil(wordCount / 600) || 1;
  }

  if (estimatedPageCount > 2) {
    lengthScore = 2;
    issues.push({ type: "warning", message: `Resume length is ${estimatedPageCount} pages (longer than the recommended 2 pages)` });
    suggestions.push("For freshers, keep resumes strictly to 1 page. For experienced professionals, limit to 2 pages max.");
  }

  // 8. Action Verbs (5%)
  let actionVerbScore = 0;
  let nonActionVerbBullets = [];
  let actionVerbBulletsCount = 0;

  bulletLines.forEach(line => {
    // Strip bullet symbol and spaces
    const cleanLine = line.replace(/^[•\-\*▪◦○♦▪\-]\s*/, '').replace(/^\d+\.\s+/, '').trim();
    if (cleanLine.length === 0) return;
    const firstWord = cleanLine.split(/\s+/)[0].replace(/[^\w]/g, '').toLowerCase();
    
    if (actionVerbs.includes(firstWord)) {
      actionVerbBulletsCount++;
    } else {
      nonActionVerbBullets.push(cleanLine);
    }
  });

  const actionVerbRatio = totalBullets > 0 ? (actionVerbBulletsCount / totalBullets) : 0;
  if (totalBullets === 0) {
    actionVerbScore = 0;
  } else if (actionVerbRatio >= 0.7) {
    actionVerbScore = 5;
  } else if (actionVerbRatio >= 0.4) {
    actionVerbScore = 3;
    issues.push({ type: "warning", message: `${totalBullets - actionVerbBulletsCount} bullet points don't start with action verbs` });
    suggestions.push("Begin your bullet points with strong action verbs (e.g., 'Built', 'Engineered', 'Optimized') instead of passive statements like 'Responsible for' or 'Helped'.");
  } else {
    actionVerbScore = 1;
    issues.push({ type: "warning", message: "Most bullet points lack strong action verbs" });
    suggestions.push("Revise experience details to start each bullet point with a powerful action verb.");
  }

  // 9. Readability (5%)
  let readabilityScore = 5;
  const wordCount = textCleaned.split(/\s+/).length;
  
  // Dense text check: if the text lacks paragraph breaks (very long lines or average line length > 120 chars)
  const avgLineLength = lines.length > 0 ? (textCleaned.length / lines.length) : 0;
  if (avgLineLength > 120) {
    readabilityScore -= 2;
    issues.push({ type: "warning", message: "Resume layout is dense or text is grouped in wide columns" });
    suggestions.push("Shorten sentence line length and use comfortable padding/line-height to make it readable.");
  }

  // Check if word count is too dense (e.g. over 800 words on 1 page)
  if (estimatedPageCount === 1 && wordCount > 750) {
    readabilityScore -= 2;
    issues.push({ type: "warning", message: "High information density: over 750 words on a single page" });
    suggestions.push("Condense your content, remove fluff, and ensure there is enough whitespace for visual comfort.");
  }

  readabilityScore = Math.max(readabilityScore, 1);

  // Aggregate Overall Score
  const overallScore = keywordScore + sectionScore + formattingScore + contactScore + bulletPointsScore + fileFormatScore + lengthScore + actionVerbScore + readabilityScore;

  return {
    overallScore: Math.round(Math.min(overallScore, 100)),
    breakdown: {
      keywordMatch: { score: keywordScore, max: 25, percentage: Math.round(keywordMatchPercent) },
      sectionDetection: { score: sectionScore, max: 20, percentage: Math.round((sectionScore / 20) * 100) },
      formatting: { score: formattingScore, max: 15, percentage: Math.round((formattingScore / 15) * 100) },
      contactInfo: { score: contactScore, max: 10, percentage: Math.round((contactScore / 10) * 100) },
      bulletPoints: { score: bulletPointsScore, max: 10, percentage: Math.round((bulletPointsScore / 10) * 100) },
      fileFormat: { score: fileFormatScore, max: 5, percentage: Math.round((fileFormatScore / 5) * 100) },
      length: { score: lengthScore, max: 5, percentage: Math.round((lengthScore / 5) * 100) },
      actionVerbs: { score: actionVerbScore, max: 5, percentage: Math.round((actionVerbScore / 5) * 100) },
      readability: { score: readabilityScore, max: 5, percentage: Math.round((readabilityScore / 5) * 100) }
    },
    details: {
      sections: {
        detected: detectedSections,
        missing: missingSections
      },
      keywords: {
        detected: detectedKeywords,
        missing: missingKeywords
      },
      contact: contactDetails,
      formatting: {
        hasTables,
        hasSpecialChars,
        hasMultipleColumns,
        hasImages
      },
      bullets: {
        total: totalBullets,
        startingWithActionVerb: actionVerbBulletsCount,
        nonActionVerbBullets: nonActionVerbBullets.slice(0, 3)
      },
      meta: {
        pageCount: estimatedPageCount,
        wordCount
      }
    },
    issues,
    suggestions: Array.from(new Set(suggestions)).slice(0, 5) // Return unique suggestions capped at 5
  };
}

/**
 * Controller endpoint to handle resume file upload and trigger analysis
 */
exports.analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "Please upload a resume file (PDF or DOCX)." });
    }

    const { mode = 'generic', jobDescription = '' } = req.body;
    const fileBuffer = req.file.buffer;
    const originalname = req.file.originalname;
    const extension = originalname.split('.').pop().toLowerCase();
    
    let extractedText = '';
    let pageCount = 0;

    if (extension === 'pdf') {
      try {
        const parser = new PDFParse({ data: fileBuffer });
        const textResult = await parser.getText();
        const info = await parser.getInfo();
        await parser.destroy();
        extractedText = textResult.text;
        pageCount = info.total || 0;
      } catch (pdfErr) {
        console.error("PDF Parsing Error:", pdfErr);
        return res.status(422).json({ 
          success: false, 
          error: "Failed to extract text from the PDF. Make sure it is not corrupted or password-protected." 
        });
      }
    } else if (extension === 'docx') {
      try {
        const mammothResult = await mammoth.extractRawText({ buffer: fileBuffer });
        extractedText = mammothResult.value;
      } catch (docxErr) {
        console.error("DOCX Parsing Error:", docxErr);
        return res.status(422).json({ 
          success: false, 
          error: "Failed to extract text from the DOCX file. Make sure it is not corrupted." 
        });
      }
    } else {
      return res.status(400).json({ 
        success: false, 
        error: "Invalid file format. Only PDF and DOCX files are allowed." 
      });
    }

    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(422).json({ 
        success: false, 
        error: "Extracted text is empty. The resume might be scanned as an image or empty." 
      });
    }

    const fileMetadata = {
      extension,
      size: req.file.size,
      pageCount
    };

    // Analyze text with scoring factors
    const analysis = analyzeResumeText(extractedText, fileMetadata, mode, jobDescription);

    // OPTIONAL: OpenAI Integration for AI powered smart recommendations
    if (process.env.OPENAI_API_KEY) {
      try {
        const { OpenAI } = require('openai');
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        
        const prompt = `You are an expert ATS (Applicant Tracking System) Auditor. Analyze the following extracted resume text (and optionally the job description) and its rules-based score breakdown. Generate 3-4 professional, highly actionable improvements for the candidate to increase their ATS score. Keep them specific, short, and bulleted.
        
        Resume text: "${extractedText.slice(0, 2000)}"
        ${jobDescription ? `Job Description: "${jobDescription.slice(0, 1500)}"` : ''}
        Overall Score: ${analysis.overallScore}/100
        Breakdown: ${JSON.stringify(analysis.breakdown)}
        `;

        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 300,
          temperature: 0.7
        });

        const aiSuggestions = response.choices[0].message.content
          .split('\n')
          .map(l => l.replace(/^[*\-\d\.\s]+/, '').trim())
          .filter(l => l.length > 0);

        if (aiSuggestions && aiSuggestions.length > 0) {
          // Merge or override suggestions
          analysis.aiSuggestions = aiSuggestions;
        }
      } catch (aiErr) {
        console.error("OpenAI suggestions failure, falling back to rule-based: ", aiErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      filename: originalname,
      ...analysis
    });

  } catch (error) {
    console.error("Analyze Resume Server Error:", error);
    return res.status(500).json({ success: false, error: "An internal server error occurred during analysis." });
  }
};
