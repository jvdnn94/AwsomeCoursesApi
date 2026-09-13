const pool = require("../utilities/db");

class AuthModel {
  static async GetUserByEmail(email) {
    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      return result.rows[0];
    } catch (err) {
      console.error("خطا در دریافت کاربر با ایمیل:", err.message);
      throw err;
    }
  }

  static async GetUserById(id) {
    try {
      const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
      return result.rows[0];
    } catch (err) {
      console.error("خطا در دریافت کاربر با آیدی:", err.message);
      throw err;
    }
  }

  static async CreateUser(name, email, hashedPassword, role = 'user') {
    try {
      const result = await pool.query(
        `INSERT INTO users (name, email, password, role) 
         VALUES ($1, $2, $3, $4) 
         RETURNING id, name, email, role, created_at`,
        [name, email, hashedPassword, role]
      );
      return result.rows[0];
    } catch (err) {
      console.error("خطا در ایجاد کاربر:", err.message);
      throw err;
    }
  }
}

module.exports = AuthModel;