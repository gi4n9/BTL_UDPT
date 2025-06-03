const { Song, getNextSequence } = require("../models/song.models");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
require("dotenv").config();

// Cấu hình S3Client cho Cloudfly S3
const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.CLOUD_ACCESS_KEY,
    secretAccessKey: process.env.CLOUD_SECRET_KEY,
  },
  endpoint: process.env.CLOUD_ENDPOINT,
  region: "hn",
  forcePathStyle: true,
});

class SongService {
  async getSongs() {
    try {
      const songs = await Song.find();
      return songs;
    } catch (error) {
      throw new Error("Lỗi khi lấy danh sách bài hát");
    }
  }

  async getSongById(songId) {
    try {
      const song = await Song.findOne({ id: parseInt(songId) });
      return song;
    } catch (error) {
      throw new Error("Không thể lấy bài hát theo Id!!");
    }
  }

  async createSong(file, title, genre, description, artistId) {
    try {
      // Kiểm tra các trường bắt buộc
      if (!file || !title || !artistId) {
        throw new Error("Thiếu các trường bắt buộc: file, title, artistId");
      }

      // Tạo key cho S3
      const encodedFileName = encodeURIComponent(file.originalname);
      const key = `songs/${Date.now()}_${encodedFileName}`;

      // Cấu hình tham số cho S3
      const params = {
        Bucket: process.env.CLOUD_BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      // Debug: In ra các giá trị
      console.log("CLOUD_ENDPOINT:", process.env.CLOUD_ENDPOINT);
      console.log("CLOUD_BUCKET:", process.env.CLOUD_BUCKET);
      console.log("S3 Params:", params);

      // Tải file lên Cloudfly S3
      const command = new PutObjectCommand(params);
      await s3Client.send(command);

      // Tạo URL công khai cho file
      const generatedSongUrl = `${process.env.CLOUD_ENDPOINT}/${process.env.CLOUD_BUCKET}/${key}`;

      // Kiểm tra URL hợp lệ
      try {
        new URL(generatedSongUrl);
        console.log("Song URL:", generatedSongUrl);
      } catch (urlError) {
        console.error("Invalid URL:", generatedSongUrl, urlError);
        throw new Error(`URL không hợp lệ: ${generatedSongUrl}`);
      }

      // Dữ liệu bài hát để lưu vào MongoDB
      const songData = {
        id: await getNextSequence(), // Thêm ID tùy chỉnh
        title,
        genre,
        description,
        artistId: artistId,
        fileUrl: generatedSongUrl,
        releaseDate: new Date(),
      };

      // Debug: In ra dữ liệu bài hát
      console.log("Song Data:", songData);

      // Lưu vào MongoDB
      const newSong = await Song.create(songData);
      return newSong;
    } catch (error) {
      console.error("Create Song Error:", error);
      throw new Error(`Lỗi khi tạo bài hát: ${error.message}`);
    }
  }

  async deleteSong(songId) {
    try {
      const deletedSong = await Song.findByIdAndDelete(songId);
      if (!deletedSong) {
        throw new Error("Không tìm thấy bài hát");
      }
      return deletedSong;
    } catch (error) {
      throw new Error(`Lỗi khi xóa bài hát: ${error.message}`);
    }
  }
}

module.exports = new SongService();
