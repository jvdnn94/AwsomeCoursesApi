const { Pool } = require('pg');
require('dotenv').config();

const dbUser = (process.env.DB_USER || '').trim();
const dbHost = (process.env.DB_HOST || '').trim();
const dbPort = parseInt((process.env.DB_PORT || '6543').trim(), 10);
const dbPassword = (process.env.DB_PASSWORD || '').trim();
const dbDatabase = (process.env.DB_DATABASE || 'postgres').trim();


const pool = new Pool({
 host: dbHost,
  port: dbPort,
  user: dbUser,
  password: dbPassword,
  database: dbDatabase,
  
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