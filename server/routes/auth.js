const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { verifyToken } = require('../middleware/authMiddleware');

// Validations
const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16}$)/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 1. SIGNUP (For Normal Users)
router.post('/signup', async (req, res) => {
    const { name, email, password, address } = req.body;

    // Assignment Validations
    if (!name || name.length < 20 || name.length > 60) {
        return res.status(400).json({ msg: "Name must be between 20 and 60 characters." });
    }
    if (!emailRegex.test(email)) {
        return res.status(400).json({ msg: "Invalid email format." });
    }
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ msg: "Password must be 8-16 chars, include 1 uppercase and 1 special char." });
    }
    if (address && address.length > 400) {
        return res.status(400).json({ msg: "Address cannot exceed 400 characters." });
    }

    try {
        const [exists] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (exists.length > 0) return res.status(400).json({ msg: "User already exists." });

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.execute(
            'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, address, 'User']
        );

        res.status(201).json({ msg: "User registered successfully." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. LOGIN (For all roles)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) return res.status(404).json({ msg: "User not found." });

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: { id: user.id, name: user.name, role: user.role }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. CHANGE PASSWORD (Required functionality)
router.post('/change-password', verifyToken, async (req, res) => {
    const { newPassword } = req.body;

    if (!passwordRegex.test(newPassword)) {
        return res.status(400).json({ msg: "New password does not meet security requirements." });
    }

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.userId]);
        res.json({ msg: "Password updated successfully." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;