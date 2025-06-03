const express = require("express");
const router = express.Router();
const songController = require("../controllers/song.controller");
const { authenticateToken } = require("../middlewares/auth.middleware");

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", songController.getSongs);
router.get("/:id", songController.getSongById);
router.get("/artist/:artistId", songController.getSongByArtistId);
router.post(
  "/",
  authenticateToken,
  upload.single("songFile"),
  songController.createSong
);
router.delete("/:songId", songController.deleteSong);

module.exports = router;
