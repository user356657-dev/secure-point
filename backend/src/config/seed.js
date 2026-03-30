const bcrypt = require('bcrypt');
const db = require('./db');

async function seedAdmin() {
    const email = 'admin@yahoo.com';
    const password = 'AdminPass132';

    const existing = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

    if(!existing) {
        const hash = await bcrypt.hash(password, 10);

        db.prepare(`INSERT INTO users (email, password_hash, role) VALUES (?, ?, 'admin')`).run(email, hash);

        console.log('Admin created');
        //console.log("Admin detail: ", db.prepare(`SELECT email from users WHERE role = 'admin'`).run(email, hash))
    }
}

module.exports = seedAdmin;