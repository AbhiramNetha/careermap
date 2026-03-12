const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/database');
const careerRoutes = require('./routes/careerRoutes');
const quizRoutes = require('./routes/quizRoutes');
const courseRoutes = require('./routes/courseRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/careers', careerRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api', courseRoutes);           // /api/courses, /api/admin/...
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'CareerMap India API is running 🚀', db: 'PostgreSQL', timestamp: new Date() });
});

// PostgreSQL connection + sync tables + start server
const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('✅ PostgreSQL connected');

        // Sync all models (creates tables if they don't exist)
        await sequelize.sync({ alter: false });
        console.log('✅ Database tables synced');

        // Seed data on first run
        const { seedDatabase } = require('./seedData');
        await seedDatabase();

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('❌ PostgreSQL connection failed:', err.message);
        // Start server anyway so frontend isn't blocked
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Server running on port ${PORT} (without DB)`);
        });
    }
}

startServer();

module.exports = app;
