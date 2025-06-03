const express = require("express");
const router = express.Router();
const songController = require("../controllers/song.controller");

router.get("/", songController.getSongs);
router.post("/", songController.createSong);
router.delete("/:songId", songController.deleteSong);

module.exports = router;
