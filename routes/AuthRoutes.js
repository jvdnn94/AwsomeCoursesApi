const express=require('express');
const Router=express.Router();
const UserController=require("../controller/authController");
const Auth = require("../middleware/auth");

Router.post("/register",UserController.RegisterUser)
Router.post("/login",UserController.LoginUser)
Router.post("/logout", Auth, UserController.LogoutUser);


module.exports=Router;