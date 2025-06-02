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
  console.log("reqbody:", req.body);
  console.log(req.user);
  console.log("reqfile:", req.file);
  try {
    const { title, genre, description } = req.body;
    const artistId = req.user.id;
    console.log(artistId);
    const file = req.file;

    if (!file || !title || !artistId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const song = await songService.createSong(
      file,
      title,
      genre,
      description,
      artistId
    );
    res.status(201).json({ message: "create song suc" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getSongs, deleteSong, createSong };
