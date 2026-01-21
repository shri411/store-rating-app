const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken } = require('../middleware/authMiddleware');
const bcrypt = require('bcryptjs');

// Middleware to check if user is Admin
const isAdmin = (req, res, next) => {
    if (req.userRole !== 'Admin') return res.status(403).json({ msg: "Admin access denied" });
    next();
};

// 1. Get Dashboard Stats
router.get('/stats', verifyToken, isAdmin, async (req, res) => {
    try {
        const [[userCount]] = await db.execute('SELECT COUNT(*) as total FROM users');
        const [[storeCount]] = await db.execute('SELECT COUNT(*) as total FROM stores');
        const [[ratingCount]] = await db.execute('SELECT COUNT(*) as total FROM ratings');
        
        res.json({
            users: userCount.total,
            stores: storeCount.total,
            ratings: ratingCount.total
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Add New Store/User (Admin only)
router.post('/add-user', verifyToken, isAdmin, async (req, res) => {
    const { name, email, password, address, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        await db.execute(
            'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, address, role]
        );
        res.json({ msg: "User added successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Get All Stores (with calculated average rating)
router.get('/stores', verifyToken, isAdmin, async (req, res) => {
    try {
        const [stores] = await db.execute(`
            SELECT s.*, AVG(r.rating_value) as avg_rating 
            FROM stores s 
            LEFT JOIN ratings r ON s.id = r.store_id 
            GROUP BY s.id
        `);
        res.json(stores);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;