const express = require('express');
const authController = require("../controller/authcontroller");

const router = express.Router();


/** post api/auth/register */
/** registration route */
router.post("/register", authController.userResigterController)

/** login route
 * post api/auth/login
 */
router.post("/login", authController.userLoginController)

module.exports = router 