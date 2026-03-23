require("dotenv").config();
const cookie = require("cookie-parser");
const express = require("express");

const authRouter = require("./routes/auth.routes");
const accountRouter = require("./routes/account.routes");
const transactionRoutes = require("./routes/transaction.routes");

const connectDB = require("./config/db");
connectDB();

const app = express();

app.use(express.json());
app.use(cookie());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/account", accountRouter);
app.use("/api/transaction", transactionRoutes);

module.exports = app;