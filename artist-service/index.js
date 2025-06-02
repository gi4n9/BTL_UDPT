const express = require("express");
const cors = require("cors");
const artistRoutes = require("./src/routes/artist.route");

const app = express();
const PORT = process.env.PORT;

require("dotenv").config();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/artist", artistRoutes);

app.listen(PORT, () => {
  console.log(`Artist service is running on port http://localhost:${PORT}`);
});
