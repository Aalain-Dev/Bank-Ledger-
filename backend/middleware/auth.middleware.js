const usermodelschema = require("../models/user.model");
const jwt = require("jsonwebtoken");

const authMiddleware = async(req,res,next) => {
     const token = req.cookies.token || req.headers.authorization?.replace("Bearer ", "");
    if(!token){
        return res.status(401).json({
            message:"Unauthorized access",
            
        })
    }
  try {
   const decode = jwt.verify(token, process.env.JWT_SECRET);
   const finduser = await usermodelschema.findById(decode.id);

   req.user = finduser;
   return next()
  } catch (e) {
    return res.status(401).json({
        message:"Unauthorized access",
        error: e.message
    })
    
  }
};

async function authSystemMiddleware(req, res, next) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1]
if(!token){
    return res.status(401).json({
        message:"Unauthorized access"
    })
}
try {
  const decode = jwt.verify(token, process.env.JWT_SECRET);
  const user = await usermodelschema.findById(decode.userId);
 select ("+systemUser")
} catch (error) {
  return res.status(401).json({
    message:"Unauthorized access",
    error: error.message
  })
}
}
module.exports = {
    authMiddleware,
    authSystemMiddleware
};