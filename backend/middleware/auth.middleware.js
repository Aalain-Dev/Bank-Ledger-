const usermodelschema = require("../models/user.model");
const jwt = require("jsonwebtoken");

const authMiddleware = async(req,res,next) => {
     const token = req.cookies.token || req.header.authorization?.replace("Bearer ", "");
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
module.exports = authMiddleware;