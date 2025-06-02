const express = require("express");
const cors = require("cors");
const songRouter = require("./routes/song.routes");
const connectDB = require("../config/db");

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/songs", songRouter);

app.listen(3003, () =>
  console.log(
    `Song Service running on port http://localhost:${process.env.PORT}`
  )
);
