const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const emailService = require("../services/email.service")

// Request - POST
// api endpoint - /api/auth/register
//  desc - Register a new user
// Payload - { email, password, name }
async function userRegisterController(req, res) {
    const { email, password, name } = req.body

    const isExists = await userModel.findOne({
        email: email
    })

    if (isExists) {
        return res.status(422).json({
            message: "User already exists with email.",
            status: "failed"
        })
    }

    const user = await userModel.create({
        email, password, name
    })

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" })

    res.cookie("token", token)

    res.status(201).json({
        message:"User registered successfully",
        user: {
            _id: user._id,
            email: user.email,
            name: user.name
        },
        token
    })

    await emailService.sendRegistrationEmail(user.email, user.name)
}

// Request - POST
// api endpoint - /api/auth/register
//  desc - Login an existing user
async function userLoginController(req, res) {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: "failed",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
        status: "failed",
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
    });

    return res.status(200).json({
        message: "Login successful",
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
      token,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      status: "failed",
      error: error.message,
    });
  }
}

module.exports = {
  userRegisterController,
  userLoginController,
};