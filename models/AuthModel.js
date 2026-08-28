const pool = require("../utilities/mysql-db");
const { v4: uuidv4 } = require("uuid");

class UserModel {

 static InsertModel = async (name, email, password, role = 'user') => {
    try {
      const userId = uuidv4();  // ⬅️ UUID در Node ساخته می‌شود
      
      const [result] = await pool.query(
        `INSERT INTO users (id, name, email, password, role) 
         VALUES (?, ?, ?, ?, ?)`,
        [userId,name, email, password, role]
      );
      
      return result.insertId;
    } catch (error) {
      console.error("Error in InsertModel:", error.message);
      throw error;
    }
  };



  static GetUserByEmail = async (email) => {
    try {
      const [result] = await pool.query(
        `SELECT id, name, email, role, created_at FROM users WHERE email = ?`,
        [email]
      );
      return result[0];
    } catch (error) {
      console.error("Error in GetUserByEmail:", error.message);
      throw error;
    }
  };

   //   گرفتن کاربر با پسورد (برای لاگین)
  static GetUserByEmailWithPassword = async (email) => {
    try {
      const [result] = await pool.query(
        `SELECT * FROM users WHERE email = ?`,
        [email]
      );
      return result[0];
    } catch (error) {
      console.error("Error in GetUserByEmailWithPassword:", error.message);
      throw error;
    }
  };

  static GetUserById = async (id) => {
    try {
      const [result] = await pool.query(
        `SELECT id, name, email, role, created_at FROM users WHERE id = ?`,
        [id]
      );
      return result[0];
    } catch (error) {
      console.error("Error in GetUserById:", error.message);
      throw error;
    }
  };

}


module.exports = UserModel;
