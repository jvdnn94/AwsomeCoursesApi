const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  
  // تنظیمات SSL برای اتصال امن به Supabase در محیط Production (Render)
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  
  // ⬇️  ! مستقیماً به سوکت می‌گوید فقط از IPv4 استفاده کند
  family: 4, 
  
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// تست اتصال هنگام شروع برنامه
pool.connect()
  .then(client => {
    console.log('✅ با موفقیت به Supabase PostgreSQL متصل شد');
    client.release();
  })
  .catch(err => {
    console.error('❌ خطا در اتصال به دیتابیس:', err.message);
  });

module.exports = pool;