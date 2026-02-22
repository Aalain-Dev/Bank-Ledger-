const userMoodel = require("../models/user.model");
const jwt = require ("jsonwebtoken")

/*user resigter controller*/
function userResigterController(req, res) {
   const {email,name,password} = req.body


   const isExists = await userModel .findOne({
    email : email
   })

   if(isExists){
    return res.status(422).json({
        message : "User already exists",
        status : "failed"
     })
   }    


   const user = await userModel.create({
    email,password,name 
   })
res.cookies("token",token)
res.status(201).json({
    user :{
    _id:user._id,   
    email:user.email,
    name:user.name,
    },
    token:token

    }


const token = jwt.sign({
userId:user_id
},process.env.jwt_secret,{
    expiresIn : "1d"
}   )


res.cookies("token",token)
res.status(200).json({
    user :{
    _id:user._id,
    email:user.email,
    name:user.name,
    },
    token:token
})


/** user login controller  post  /api/auth/login */
async function userLoginController (req,res){
    const {email,password } = req.body

    const user = await userModel.findOne({
        email:email
    })

    if(!user){
        return res.status(404).json({
            message:"User not found",
            status:"failed"
        })
    }

    const isMatch = await user.comparePassword(password)

    if(isMatch){
        return res.status(401).json({
            message:"Invalid credentials",
            status:"failed"
        })
    }

    const token = jwt.sign({
        userId:user._id
    },process.env.jwt_secret,{
        expiresIn : "1d"
    }   )

    res.cookies("token",token)
    res.status(200).json({
        user :{
            _id:user._id,
            email:user.email,
            name:user.name,
        },
        token:token
    })
}

module.exports={
    userResigterController,
    userLoginController
}