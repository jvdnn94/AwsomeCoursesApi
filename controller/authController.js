const UserModel = require("../models/AuthModel");
const Joi = require("joi");
const _ = require("lodash");
const Bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const RegisterUser = async (req, res, next) => {
  // ... (بخش اعتبارسنجی Joi بدون تغییر) ...

  const NewUser = await UserModel.CreateUser(
    Validateresult.value.name,
    Validateresult.value.email,
    HashPass
  );

  if (!NewUser || !NewUser.id) {
    console.error("❌ NewUser is undefined or missing id after creation!");
    return res.status(500).send("خطای داخلی در ایجاد کاربر در دیتابیس");
  }

  const token = jwt.sign(
    { id: NewUser.id, role: NewUser.role }, 
    process.env.SECRET_KEY, 
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

  res.header("Authorization", token).status(201).send({
    user: {
      id: NewUser.id,
      name: NewUser.name,
      email: NewUser.email,
      role: NewUser.role 
    },
    token: token,
  });
};

const LoginUser = async (req, res, next) => {
  // ... (بخش اعتبارسنجی Joi بدون تغییر) ...

  const User = await UserModel.GetUserByEmail(Validateresult.value.email);
  if (!User) return res.status(400).send("email or password is invalid!");

  const ValidatePass = await Bcrypt.compare(
    Validateresult.value.password,
    User.password,
  );
  if (!ValidatePass)
    return res.status(400).send("email or password is invalid!");
    
  const token = jwt.sign(
    { id: User.id, role: User.role },
    process.env.SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    },
  );

  res.header("Authorization", token).send({
    user: _.pick(User, ["id", "name", "email", "role"]), 
    token: token,
  });
};


const LogoutUser = (req, res) => {
  // در JWT stateless، خروج واقعی نیاز به token blacklist دارد
  // ولی برای سادگی، فقط به کلاینت می‌گوییم توکن را پاک کند
  res.send({
    message: "خروج با موفقیت انجام شد. لطفاً توکن را از سمت کلاینت پاک کنید.",
  });
};
module.exports = { RegisterUser, LoginUser, LogoutUser };
