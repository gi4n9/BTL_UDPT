const artistRepository = require("../repository/artist.repository");

class ArtistService {
  async uploadSong(file, title, genre, description, artistId) {
    try {
      // Mã hóa tên file để tránh ký tự không hợp lệ
      const encodedFileName = encodeURIComponent(file.originalname);
      const key = `songs/${Date.now()}_${encodedFileName}`;

      // Cấu hình tham số cho S3
      const params = {
        Bucket: process.env.CLOUD_BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        // Bỏ ACL vì Cloudfly S3 có thể không hỗ trợ
      };

      // Debug: In ra các giá trị
      console.log("CLOUD_ENDPOINT:", process.env.CLOUD_ENDPOINT);
      console.log("CLOUD_BUCKET:", process.env.CLOUD_BUCKET);
      console.log("S3 Params:", params);

      // Tải file lên Cloudfly S3
      const command = new PutObjectCommand(params);
      await s3Client.send(command);

      // Tạo URL công khai cho file
      const songUrl = `${process.env.CLOUD_ENDPOINT}/${process.env.CLOUD_BUCKET}/${key}`;

      // Kiểm tra URL hợp lệ
      try {
        new URL(songUrl);
        console.log("Song URL:", songUrl); // Debug
      } catch (urlError) {
        console.error("Invalid URL:", songUrl, urlError);
        throw new Error(`URL không hợp lệ: ${songUrl}`);
      }

      // Dữ liệu bài hát để lưu vào MongoDB
      const songData = {
        title,
        genre,
        description,
        artist: artistId,
        songUrl,
        releaseDate: new Date(),
      };

      // Debug: In ra dữ liệu bài hát
      console.log("Song Data:", songData);

      // Lưu thông tin bài hát vào MongoDB
      return await artistRepository.createSong(songData);
    } catch (error) {
      console.error("Upload Song Error:", error); // Debug
      throw new Error(
        `Lỗi khi tải file lên S3 hoặc lưu vào MongoDB: ${error.message}`
      );
    }
  }

  async getSong(id) {
    return await artistRepository.findSongById(id);
  }

  async getAllSongs() {
    return await artistRepository.findAllSongs();
  }

  async getArtistProfile(id) {
    return await artistRepository.findArtistById(id);
  }

  async getSongsByArtist(artistId) {
    return await artistRepository.findSongsByArtist(artistId);
  }

  async getNewReleases() {
    return await artistRepository.findNewReleases();
  }
}

module.exports = new ArtistService();
