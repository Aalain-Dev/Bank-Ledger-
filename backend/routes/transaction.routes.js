const { createTransaction } = require("../controller/transactioncontroller");

const route = require("express").Router();

route.post("/create", createTransaction);

module.exports = route;