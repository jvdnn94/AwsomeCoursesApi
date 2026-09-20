const { Pool } = require('pg');

// ۱. خواندن و پاکسازی دقیق متغیرها
const dbUser = (process.env.DB_USER || '').trim();
const dbPassword = (process.env.DB_PASSWORD || '').trim();
const dbHost = (process.env.DB_HOST || '').trim();
const dbPort = parseInt((process.env.DB_PORT || '6543').trim(), 10);
const dbDatabase = (process.env.DB_DATABASE || 'postgres').trim();

console.log("========================================");
console.log("🔍 DB_USER:", JSON.stringify(dbUser));
console.log("🔍 DB_HOST:", dbHost);
console.log("🔍 DB_PORT:", dbPort);
console.log("========================================");

// ۲. ساخت رشته اتصال کاملاً تمیز (بدون هیچ ?sslmode در انتها!)
// encodeURIComponent برای رمزهای عبوری که کاراکتر خاص دارند حیاتی است
const connectionString = `postgresql://${dbUser}:${encodeURIComponent(dbPassword)}@${dbHost}:${dbPort}/${dbDatabase}`;

const pool = new Pool({
  connectionString: connectionString,
  
  // ۳. تنظیمات SSL فقط از طریق این آبجکت اعمال می‌شود
  ssl: {
    rejectUnauthorized: false
  },
  
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// ۴. تست اتصال
pool.connect()
  .then(client => {
    console.log('✅ با موفقیت به Supabase PostgreSQL (Pooler) متصل شد');
    client.release();
  })
  .catch(err => {
    console.error('❌ خطا در اتصال به دیتابیس:', err.message);
  });

module.exports = pool;