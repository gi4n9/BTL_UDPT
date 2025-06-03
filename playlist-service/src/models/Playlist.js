const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema({
  playlist_id: {
    type: String,
    required: true
  },
  song_id: {
    type: String,
    required: true
  },
  added_at: {
    type: Date,
    default: Date.now
  }
});

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;

