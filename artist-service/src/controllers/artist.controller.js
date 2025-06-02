const { default: axios } = require("axios");
const artistService = require("../services/artist.service");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

class ArtistController {
  async uploadSong(req, res) {
    try {
      const response = axios.post("http:localhost:3003/songs", req.body);
      res.status(201).json({ message: "upload song success", response });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error uploading song", error: error.message });
    }
  }

  async getSong(req, res) {
    try {
      const song = await artistService.getSong(req.params.id);
      if (!song) {
        return res.status(404).json({ message: "Song not found" });
      }
      res.json(song);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching song", error: error.message });
    }
  }

  async getAllSongs(req, res) {
    try {
      const songs = await artistService.getAllSongs();
      res.json(songs);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching songs", error: error.message });
    }
  }

  async getArtistProfile(req, res) {
    try {
      const response = await axios.get(
        `http://localhost:3001/user/${req.params.id}`
      );
      res.status(200).json({
        success: true,
        message: "Artist fetched successfully",
        data: response.data,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getSongsByArtist(req, res) {
    try {
      const songs = await artistService.getSongsByArtist(req.params.artistId);
      res.json(songs);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching songs", error: error.message });
    }
  }

  async getNewReleases(req, res) {
    try {
      const newReleases = await artistService.getNewReleases();
      res.json(newReleases);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching new releases", error: error.message });
    }
  }
}

module.exports = new ArtistController();
