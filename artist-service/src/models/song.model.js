const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  genre: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Artist",
    required: true,
  },
  songUrl: {
    type: String,
    required: true,
  },
  releaseDate: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Number,
    default: 0,
  },
  plays: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Song", songSchema);
