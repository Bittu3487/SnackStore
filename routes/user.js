const express = require('express');
const router = express.Router();
const pool = require('../db');
const nodemailer = require('nodemailer');
const env = require('dotenv')
env.config();

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// ✅ EMAIL CONFIG (CHECK APP PASSWORD)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // ✔ correct email
        pass: process.env.PASS // ❗ paste again (no space)
    }
});

// 🔐 Login Page
router.get('/login', (req, res) => {
    res.render('login');
});

// 📝 Register Page
router.get('/register', (req, res) => {
    res.render('register');
});

// 📝 Handle Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const otp = generateOTP();
        console.log("OTP:", otp);

        // ✅ FIXED QUERY
        await pool.query(
            'INSERT INTO users (name, email, password, otp, is_verified) VALUES ($1,$2,$3,$4,$5)',
            [name, email, password, otp, false]
        );

        // ✅ SEND MAIL (TRY)
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'OTP Verification',
                text: `Your OTP is ${otp}`
            });
        } catch (mailErr) {
            console.log("Email failed ❌ using console OTP instead");
        }

        res.render('verify-otp', { email });

    } catch (err) {
        console.error(err);
        res.send("Register error");
    }
});

// 🔐 VERIFY OTP
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;

        const result = await pool.query(
            'SELECT * FROM users WHERE email=$1 AND otp=$2',
            [email, otp]
        );

        if (result.rows.length === 0) {
            return res.send("Invalid OTP ❌");
        }

        await pool.query(
            'UPDATE users SET is_verified=true, otp=NULL WHERE email=$1',
            [email]
        );

        res.redirect('/user/login');

    } catch (err) {
        console.error(err);
        res.send("OTP error");
    }
});

// 🔐 LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await pool.query(
            'SELECT * FROM users WHERE email=$1 AND password=$2',
            [email, password]
        );

        if (result.rows.length === 0) {
            return res.send('Invalid credentials ❌');
        }

        const user = result.rows[0];

        if (!user.is_verified) {
            return res.send("Verify OTP first ❌");
        }

        req.session.user = user;

        res.redirect('/products');

    } catch (err) {
        console.error(err);
        res.send('Login error');
    }
});

// 🚪 Logout
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

module.exports = router;