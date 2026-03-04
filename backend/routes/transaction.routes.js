const { createTransaction } = require("../controller/transactioncontroller");
const authMiddleware = require("../middleware/auth.middleware");

const route = require("express").Router();

route.post("/create",authMiddleware, createTransaction);

module.exports = route;