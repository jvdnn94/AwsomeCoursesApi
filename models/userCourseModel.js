const pool = require("../utilities/db");

class UserCourseModel {
  // ۱. ثبت‌نام در دوره (تغییر نام از EnrollUser به EnrollCourse)
  static async EnrollCourse(userId, courseId) {
    try {
      const result = await pool.query(
        `INSERT INTO user_courses (user_id, course_id, status, progress_percentage) 
         VALUES ($1, $2, 'not_started', 0) 
         ON CONFLICT (user_id, course_id) DO NOTHING 
         RETURNING *`,
        [userId, courseId]
      );
      
      // اگر قبلاً ثبت‌نام کرده باشد، rowCount صفر می‌شود
      if (result.rowCount === 0) {
        throw new Error("User is already enrolled in this course");
      }
      
      return result.rows[0];
    } catch (err) {
      console.error("❌ خطا در ثبت‌نام کاربر در دوره:", err.message);
      throw err;
    }
  }

  // ۲. حذف ثبت‌نام (این تابع اصلاً وجود نداشت، اضافه شد)
  static async UnenrollCourse(userId, courseId) {
    try {
      const result = await pool.query(
        `DELETE FROM user_courses WHERE user_id = $1 AND course_id = $2 RETURNING *`,
        [userId, courseId]
      );
      
      if (result.rowCount === 0) {
        throw new Error("Enrollment not found");
      }
      
      return result.rows[0];
    } catch (err) {
      console.error("❌ خطا در حذف ثبت‌نام:", err.message);
      throw err;
    }
  }

  // ۳. به‌روزرسانی پیشرفت (اصلاح شد تا فقط progress را بگیرد)
  static async UpdateProgress(userId, courseId, progress) {
    try {
      // اگر پیشرفت ۱۰۰ شد، استاتوس را completed می‌کنیم
      const status = progress >= 100 ? 'completed' : 'in_progress';
      
      const result = await pool.query(
        `UPDATE user_courses 
         SET status = $1, progress_percentage = $2
         WHERE user_id = $3 AND course_id = $4 
         RETURNING *`,
        [status, progress, userId, courseId]
      );
      
      if (result.rowCount === 0) {
        throw new Error("Enrollment not found");
      }
      
      return result.rows[0];
    } catch (err) {
      console.error("❌ خطا در بروزرسانی پیشرفت:", err.message);
      throw err;
    }
  }

  // ۴. دریافت دوره‌های کاربر (JOIN برای فیلتر کردن)
  static async GetUserCourses(userId) {
    try {
      const query = `
        SELECT c.id, c."Title", uc.status, uc.progress_percentage
        FROM courses c
        INNER JOIN user_courses uc ON c.id = uc.course_id
        WHERE uc.user_id = $1
      `;
      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (err) {
      console.error("❌ خطا در دریافت دوره‌های کاربر:", err.message);
      throw err;
    }
  }
}

module.exports = UserCourseModel;