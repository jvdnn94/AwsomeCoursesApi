const UserModel = require("../models/AuthModel");
const Joi = require("joi");
const _ = require("lodash");
const Bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const RegisterUser = async (req, res, next) => {
  const schema = {
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required().messages({
      "string.email": "فرمت ایمیل وارد شده معتبر نیست.",
      "any.required": "وارد کردن ایمیل الزامی است.",
      "string.empty": "ایمیل نمی‌تواند خالی باشد.",
      "string.base": "مقدار ایمیل باید از نوع متن (string) باشد.",
    }),
    password: Joi.string().min(3).max(50).required().messages({
      "string.min": "Pass must be at least 3 characters",
    }),
  };

  const Validateresult = Joi.object(schema).validate(req.body);

  if (Validateresult.error)
    return res.status(400).send(Validateresult.error.details[0].message);

  const ValidateUserExist = await UserModel.GetUserByEmail(
    Validateresult.value.email,
  );

  if (ValidateUserExist)
    return res.status(400).send("A user by this email already exists!!!");

  const HashPass = await Bcrypt.hash(Validateresult.value.password, 10);

  const UserId = await UserModel.InsertModel(
    Validateresult.value.name,
    Validateresult.value.email,
    HashPass,
  );

  const NewUser = await UserModel.GetUserByEmail(Validateresult.value.email);

  const token = jwt.sign(
    { id: NewUser.id, role: NewUser.role },
    process.env.SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    },
  );

  res.header("Authorization", token).send({
    user: {
      id: NewUser.id,
      name: Validateresult.value.name,
      email: Validateresult.value.email,
    },
    token: token,
  });
};

const LoginUser = async (req, res, next) => {
  const schema = {
    email: Joi.string().email().required().messages({
      "string.email": "فرمت ایمیل وارد شده معتبر نیست.",
      "any.required": "وارد کردن ایمیل الزامی است.",
      "string.empty": "ایمیل نمی‌تواند خالی باشد.",
      "string.base": "مقدار ایمیل باید از نوع متن (string) باشد.",
    }),
    password: Joi.string().min(3).max(50).required().messages({
      "string.min": "Pass must be at least 3 characters",
    }),
  };
  const Validateresult = Joi.object(schema).validate(req.body);

  if (Validateresult.error)
    return res.status(400).send(Validateresult.error.details[0].message);

  const User = await UserModel.GetUserByEmail(Validateresult.value.email);
  if (!User) return res.status(400).send("email or password is invalid!");

  console.log(
    "🔍 رمز دریافتی از درخواست:",
    JSON.stringify(Validateresult.value.password),
  );
  console.log("🔍 رمز خوانده شده از دیتابیس:", JSON.stringify(User.password));

  const ValidatePass = await Bcrypt.compare(
    Validateresult.value.password,
    User.password,
  );

    console.log("🔍 نتیجه مقایسه Bcrypt:", ValidatePass);
    
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
    user: _.pick(User, ["id", "name", "email"]),
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
