const express = require("express");
const router = express.Router();
const artistController = require("../controllers/artist.controller");

router.get("/", artistController);

module.exports = router;
