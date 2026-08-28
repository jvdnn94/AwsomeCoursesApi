const jwt=require('jsonwebtoken');
const UserModel = require('../models/AuthModel');
require('dotenv').config()
const Authentication=async(req,res,next)=>{
   const token=req.header("Authorization");
   if(!token)  return next();;
   try {
    const Decode=jwt.verify(token,process.env.SECRET_KEY);
     req.userData=Decode;

    const User = await UserModel.GetUserById(Decode.id);
    if(!User) return res.status(401).send("User no longer exists!!");
    next()
   } catch (error) {
    res.status(401).send("token is invalid");
   
   }

}
module.exports=Authentication