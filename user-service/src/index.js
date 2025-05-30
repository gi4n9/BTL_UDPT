const express = require("express");
const connectDB = require("../config/db");
const userRoutes = require("../src/routes/userRoutes");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/user", userRoutes);

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`User Service running on port ${PORT}`));
