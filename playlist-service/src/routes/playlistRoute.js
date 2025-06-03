const express = require("express");
const router = express.Router();
const PlaylistController = require("../controllers/playlistController");

router.post("/", PlaylistController.createPlaylist);
router.get("/:id", PlaylistController.getPlaylist);
router.put("/:id", PlaylistController.updatePlaylist);
router.delete("/:id", PlaylistController.deletePlaylist);
router.post("/:id/songs", PlaylistController.addSongToPlaylist);
router.delete("/:id/songs/:song_id", PlaylistController.removeSongFromPlaylist);
router.get("/:id/songs", PlaylistController.getSongsFromPlaylist);
router.get("/user/:user_id", PlaylistController.getPlaylistsByUser);
router.get("/public", PlaylistController.getPublicPlaylists);

module.exports = router;
