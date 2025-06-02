const songService = require("../services/song.services");

const getSongs = async (req, res) => {
  try {
    const songs = await songService.getSongs();
    res.status(200).json(songs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteSong = async (req, res) => {
  try {
    const { songId } = req.params;
    const song = await songService.deleteSong(songId);
    if (!song) throw new Error("Song not found");
    res.status(200).json({ message: "Song deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const createSong = async (req, res) => {
  try {
    const song = await songService.createSong(req.body);
    res.status(201).json(song);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getSongs, deleteSong, createSong };
