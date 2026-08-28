const express=require("express");
require("dotenv").config();
const router = express.Router();
const homePageController=require("../controller/HomePage-controller")

router.get("/", homePageController.GetHomePage);
module.exports=router