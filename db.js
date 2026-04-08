const { Pool } = require('pg');

let pool;

console.log("DATABASE_URL:", process.env.DATABASE_URL);
if (process.env.DATABASE_URL) {
    // ✅ Render (Production)
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });
} else {
    // ✅ Local
    pool = new Pool({
        user: process.env.USER,
        host: process.env.HOST,
        database: process.env.DATABASE,
        password: process.env.PASSWORD,
        port: process.env.PORT,
    });
}

module.exports = pool;