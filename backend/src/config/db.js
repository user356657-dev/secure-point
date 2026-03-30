const Database = require('better-sqlite3');

const db = new Database('too-secure.db');

//enable foreign keys for cross-table communication
db.exec('PRAGMA foreign_keys = ON');

module.exports = db;