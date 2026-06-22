const rateLimit = require('express-rate-limit');

/**
 * Strict limiter for the AI generation endpoint
 * 5 requests per 15 minutes per IP
 */
const resumeGenerateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    success: false,
    error: 'Too many resume generation requests. Please wait 15 minutes and try again.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * General API limiter for download routes
 * 20 requests per 10 minutes per IP
 */
const downloadLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    error: 'Too many download requests. Please slow down.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { resumeGenerateLimiter, downloadLimiter };
