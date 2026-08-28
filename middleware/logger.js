const LogS=(req,res,next)=>{
    console.log("Logging....");
    next()
};
module.exports.Log2=LogS