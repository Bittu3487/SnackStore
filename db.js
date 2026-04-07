const { Pool } = require('pg');
require('dotenv').config();

let pool;

if (process.env.DATABASE_URL) {
    // ✅ Render / Production
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });
} else {
    // ✅ Local PostgreSQL
    pool = new Pool({
        user: process.env.USER,
        host: process.env.HOST,
        database: process.env.NAME,
        password: process.env.PASS,
        port: process.env.PORT,
    });
}

module.exports = pool;