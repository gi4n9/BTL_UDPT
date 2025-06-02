const { Artist, Song } = require("../models/artist.model");

class ArtistRepository {
  async createSong(songData) {
    const song = new Song(songData);
    return await song.save();
  }

  async findArtistById(id) {
    return await Artist.findById(id);
  }

  async findSongById(id) {
    return await Song.findById(id);
  }

  async findAllSongs() {
    return await Song.find().populate("artist", "name");
  }

  async findSongsByArtist(artistId) {
    return await Song.find({ artist: artistId }).sort({ releaseDate: -1 });
  }

  async findNewReleases() {
    return await Song.find()
      .sort({ releaseDate: -1 })
      .limit(10)
      .populate("artist", "name");
  }
}

module.exports = new ArtistRepository();
