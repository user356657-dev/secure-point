const db = require('./db');

//Prepared statements for safe db query execution to prevent attacks such as SQLi.
module.exports = {
    run: (query, params = []) => db.prepare(query).run(params),
    get: (query, params = []) => db.prepare(query).get(params),
    all: (query, params = []) => db.prepare(query).all(params),
}