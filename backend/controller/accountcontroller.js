const accountSchema = require("../models/account.model");
// Desc - create a new account that is linked to the user
// Route - POST /api/account/create
// Access - Private
// Body - { user: userId }
const createAccount = async (req, res) => {
  try {
    const newAccount = await accountSchema.create({
      user: req.body.user,
    });
    return res.status(201).json({
      message: "Account Created SuccessFully",
      account: newAccount,
    });
  } catch (e) {
    return res.status(500).json({
      message: "Error creating account",
      error: e.message,
    });
  }
};

module.exports = { createAccount };
