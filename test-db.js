require('dotenv').config();
const { Pool } = require('pg');

console.log('🔍 Testing database connection...');

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in environment');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

(async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Successfully connected to Neon Postgres');

    const res = await client.query('SELECT 1 as test');
    console.log('✅ Test query result:', res.rows);

    client.release();
    await pool.end();
    console.log('🎉 Connection test completed successfully');
  } catch (err) {
    console.error('❌ Database connection failed');
    console.error(err.message);
    process.exit(1);
  }
})();
