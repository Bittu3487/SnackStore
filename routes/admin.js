const express = require('express');
const router = express.Router();
const pool = require('../db');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const env = require('dotenv')
env.config();

// 🔐 Admin credentials
const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASS = process.env.ADMIN_PASS;

// ✅ Admin middleware (clean way)
function isAdmin(req, res, next) {
    if (!req.session.isAdmin) {
        return res.redirect('/admin/login');
    }
    next();
}

// ✅ Multer config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 2 }
});

// ================= AUTH =================

// Login page
router.get('/login', (req, res) => {
    res.render('admin-login');
});

// Login handle
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === ADMIN_USER && password === ADMIN_PASS) {
        req.session.isAdmin = true;
        return res.redirect('/admin/orders');
    }

    res.send('Invalid credentials');
});

// ================= ORDERS =================

// View orders
router.get('/orders', isAdmin, async (req, res) => {
    const result = await pool.query('SELECT * FROM orders ORDER BY id DESC');
    res.render('admin-orders', { orders: result.rows });
});

// Delete order
router.post('/orders/delete/:id', isAdmin, async (req, res) => {
    await pool.query('DELETE FROM orders WHERE id=$1', [req.params.id]);
    res.redirect('/admin/orders');
});

// ================= PRODUCTS =================

// View products
router.get('/products', isAdmin, async (req, res) => {
    const result = await pool.query('SELECT * FROM products ORDER BY id DESC');
    res.render('admin-products', { products: result.rows });
});

// ➕ ADD PRODUCT
router.post('/products/add', isAdmin, upload.single('image'), async (req, res) => {
    try {
        const { name, price, brand } = req.body;

        if (!req.file) {
            return res.send("Image required ❌");
        }

        const tempPath = req.file.path;
        const fileName = Date.now() + ".jpg";
        const newPath = path.join(__dirname, '..', 'public/uploads', fileName);

        await sharp(tempPath)
            .resize(400, 400)
            .jpeg({ quality: 70 })
            .toFile(newPath);

        await pool.query(
            'INSERT INTO products (name, price, brand, image, stock) VALUES ($1,$2,$3,$4,true)',
            [name, price, brand, fileName]
        );

        res.redirect('/admin/products');

    } catch (err) {
        console.error(err);
        res.send("Add product error");
    }
});

// ✏️ EDIT PRODUCT
router.post('/products/edit/:id', isAdmin, upload.single('image'), async (req, res) => {
    try {
        const { name, price, brand } = req.body;
        const id = req.params.id;

        if (req.file) {
            const image = req.file.filename;

            await pool.query(
                'UPDATE products SET name=$1, price=$2, brand=$3, image=$4 WHERE id=$5',
                [name, price, brand, image, id]
            );
        } else {
            await pool.query(
                'UPDATE products SET name=$1, price=$2, brand=$3 WHERE id=$4',
                [name, price, brand, id]
            );
        }

        res.redirect('/admin/products');

    } catch (err) {
        console.error(err);
        res.send("Edit error");
    }
});

// ❌ DELETE PRODUCT (🔥 THIS WAS MISSING)
router.post('/products/delete/:id', isAdmin, async (req, res) => {
    try {
        await pool.query('DELETE FROM products WHERE id=$1', [req.params.id]);
        res.redirect('/admin/products');
    } catch (err) {
        console.error(err);
        res.send("Delete error");
    }
});

// 🔁 TOGGLE STOCK
router.post('/products/toggle/:id', isAdmin, async (req, res) => {
    await pool.query(
        'UPDATE products SET stock = NOT stock WHERE id = $1',
        [req.params.id]
    );

    res.redirect('/admin/products');
});

module.exports = router;