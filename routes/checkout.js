// routes/checkout.js
// const express = require('express');
// const pool = require('../db');
// const router = express.Router();

// router.get('/', (req, res) => {
//     const cart = req.session.cart || [];
//     const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

//     if (cart.length === 0) {
//         return res.redirect('/cart');
//     }

//     res.render('checkout', { cart, total });
// });

// router.post('/complete', (req, res) => {
//     const { name, address, phone } = req.body;

//     const cart = req.session.cart || [];
//     const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

//     // ✅ STORE BEFORE CLEARING
//     const order = {
//         name,
//         address,
//         phone,
//         items: cart,
//         total
//     };

//     req.session.cart = []; // clear cart

//     res.render('checkout-success', { order });
// });
// router.post('/complete', async (req, res) => {
//     const { name, address, phone } = req.body;

//     const cart = req.session.cart || [];
//     const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

//     try {
//         // ✅ Insert order into DB
//         const result = await pool.query(
//             'INSERT INTO orders (name, phone, address, total) VALUES ($1, $2, $3, $4) RETURNING *',
//             [name, phone, address, total]
//         );

//         const order = {
//             ...result.rows[0],
//             items: cart
//         };

//         req.session.cart = [];

//         res.render('checkout-success', { order });

//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Database error');
//     }
// });

// module.exports = router;
// routes/checkout.js
const express = require('express');
const pool = require('../db');
const router = express.Router();
const env = require('dotenv')
env.config();
// GET checkout page
router.get('/', (req, res) => {
    const cart = req.session.cart || [];
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (cart.length === 0) {
        return res.redirect('/cart');
    }

    res.render('checkout', { cart, total });
});

// POST complete order (FINAL CLEAN VERSION)
router.post('/complete', async (req, res) => {
    const { name, address, phone, house_no, pin_code } = req.body;

    const cart = req.session.cart || [];
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    try {
        // ✅ Insert everything in ONE table
        const result = await pool.query(
            `INSERT INTO orders 
            (name, phone, address, house_no, pin_code, items, total) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) 
            RETURNING *`,
            [
                name,
                phone,
                address,
                house_no,
                pin_code,
                JSON.stringify(cart), // 🔥 store items as JSON
                total
            ]
        );

        const order = {
            ...result.rows[0],
            items: cart,
            total
        };

        // ✅ WhatsApp message
        let message = `🛒 New Order\n\n`;
        message += `👤 Name: ${name}\n`;
        message += `📞 Phone: ${phone}\n`;
        message += `🏠 House No: ${house_no}\n`;
        message += `📍 Address: ${address}\n`;
        message += `📮 PIN: ${pin_code}\n\n`;

        message += `🧾 Items:\n`;
        cart.forEach(item => {
            message += `- ${item.name} x${item.quantity} = ₹${item.price * item.quantity}\n`;
        });

        message += `\n💰 Total: ₹${total}`;

        const whatsappURL = `https://wa.me/${process.env.MOBILE_NUMBER}?text=${encodeURIComponent(message)}`;

        req.session.cart = [];

        res.render('checkout-success', { order, whatsappURL });

    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});

module.exports = router;