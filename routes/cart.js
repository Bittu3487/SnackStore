const express = require('express');
const router = express.Router();
const pool = require('../db'); // ✅ DB use karo

// ✅ VIEW CART
router.get('/', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/user/login');
    }

    const cart = req.session.cart || [];
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.render('cart', {
        cartItems: cart,
        total
    });
});

// ✅ ADD TO CART (🔥 FIXED)
router.post('/add/:id', async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ error: 'Login required' });
        }

        const productId = Number(req.params.id);

        // ✅ DATABASE se product lao
        const result = await pool.query(
            'SELECT * FROM products WHERE id = $1',
            [productId]
        );

        const product = result.rows[0];

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        if (!req.session.cart) {
            req.session.cart = [];
        }

        const existingItem = req.session.cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            req.session.cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }

        return res.json({ success: true });

    } catch (err) {
        console.error("CART ERROR:", err);
        return res.status(500).json({ error: 'Server error' });
    }
});

// ✅ UPDATE
router.post('/update/:id', (req, res) => {
    const productId = Number(req.params.id);
    const quantity = parseInt(req.body.quantity);

    const cart = req.session.cart || [];

    const item = cart.find(i => i.id === productId);

    if (item) {
        if (quantity <= 0) {
            req.session.cart = cart.filter(i => i.id !== productId);
        } else {
            item.quantity = quantity;
        }
    }

    res.json({ success: true });
});

// ✅ REMOVE
router.post('/remove/:id', (req, res) => {
    const productId = Number(req.params.id);

    req.session.cart = (req.session.cart || []).filter(i => i.id !== productId);

    res.json({ success: true });
});

module.exports = router;