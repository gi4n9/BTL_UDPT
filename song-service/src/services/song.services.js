const { Song, getNextSequence } = require("../models/song.models");
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
require("dotenv").config();

// ✅ Khởi tạo S3Client cho Cloudfly
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
      return await Song.find();
    } catch (error) {
      throw new Error("Lỗi khi lấy danh sách bài hát");
    }
  }

  async getSongByArtistId(artistId) {
    try {
      return await Song.find({ artistId });
    } catch (error) {
      throw new Error("Lỗi khi lấy bài hát theo artistId");
    }
  }

  async getSongById(songId) {
    try {
      return await Song.findOne({ id: parseInt(songId) });
    } catch (error) {
      throw new Error("Không thể lấy bài hát theo Id");
    }
  }

  async createSong(file, title, genre, description, artistId) {
    try {
      if (!file || !title || !artistId) {
        throw new Error("Thiếu các trường bắt buộc: file, title, artistId");
      }

      // Tạo key đơn giản cho file
      const encodedFileName = encodeURIComponent(file.originalname);
      const key = `songs/${Date.now()}_${encodedFileName}`;

      // Upload file lên Cloudfly (private)
      const uploadParams = {
        Bucket: process.env.CLOUD_BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype || "audio/mpeg",
      };

      await s3Client.send(new PutObjectCommand(uploadParams));
      console.log("Upload thành công:", key);

      // Tạo signed URL có thời hạn tối đa 7 ngày
      const signedUrl = await getSignedUrl(
        s3Client,
        new GetObjectCommand({
          Bucket: process.env.CLOUD_BUCKET,
          Key: key,
        }),
        { expiresIn: 604800 }
      );

      // Lưu thông tin bài hát
      const songData = {
        id: await getNextSequence(),
        title,
        genre,
        description,
        artistId,
        fileUrl: signedUrl,
        releaseDate: new Date(),
      };

      const newSong = await Song.create(songData);
      return newSong;
    } catch (error) {
      console.error("Lỗi tạo bài hát:", error);
      throw new Error(`Lỗi khi tạo bài hát: ${error.message}`);
    }
  }

  async deleteSong(songId) {
    try {
      const deleted = await Song.findByIdAndDelete(songId);
      if (!deleted) throw new Error("Không tìm thấy bài hát");
      return deleted;
    } catch (error) {
      throw new Error(`Lỗi khi xóa bài hát: ${error.message}`);
    }
  }
}

module.exports = new SongService();
