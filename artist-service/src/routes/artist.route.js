const express = require("express");
const router = express.Router();
const multer = require("multer");
const artistController = require("../controllers/artist.controller");
const { authenticateToken } = require("../middlewares/auth.middleware");

const upload = multer({ storage: multer.memoryStorage() });

router.get("/profile/:id", artistController.getArtistProfile);
router.post(
  "/upload-song",
  upload.single("songFile"),
  authenticateToken,
  artistController.uploadSong
);
// router.get("/songs/:artistId", artistController.getSongsByArtist);
// router.get("/new-releases", artistController.getNewReleases);
// router.get("/:id", artistController.getSong);
// router.get("/", artistController.getAllSongs);

module.exports = router;
