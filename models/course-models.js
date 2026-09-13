const pool = require("../utilities/db"); // یا "../utilities/db" اگر نامش را عوض کردی

class CourseModel {
  static async GetCourses() {
    try {
      const result = await pool.query('SELECT id, "Title", created_at FROM courses ORDER BY id');
      return result.rows;
    } catch (err) {
      console.error("خطا در دریافت دوره‌ها:", err.message);
      throw err;
    }
  }

  static async GetCourse(id) {
    try {
      const result = await pool.query('SELECT id, "Title", created_at FROM courses WHERE id = $1', [id]);
      return result.rows[0];
    } catch (err) {
      console.error("خطا در دریافت دوره:", err.message);
      throw err;
    }
  }

  static async InsertCourse(Title) {
    try {
      // RETURNING * باعث می‌شود ردیف جدید ساخته شده را برگرداند
      const result = await pool.query(
        'INSERT INTO courses ("Title") VALUES ($1) RETURNING id, "Title", created_at',
        [Title]
      );
      return result.rows[0];
    } catch (err) {
      console.error("خطا در ایجاد دوره:", err.message);
      throw err;
    }
  }

  static async UpdateCourse(id, Title) {
    try {
      const result = await pool.query(
        'UPDATE courses SET "Title" = $1 WHERE id = $2 RETURNING id, "Title", created_at',
        [Title, id]
      );
      return result.rows[0];
    } catch (err) {
      console.error("خطا در آپدیت دوره:", err.message);
      throw err;
    }
  }

  static async DeleteCourse(id) {
    try {
      const result = await pool.query('DELETE FROM courses WHERE id = $1', [id]);
      return { deleted: result.rowCount };
    } catch (err) {
      console.error("خطا در حذف دوره:", err.message);
      throw err;
    }
  }

  static async GetCoursesWithEnrollment(userId) {
    try {
      const result = await pool.query(
        `SELECT 
          c.id,
          c."Title" AS "Title",
          CASE WHEN uc.id IS NOT NULL THEN TRUE ELSE FALSE END AS is_enrolled,
          uc.status,
          uc.progress_percentage
        FROM courses c
        LEFT JOIN user_courses uc ON c.id = uc.course_id AND uc.user_id = $1
        ORDER BY c.id`,
        [userId]
      );
      return result.rows;
    } catch (err) {
      console.error("خطا در دریافت دوره‌های کاربر:", err.message);
      throw err;
    }
  }
}

module.exports = CourseModel;