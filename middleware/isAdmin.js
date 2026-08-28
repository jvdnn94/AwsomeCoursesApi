const UserModel = require('../models/AuthModel');

const IsAdmin = async (req, res, next) => {
  try {
    // req.userData از middleware Authentication می‌آید
    if (!req.userData || !req.userData.id) {
      return res.status(401).send("Access denied. Please login first.");
    }

    const user = await UserModel.GetUserById(req.userData.id);
    
    if (!user) {
      return res.status(401).send("User not found.");
    }

    if (user.role !== 'admin') {
      return res.status(403).send("Access denied. Admin privileges required.");
    }

    // اضافه کردن اطلاعات کامل کاربر به req
    req.user = user;
    next();
  } catch (error) {
    console.error("IsAdmin Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = IsAdmin;