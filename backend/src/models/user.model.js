const db = require('../config/db.helper');

//Using ? symbol to prevent input fields from executing SQL queries directly, thus, preventing SQLi.
function findByEmail(email) {
    return db.get('SELECT * FROM users WHERE email = ?', [email]);
}

function createUser({ email, password_hash, role }) {
    return db.run(
        'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)', [email, password_hash, role || 'user']
    );
}

function updateFailedAttempts(id, attempts, lockUntil) {
    return db.run(
        'UPDATE users SET failed_attempts = ?, lock_until = ? WHERE id = ?', [attempts, lockUntil, id]
    );
}

module.exports = {
    findByEmail,
    createUser,
    updateFailedAttempts,
};