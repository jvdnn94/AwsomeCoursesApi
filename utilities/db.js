const { Pool } = require('pg');

// ۱. خواندن و پاکسازی دقیق متغیرها
const dbUser = (process.env.DB_USER || '').trim();
const dbPassword = (process.env.DB_PASSWORD || '').trim();
const dbHost = (process.env.DB_HOST || '').trim();
const dbPort = (process.env.DB_PORT || '6543').trim();
const dbDatabase = (process.env.DB_DATABASE || 'postgres').trim();

console.log("========================================");
console.log("🔍 DB_USER:", JSON.stringify(dbUser), "| Length:", dbUser.length);
console.log("🔍 DB_HOST:", dbHost);
console.log("🔍 DB_PORT:", dbPort);
console.log("========================================");

// ۲. ساخت رشته اتصال به صورت دستی (این روش باگ‌های کتابخانه pg را دور می‌زند)
const connectionString = `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbDatabase}?sslmode=require`;

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// ۳. تست اتصال
pool.connect()
  .then(client => {
    console.log('✅ با موفقیت به Supabase PostgreSQL (Pooler) متصل شد');
    client.release();
  })
  .catch(err => {
    console.error('❌ خطا در اتصال به دیتابیس:', err.message);
    // لاگ کامل خطا برای دیباگ دقیق‌تر در صورت نیاز
    console.error('❌ Full Error Details:', err); 
  });

module.exports = pool;