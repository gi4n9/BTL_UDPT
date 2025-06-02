const express = require("express");
const adminRoutes = require("./routes/adminRoute");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/admin", adminRoutes);

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Admin Service running on port ${PORT}`));
