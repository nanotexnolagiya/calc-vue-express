const dotenv = require('dotenv');
dotenv.config();
const db = require('./db');

module.exports = {
    PORT: process.env.PORT || 3000,
    SESSION_SECRET: process.env.SESSION_SECRET,
    IS_PRODUCTION: process.env.NODE_ENV === 'production',
    DB_CONFIG: db
};