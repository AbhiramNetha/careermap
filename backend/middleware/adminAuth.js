// Simple in-memory admin auth using JWT
// Admin credentials are stored in .env

const jwt = require('jsonwebtoken');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@careermap.in';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123';
const JWT_SECRET = process.env.JWT_SECRET || 'careermap_admin_secret_2024';

function adminLogin(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    const token = jwt.sign(
        { email, isAdmin: true },
        JWT_SECRET,
        { expiresIn: '24h' }
    );

    res.json({
        success: true,
        token,
        admin: { email, name: 'Admin' }
    });
}

function verifyAdmin(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Admin token required' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded.isAdmin) {
            return res.status(403).json({ error: 'Not authorized as admin' });
        }
        req.admin = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired admin token' });
    }
}

module.exports = { adminLogin, verifyAdmin };
