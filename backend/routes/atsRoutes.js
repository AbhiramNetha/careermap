const express = require('express');
const router = express.Router();
const multer = require('multer');
const { analyzeResume } = require('../controllers/atsController');

// Multer memory storage configuration - files are kept in memory as buffer
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file extension
    const ext = file.originalname.split('.').pop().toLowerCase();
    if (ext === 'pdf' || ext === 'docx') {
      return cb(null, true);
    }
    cb(new Error('Invalid file format. Only PDF and DOCX are allowed.'));
  }
});

// Route for analyzing resume text & generating score breakdown
router.post('/analyze', (req, res, next) => {
  upload.single('resume')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, error: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ success: false, error: err.message });
    }
    next();
  });
}, analyzeResume);

module.exports = router;
