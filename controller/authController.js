const UserModel = require("../models/AuthModel");
const Joi = require("joi");
const Bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const RegisterUser = async (req, res, next) => {
  const schema = {
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required().messages({
      "string.email": "فرمت ایمیل وارد شده معتبر نیست.",
      "any.required": "وارد کردن ایمیل الزامی است.",
    }),
    password: Joi.string().min(3).max(50).required().messages({
      "string.min": "رمز عبور باید حداقل ۳ کاراکتر باشد",
    }),
  };

  const validationResult = Joi.object(schema).validate(req.body);

  if (validationResult.error) {
    return res.status(400).send(validationResult.error.details[0].message);
  }

  const ValidateUserExist = await UserModel.GetUserByEmail(validationResult.value.email);
  if (ValidateUserExist) {
    return res.status(400).send("کاربری با این ایمیل قبلاً ثبت‌نام کرده است.");
  }

  const HashPass = await Bcrypt.hash(validationResult.value.password, 10);

  const NewUser = await UserModel.CreateUser(
    validationResult.value.name,
    validationResult.value.email,
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
      role: NewUser.role || "user", // ✅ ارسال نقش کاربر
    },
    token: token,
  });
};

const LoginUser = async (req, res, next) => {
  const schema = {
    email: Joi.string().email().required().messages({
      "string.email": "فرمت ایمیل وارد شده معتبر نیست.",
      "any.required": "وارد کردن ایمیل الزامی است.",
    }),
    password: Joi.string().min(3).max(50).required().messages({
      "string.min": "رمز عبور باید حداقل ۳ کاراکتر باشد",
    }),
  };
  
  // ✅ تعریف متغیر با نام یکسان و استاندارد
  const validationResult = Joi.object(schema).validate(req.body);

  if (validationResult.error) {
    return res.status(400).send(validationResult.error.details[0].message);
  }

  const User = await UserModel.GetUserByEmail(validationResult.value.email);
  if (!User) return res.status(400).send("ایمیل یا رمز عبور نامعتبر است!");

  const ValidatePass = await Bcrypt.compare(
    validationResult.value.password,
    User.password,
  );
  if (!ValidatePass) return res.status(400).send("ایمیل یا رمز عبور نامعتبر است!");
  
  const token = jwt.sign(
    { id: User.id, role: User.role },
    process.env.SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

  res.header("Authorization", token).send({
    // ✅ حذف _.pick و ارسال دستی فیلدها برای اطمینان از وجود role
    user: {
      id: User.id,
      name: User.name,
      email: User.email,
      role: User.role || "user", // ✅ این خط کلید حل مشکل ادمین است
    },
    token: token,
  });
};

const LogoutUser = (req, res) => {
  res.send({
    message: "خروج با موفقیت انجام شد. لطفاً توکن را از سمت کلاینت پاک کنید.",
  });
};

module.exports = { RegisterUser, LoginUser, LogoutUser };