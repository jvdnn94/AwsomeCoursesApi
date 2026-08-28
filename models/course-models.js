const pool = require("../utilities/mysql-db");

class CourseModel {
  // تست اتصال

  static testConnection = async () => {
    let connection;
    try {
      connection = await pool.getConnection();
      console.log("✅ با موفقیت به دیتابیس وصل شد");
    } catch (err) {
      console.error("❌ خطا در اتصال:", err.message);
    } finally {
      if (connection) connection.release();
    }
  };

  //این یکی  مثل پایینی است فقط شکل انتخاب  نتیجه متفاوت است    حالت 1
  // const GetCourses = async () => {
  //   try {
  //     const res = await pool.query(
  //       "SELECT * FROM courses",
  //     );
  //     console.log(res[0]);

  //   } catch {
  //     console.error("خطا در دریافت اطلاعات");
  //   }
  // };

  //این یکی  مثل پایینی است فقط شکل انتخاب  نتیجه متفاوت است    حالت 2
  //در این حالت فقط آرایه دیتا دریافت نمیشود و کل اطلاغات مربوط به دیتا و جدول هم دریافت میشود
  // const GetCourses = async () => {
  //   try {
  //     const res = await pool.query(
  //       "SELECT * FROM courses",
  //     );
  //     console.log(res);

  //   } catch {
  //     console.error("خطا در دریافت اطلاعات");
  //   }
  // };

  static GetCourses = async () => {
    try {
      const [res] = await pool.query("SELECT * FROM courses");
      return res;
    } catch {
      console.error("خطا در دریافت اطلاعات");
    }
  };

  static GetCourse = async (id) => {
    try {
      const [res] = await pool.query(`SELECT * FROM courses where id=?`, [id]);
      return res[0];
    } catch {
      console.error("خطا در دریافت اطلاعات");
    }
  };

  static InsertCourse = async (Title) => {
    const [result] = await pool.query(
      `INSERT INTO courses (Title) VALUES (?)`,
      [Title],
    );
    return await CourseModel.GetCourse(result.insertId);
  };

  static UpdateCourse = async (id, Title) => {
    const [result] = await pool.query(`update courses set Title=? where id=?`, [
      Title,
      id,
    ]);
    return CourseModel.GetCourse(id);
  };

  static DeleteCourse = async (id) => {
    const [result] = await pool.query(`DELETE FROM courses WHERE id = ?`, [id]);
    return result;
  };
  static GetCoursesWithEnrollment = async (userId) => {
    const [courses] = await pool.query(
      `SELECT 
      c.id,
      c.Title,
      CASE WHEN uc.id IS NOT NULL THEN TRUE ELSE FALSE END AS is_enrolled,
      uc.status,
      uc.progress_percentage
    FROM courses c
    LEFT JOIN user_courses uc ON c.id = uc.course_id AND uc.user_id = ?`,
      [userId],
    );
    return courses;
  };
}
module.exports = CourseModel;
