const express = require("express");
const route = express.Router();

const { createTransaction } = require("../controller/transactioncontroller");
const authMiddleware = require("../middleware/auth.middleware");

route.post("/create", authMiddleware, createTransaction);

route.post("/system/initial-fund", authMiddleware.authSystemMiddleware, transactionController.createInitialFundTransaction);
module.exports = route;