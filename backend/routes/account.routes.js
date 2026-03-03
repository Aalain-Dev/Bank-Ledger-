const route = require("express").Router();
const { createAccount } = require("../controller/accountcontroller");
const auth = require("../middleware/auth.middleware");

route.post("/create", auth, createAccount);
route.get("", auth);
route.patch("", auth);
route.delete("", auth);

module.exports = route;
