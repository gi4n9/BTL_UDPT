const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const cors = require("cors");

connectDB();

dotenv.config();

// import routes
const authRoutes = require("./routes/auth.routes");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(express.static("public"));

// Routes
app.use("/auth", authRoutes);

module.exports = app;
