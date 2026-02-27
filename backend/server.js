const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const careerRoutes = require('./routes/careerRoutes');
const quizRoutes = require('./routes/quizRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/careers', careerRoutes);
app.use('/api/quiz', quizRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'CareerMap India API is running 🚀', timestamp: new Date() });
});

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/careermap';
const PORT = process.env.PORT || 5000;

mongoose
    .connect(MONGO_URI)
    .then(async () => {
        console.log('✅ MongoDB connected');
        // Seed data on first run
        const { seedDatabase } = require('./seedData');
        await seedDatabase();
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ MongoDB connection failed:', err.message);
        // Start server anyway so frontend isn't blocked
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT} (without DB)`);
        });
    });

module.exports = app;
