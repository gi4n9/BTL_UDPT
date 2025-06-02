const express = require("express");
const app = express();
const adminRoute = require("./routes/adminRoute");

app.use(express.json());
app.use("/admin", adminRoute);

app.listen(3003, () => {
    console.log("Admin service is running on port 3003");
});

