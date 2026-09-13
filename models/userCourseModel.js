const pool = require("../utilities/mysql-db");

class UserCourseModel {
  static async EnrollUser(userId, courseId) {
    try {
      const result = await pool.query(
        `INSERT INTO user_courses (user_id, course_id, status, progress_percentage) 
         VALUES ($1, $2, 'not_started', 0) 
         ON CONFLICT (user_id, course_id) DO NOTHING 
         RETURNING *`,
        [userId, courseId]
      );
      return result.rows[0] || null;
    } catch (err) {
      console.error("خطا در ثبت‌نام کاربر:", err.message);
      throw err;
    }
  }

  static async UpdateProgress(userId, courseId, status, progress_percentage) {
    try {
      const result = await pool.query(
        `UPDATE user_courses 
         SET status = $1, progress_percentage = $2, 
             completed_at = CASE WHEN $1 = 'completed' THEN CURRENT_TIMESTAMP ELSE completed_at END
         WHERE user_id = $3 AND course_id = $4 
         RETURNING *`,
        [status, progress_percentage, userId, courseId]
      );
      return result.rows[0];
    } catch (err) {
      console.error("خطا در بروزرسانی پیشرفت:", err.message);
      throw err;
    }
  }
}

module.exports = UserCourseModel;