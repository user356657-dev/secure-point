const db = require('./db');

function initDB() {
    //USERS TABLE
    db.exec(`
       CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        is_active INTEGER DEFAULT 1,
        failed_attempts INTEGER DEFAULT 0,
        lock_until INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
       ) 
    `);

    // LOGS
    db.exec(`
       CREATE TABLE IF NOT EXISTS logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        action TEXT,
        status TEXT,
        ip_address TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
       )
    `);
}

module.exports = initDB;