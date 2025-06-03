const mongoose = require("mongoose");

const artistSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  fileUrl: { type: String, required: true }, // URL của file MP3 trên CloudFly
  uploadedAt: { type: Date, default: Date.now },
  duration: { type: Number }, // Thời lượng bài hát (tùy chọn)
  genre: { type: String }, // Thể loại (tùy chọn)
});

module.exports = mongoose.model("Artist", artistSchema);
