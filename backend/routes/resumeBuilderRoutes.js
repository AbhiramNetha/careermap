const express = require('express');
const router = express.Router();
const { generateResumeContent, extractKeywords } = require('../services/geminiService');
const { generateDOCX } = require('../services/docxService');
const { resumeGenerateLimiter, downloadLimiter } = require('../middleware/rateLimiter');

/**
 * POST /api/resume/generate
 * Receives full user form data + JD text
 * Extracts keywords → generates resume via Gemini AI
 */
router.post('/generate', resumeGenerateLimiter, async (req, res) => {
  try {
    const { userData, jdText } = req.body;

    if (!userData || !jdText) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userData and jdText.',
      });
    }

    // Extract relevant keywords from the JD
    const jdKeywords = extractKeywords(jdText);

    // Call Gemini AI to generate resume content
    const resumeData = await generateResumeContent(userData, jdKeywords);

    res.json({
      success: true,
      resumeData,
      extractedKeywords: jdKeywords,
    });

  } catch (error) {
    console.error('Resume generation error:', error.message);

    if (error.message === 'ALL_KEYS_EXHAUSTED') {
      return res.status(503).json({
        success: false,
        error: 'AI service is temporarily unavailable (rate limit). Please try again in a few minutes.',
      });
    }

    if (error.message?.startsWith('NO_API_KEYS')) {
      return res.status(500).json({
        success: false,
        error: 'Gemini API not configured. Please add GEMINI_KEY_1 to your backend .env file.',
      });
    }

    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/resume/extract-keywords
 * Lightweight endpoint — just extract JD keywords without AI
 */
router.post('/extract-keywords', (req, res) => {
  try {
    const { jdText } = req.body;
    if (!jdText) return res.status(400).json({ success: false, error: 'jdText is required.' });

    const keywords = extractKeywords(jdText);
    res.json({ success: true, keywords });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/resume/download/docx
 * Generate and stream a DOCX file from resume data
 */
router.post('/download/docx', downloadLimiter, async (req, res) => {
  try {
    const { resumeData } = req.body;
    if (!resumeData) return res.status(400).json({ success: false, error: 'resumeData is required.' });

    const docxBuffer = await generateDOCX(resumeData);
    const name = resumeData.personalInfo?.name?.replace(/\s+/g, '_') || 'Resume';

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${name}_Resume.docx"`);
    res.send(docxBuffer);

  } catch (error) {
    console.error('DOCX generation error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
