// routes/products.js - Product listing with filtering
// const express = require('express');
// const router = express.Router();
// const products = require('../data/products');

// router.get('/', (req, res) => {
//     let filteredProducts = products;
    
//     // Filter by category
//     if (req.query.category) {
//         filteredProducts = products.filter(p => p.category === req.query.category);
//     }
    
//     // Search functionality
//     if (req.query.search) {
//         const searchTerm = req.query.search.toLowerCase();
//         filteredProducts = filteredProducts.filter(p => 
//             p.name.toLowerCase().includes(searchTerm) ||
//             p.brand.toLowerCase().includes(searchTerm)
//         );
//     }
    
//     res.render('products', { 
//         products: filteredProducts, 
//         categories: ['chips', 'kurkure', 'biscuits', 'chocolates', 'drinks'],
//         activeCategory: req.query.category || 'all'
//     });
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const pool = require('../db');

// ✅ PRODUCTS PAGE (DB BASED)
router.get('/', async (req, res) => {
    try {
        let query = 'SELECT * FROM products WHERE stock = true';
        let values = [];

        // ✅ CATEGORY FILTER
        if (req.query.category && req.query.category !== 'all') {
            query += ' AND category = $1';
            values.push(req.query.category);
        }

        // ✅ SEARCH FILTER
        if (req.query.search) {
            if (values.length > 0) {
                query += ` AND (name ILIKE $${values.length + 1} OR brand ILIKE $${values.length + 1})`;
            } else {
                query += ' AND (name ILIKE $1 OR brand ILIKE $1)';
            }
            values.push(`%${req.query.search}%`);
        }

        const result = await pool.query(query, values);

        res.render('products', {
            products: result.rows,
            categories: ['chips', 'kurkure', 'biscuits', 'chocolates', 'drinks'],
            activeCategory: req.query.category || 'all'
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;