const express = require("express");
const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const Artist = require("../models/artist.model");
const Song = require("../models/song.model");

// Configure Cloudinary
cloudinary.config({
  cloud_name: "my.cloudfly",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "songs",
    resource_type: "auto",
  },
});

const upload = multer({ storage: storage });

// Get artist profile
router.get("/profile/:id", async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }
    res.json(artist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload new song
router.post("/upload-song", upload.single("songFile"), async (req, res) => {
  try {
    const { title, genre, description } = req.body;
    const artistId = req.user.id; // Assuming you have authentication middleware

    const newSong = new Song({
      title,
      genre,
      description,
      artist: artistId,
      songUrl: req.file.path,
      releaseDate: new Date(),
    });

    await newSong.save();
    res.status(201).json(newSong);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get artist's songs
router.get("/songs/:artistId", async (req, res) => {
  try {
    const songs = await Song.find({ artist: req.params.artistId }).sort({
      releaseDate: -1,
    });
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get new releases
router.get("/new-releases", async (req, res) => {
  try {
    const newReleases = await Song.find()
      .sort({ releaseDate: -1 })
      .limit(10)
      .populate("artist", "name");
    res.json(newReleases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
