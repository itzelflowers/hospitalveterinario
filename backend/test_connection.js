// backend/test_connection.js
const pool = require('./db');

async function test() {
  try {
    const [rows] = await pool.query('SELECT NOW() as now');
    console.log('✅ Conexión exitosa:', rows[0]);
  } catch (err) {
    console.error('❌ Error de conexión:', err.message);
  } finally {
    process.exit();
  }
}

test();
