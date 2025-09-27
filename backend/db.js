const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'app',
  password: process.env.DB_PASS || 'apppwd',
  database: process.env.DB_NAME || 'pawhospital',
  port: process.env.DB_PORT || 3306
});

module.exports = pool;
