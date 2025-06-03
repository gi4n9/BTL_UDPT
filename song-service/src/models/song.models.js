const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true, maxlength: 255 },
  duration: { type: String },
  artistId: { type: Number, required: true },
  albumId: { type: Number },
  fileUrl: { type: String, maxlength: 1000 },
  views: { type: Number, default: 0 },
  genres: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

songSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

let lastId = 0;
const getNextSequence = async () => {
  const lastSong = await mongoose.model("Song").findOne().sort({ id: -1 });
  if (lastSong) {
    lastId = lastSong.id;
  }
  return ++lastId;
};

module.exports = {
  Song: mongoose.model("Song", songSchema),
  getNextSequence,
};
