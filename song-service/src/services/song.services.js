const { Song, getNextSequence } = require("../models/song.models");

class SongService {
  async getSongs() {
    try {
      const songs = await Song.find();
      return songs;
    } catch (error) {
      throw new Error("Failed to get songs");
    }
  }

  async createSong(song) {
    try {
      const nextId = await getNextSequence();
      const newSong = await Song.create({ ...song, id: nextId });
      return newSong;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteSong(songId) {
    try {
      const deletedSong = await Song.findByIdAndDelete(songId);
      return deletedSong;
    } catch (error) {
      throw new Error("Failed to delete song");
    }
  }
}

module.exports = new SongService();
