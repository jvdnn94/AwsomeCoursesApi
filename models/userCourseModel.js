const pool = require("../utilities/mysql-db");

class UserCourseModel {
  // گرفتن همه دوره‌های یک کاربر
  static GetUserCourses = async (userId) => {
    try {
      const [courses] = await pool.query(
        `SELECT 
          uc.id,
          uc.course_id,
          c.Title AS course_title,
          uc.status,
          uc.progress_percentage,
          uc.enrolled_at,
          uc.completed_at
        FROM user_courses uc
        INNER JOIN courses c ON uc.course_id = c.id
        WHERE uc.user_id = ?
        ORDER BY uc.enrolled_at DESC`,
        [userId]
      );
      return courses;
    } catch (error) {
      console.error("Error in GetUserCourses:", error.message);
      throw error;
    }
  };

  // افزودن دوره به لیست کاربر
  static EnrollCourse = async (userId, courseId) => {
    try {
      // بررسی تکراری نبودن
      const [existing] = await pool.query(
        `SELECT id FROM user_courses WHERE user_id = ? AND course_id = ?`,
        [userId, courseId]
      );

      if (existing.length > 0) {
        throw new Error("User already enrolled in this course");
      }

      const [result] = await pool.query(
        `INSERT INTO user_courses (user_id, course_id, status, progress_percentage) 
         VALUES (?, ?, 'not_started', 0)`,
        [userId, courseId]
      );

      return result;
    } catch (error) {
      console.error("Error in EnrollCourse:", error.message);
      throw error;
    }
  };

  // حذف دوره از لیست کاربر
  static UnenrollCourse = async (userId, courseId) => {
    try {
      const [result] = await pool.query(
        `DELETE FROM user_courses WHERE user_id = ? AND course_id = ?`,
        [userId, courseId]
      );

      if (result.affectedRows === 0) {
        throw new Error("Course not found in user's list");
      }

      return result;
    } catch (error) {
      console.error("Error in UnenrollCourse:", error.message);
      throw error;
    }
  };

  // به‌روزرسانی پیشرفت
  static UpdateProgress = async (userId, courseId, progress) => {
    try {
      // تعیین status بر اساس progress
      let status = 'in_progress';
      let completedAt = null;

      if (progress === 0) {
        status = 'not_started';
      } else if (progress === 100) {
        status = 'completed';
        completedAt = new Date();
      }

      const [result] = await pool.query(
        `UPDATE user_courses 
         SET status = ?, progress_percentage = ?, completed_at = ?
         WHERE user_id = ? AND course_id = ?`,
        [status, progress, completedAt, userId, courseId]
      );

      if (result.affectedRows === 0) {
        throw new Error("Course not found in user's list");
      }

      return result;
    } catch (error) {
      console.error("Error in UpdateProgress:", error.message);
      throw error;
    }
  };

  // بررسی آیا کاربر در دوره ثبت‌نام کرده است
  static IsUserEnrolled = async (userId, courseId) => {
    try {
      const [result] = await pool.query(
        `SELECT id FROM user_courses WHERE user_id = ? AND course_id = ?`,
        [userId, courseId]
      );
      return result.length > 0;
    } catch (error) {
      console.error("Error in IsUserEnrolled:", error.message);
      throw error;
    }
  };
}

module.exports = UserCourseModel;