const songRepository = require('../repository/song.repository');
const albumRepository = require('../repository/album.repository');
const nodemailer = require('nodemailer');

// Lấy danh sách bài hát theo nghệ sĩ với pagination và filter
const getSongsByArtist = async (artistId, options = {}) => {
    try {
        const { page = 1, limit = 10, album_id, search } = options;
        const validatedPage = Math.max(1, parseInt(page));
        const validatedLimit = Math.min(50, Math.max(1, parseInt(limit)));
        return await songRepository.getSongsByArtist(artistId, { page: validatedPage, limit: validatedLimit, album_id, search });
    } catch (err) {
        throw new Error(`Error fetching songs for artist: ${err.message}`);
    }
};
// Lấy danh sách bài hát theo album
const getSongsByAlbum = async (albumId, userId = null) => {
    try {
        // Kiểm tra album có tồn tại không
        const album = await albumRepository.getAlbumById(albumId);
        if (!album) throw new Error('Album not found');

        return await songRepository.getSongsByAlbum(albumId);
    } catch (err) {
        throw new Error(`Error fetching songs by album: ${err.message}`);
    }
};

// Lấy chi tiết bài hát theo ID
const getSongById = async (songId, userId = null) => {
    try {
        const song = await songRepository.getSongById(songId);
        if (!song) throw new Error('Song not found');

        // Tăng view count (chỉ khi không phải chính artist)
        if (!userId || song.artist_id.toString() !== userId) {
            await songRepository.incrementSongViews(songId);
        }

        return song;
    } catch (err) {
        throw new Error(`Error fetching song: ${err.message}`);
    }
};

// Tạo bài hát mới (Artist)
const createSong = async (songData, artistId) => {
    try {
        // Validate required fields
        if (!songData.title || !songData.duration || !songData.file_url) {
            throw new Error('Title, duration, and file_url are required');
        }

        // Kiểm tra album có thuộc về artist không (nếu có album_id)
        if (songData.album_id) {
            const album = await albumRepository.getAlbumById(songData.album_id);
            if (!album) throw new Error('Album not found');

            if (album.artist_id.toString() !== artistId) {
                throw new Error('You can only add songs to your own albums');
            }
        }

        // Ensure artist_id matches authenticated user
        const newSongData = {
            ...songData,
            artist_id: artistId,
            views: 0
        };

        return await songRepository.createSong(newSongData);
    } catch (err) {
        throw new Error(`Error creating song: ${err.message}`);
    }
};

// Cập nhật bài hát (Artist)
const updateSong = async (songId, artistId, updateData) => {
    try {
        // Kiểm tra bài hát có tồn tại và thuộc về artist không
        const song = await songRepository.getSongById(songId);
        if (!song) throw new Error('Song not found');

        if (song.artist_id.toString() !== artistId) {
            throw new Error('You can only update your own songs');
        }

        // Kiểm tra album nếu có thay đổi album_id
        if (updateData.album_id) {
            const album = await albumRepository.getAlbumById(updateData.album_id);
            if (!album) throw new Error('Album not found');

            if (album.artist_id.toString() !== artistId) {
                throw new Error('You can only move songs to your own albums');
            }
        }

        // Remove fields that shouldn't be updated
        const { artist_id, views, created_at, updated_at, ...allowedData } = updateData;

        return await songRepository.updateSong(songId, allowedData);
    } catch (err) {
        throw new Error(`Error updating song: ${err.message}`);
    }
};

// Xóa bài hát (Artist)
const deleteSong = async (songId, artistId) => {
    try {
        // Kiểm tra bài hát có tồn tại và thuộc về artist không
        const song = await songRepository.getSongById(songId);
        if (!song) throw new Error('Song not found');

        if (song.artist_id.toString() !== artistId) {
            throw new Error('You can only delete your own songs');
        }

        await songRepository.deleteSong(songId);
        return { message: 'Song deleted successfully' };
    } catch (err) {
        throw new Error(`Error deleting song: ${err.message}`);
    }
};

// Lấy danh sách bài hát trending (Public)
const getTrendingSongs = async (limit = 15) => {
    try {
        return await songRepository.getTrendingSongs(limit);
    } catch (err) {
        throw new Error(`Error fetching trending songs: ${err.message}`);
    }
};

// Lấy top bài hát theo tuần (Public)
const getWeeklyTopSongs = async (limit = 15) => {
    try {
        return await songRepository.getWeeklyTopSongs(limit);
    } catch (err) {
        throw new Error(`Error fetching weekly top songs: ${err.message}`);
    }
};

// Lấy top bài hát mọi thời đại (Public)
const getAllTimeTopSongs = async (limit = 15) => {
    try {
        return await songRepository.getAllTimeTopSongs(limit);
    } catch (err) {
        throw new Error(`Error fetching all time top songs: ${err.message}`);
    }
};

// Lấy bài hát mới phát hành (Public)
const getRecentSongs = async (limit = 10) => {
    try {
        return await songRepository.getRecentSongs(limit);
    } catch (err) {
        throw new Error(`Error fetching recent songs: ${err.message}`);
    }
};

// Lấy thống kê bài hát của artist (Artist)
const getSongStatsByArtist = async (artistId, period = '7d') => {
    try {
        return await songRepository.getSongStatsByArtist(artistId, period);
    } catch (err) {
        throw new Error(`Error fetching song stats: ${err.message}`);
    }
};

// Tìm kiếm bài hát (Public)
const searchSongs = async (query, options = {}) => {
    try {
        const { page = 1, limit = 10, genre } = options;
        return await songRepository.searchSongs(query, { page, limit, genre });
    } catch (err) {
        throw new Error(`Error searching songs: ${err.message}`);
    }
};

// [ADMIN FUNCTION - COMMENTED OUT UNTIL AUTH IS READY]
// Xóa bài hát và gửi email thông báo (Admin)
// const deleteSongByAdmin = async (songId) => {
//     try {
//         const song = await songRepository.getSongById(songId);
//         if (!song) throw new Error('Song not found');

//         // Delete song
//         await songRepository.deleteSong(songId);

//         // Send notification email to artist
//         const transporter = nodemailer.createTransporter({
//             service: 'gmail',
//             auth: {
//                 user: process.env.EMAIL_USER,
//                 pass: process.env.EMAIL_PASS
//             }
//         });

//         const mailOptions = {
//             from: process.env.EMAIL_USER,
//             to: song.artist_id.email,
//             subject: 'Song Removal Notification',
//             html: `
//                 <h3>Song Removal Notification</h3>
//                 <p>Dear ${song.artist_id.first_name} ${song.artist_id.last_name},</p>
//                 <p>Your song "<strong>${song.title}</strong>" has been removed due to inappropriate content.</p>
//                 <p>If you have any questions, please contact our support team.</p>
//                 <br>
//                 <p>Best regards,<br>Music Platform Team</p>
//             `
//         };

//         await transporter.sendMail(mailOptions);

//         return { message: 'Song deleted and artist notified via email' };
//     } catch (err) {
//         throw new Error(`Error deleting song by admin: ${err.message}`);
//     }
// };

module.exports = {
    // Public functions
    getTrendingSongs,
    getWeeklyTopSongs,
    getAllTimeTopSongs,
    getRecentSongs,
    searchSongs,
    getSongById,
    getSongsByArtist,
    getSongsByAlbum,

    // Artist functions
    createSong,
    updateSong,
    deleteSong,
    getSongStatsByArtist

    // Admin functions (commented out)
    // deleteSongByAdmin
};