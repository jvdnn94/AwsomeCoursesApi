const express = require("express");
const router = express.Router();
const pool = require("../utilities/mysql-db");

router.get("/", async (req, res) => {
  try {
    // ۱. تست اتصال
    const connection = await pool.getConnection();
    
    // ۲. گرفتن نام دیتابیس فعلی
    const [dbName] = await connection.query("SELECT DATABASE() as db");
    
    // ۳. گرفتن لیست همه جدول‌ها
    const [tables] = await connection.query("SHOW TABLES");
    
    // ۴. شمارش رکوردهای جدول courses
    const [count] = await connection.query("SELECT COUNT(*) as total FROM courses");
    
    // ۵. گرفتن ۵ رکورد اول
    const [courses] = await connection.query("SELECT * FROM courses LIMIT 5");
    
    connection.release();
    
    res.json({
      status: "✅ Connected successfully",
      database: dbName[0].db,
      tables: tables,
      coursesCount: count[0].total,
      sampleCourses: courses,
    });
  } catch (error) {
    res.status(500).json({
      status: "❌ Error",
      error: error.message,
      code: error.code,
    });
  }
});

module.exports = router;