const express = require("express");
const adminRoutes = require("./routes/adminRoute");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
// cors
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    exposedHeaders: ["Content-Range", "X-Content-Range"],
    maxAge: 600,
    preflightContinue: false,
}));

// Middleware
app.use(express.json());

// Routes
app.use("/admin", adminRoutes);

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Admin Service running on port ${PORT}`));
