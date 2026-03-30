require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 5000;

const initDB = require('./src/config/initDb');
initDB();

const seedAdmin = require('./src/config/seed');
seedAdmin();

app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`);
})