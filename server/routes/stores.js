const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken } = require('../middleware/authMiddleware');

// 1. Submit or Update Rating (Normal User)
router.post('/rate', verifyToken, async (req, res) => {
    if (req.userRole !== 'User') return res.status(403).json({ msg: "Only normal users can rate" });
    
    const { store_id, rating_value } = req.body;
    try {
        await db.execute(
            'INSERT INTO ratings (user_id, store_id, rating_value) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE rating_value = ?',
            [req.userId, store_id, rating_value, rating_value]
        );
        res.json({ msg: "Rating submitted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. NEW: Get All Stores (Access for User & Admin)
// This fixes the 403 error in UserDashboard
router.get('/all', verifyToken, async (req, res) => {
    try {
        const [stores] = await db.execute(`
            SELECT s.id, s.name, s.address, AVG(r.rating_value) as avg_rating
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id
            GROUP BY s.id
        `);
        res.json(stores);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Store Owner Dashboard
router.get('/my-store/stats', verifyToken, async (req, res) => {
    if (req.userRole !== 'StoreOwner') return res.status(403).json({ msg: "Access denied" });

    try {
        const [stats] = await db.execute(`
            SELECT s.name, AVG(r.rating_value) as avg_rating, COUNT(r.id) as total_ratings
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id
            WHERE s.owner_id = ?
            GROUP BY s.id
        `, [req.userId]);

        const [raters] = await db.execute(`
            SELECT u.name, r.rating_value, r.updated_at
            FROM ratings r
            JOIN users u ON r.user_id = u.id
            JOIN stores s ON r.store_id = s.id
            WHERE s.owner_id = ?
        `, [req.userId]);

        res.json({ stats: stats[0] || { name: "No Store Assigned", avg_rating: 0, total_ratings: 0 }, raters });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;