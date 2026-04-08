// server.js - Main Express server with session management
const express = require('express');
const session = require('express-session');
const pool = require('./db'); // make sure path is correct


const path = require('path');

const app = express();

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use('/uploads', express.static('public/uploads'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session configuration for cart persistence
app.use(session({
    secret: 'snack-store-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hours
}));
app.use((req, res, next) => {
    res.locals.isAdmin = req.session.isAdmin || false;
    next();
});
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});
// Import routes
const productsRouter = require('./routes/products');
const cartRouter = require('./routes/cart');

// Routes
app.use(express.static('public'));
app.use('/products', productsRouter);
app.use('/cart', cartRouter);
app.use('/checkout', require('./routes/checkout'));
app.use('/user', require('./routes/user'));
app.use((req, res, next) => {
    res.locals.title = 'Snack Store';
    next();
});

const adminRouter = require('./routes/admin');
app.use('/admin', adminRouter);

// Sample products data
const products = require('./data/products');

// Routes
// app.get('/', (req, res) => {
//    res.render('index', { 
//     title: 'Home',
//     products: products 
// });
// });
app.get('/', async (req, res) => {
    try {
        let query = 'SELECT * FROM products WHERE stock = true'; // ❌ no limit
        let values = [];

        if (req.query.category && req.query.category !== 'all') {
            query += ' AND LOWER(category) = LOWER($1)';
            values.push(req.query.category);
        }

        const result = await pool.query(query, values);

        res.render('index', {
            products: result.rows, // ✅ ALL PRODUCTS
            activeCategory: req.query.category || 'all',
            categories: ['chips', 'kurkure', 'biscuits', 'chocolates', 'drinks']
        });

    } catch (err) {
        console.error(err);
        res.send('Server Error');
    }
});
app.get('/product/:id', (req, res) => {
    const product = products.find(p => p.id == req.params.id);
    if (!product) {
        return res.status(404).send('Product not found');
    }
    res.render('product-detail', { 
    title: product.name,
    product 
});
});
app.get('/admin/orders', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
        res.render('admin-orders', { orders: result.rows });
    } catch (err) {
        console.error(err);
        res.send('Error loading orders');
    }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Snack Store running on http://localhost:${PORT}`);
});