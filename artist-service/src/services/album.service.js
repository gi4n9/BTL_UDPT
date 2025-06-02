const albumRepository = require('../repository/album.repository');
const songRepository = require('../repository/song.repository');
const nodemailer = require('nodemailer');

const getAlbumsByArtist = async (artistId, options = {}) => {
    try {
        const { page = 1, limit = 10, search, type } = options;
        const validatedPage = Math.max(1, parseInt(page));
        const validatedLimit = Math.min(50, Math.max(1, parseInt(limit)));
        return await albumRepository.getAlbumsByArtist(artistId, { page: validatedPage, limit: validatedLimit, search, type });
    } catch (err) {
        throw new Error(`Error fetching albums for artist: ${err.message}`);
    }
};

const getAlbumById = async (albumId) => {
    try {
        const album = await albumRepository.getAlbumById(albumId);
        if (!album) throw new Error('Album not found');
        return album;
    } catch (err) {
        throw new Error(`Error fetching album: ${err.message}`);
    }
};

const createAlbum = async (albumData) => {
    try {
        if (!albumData.title || !albumData.artist_id) {
            throw new Error('Title and artist_id are required');
        }
        const newAlbumData = {
            ...albumData,
            type: albumData.type || 'FREE',
            release_date: albumData.release_date || new Date()
        };
        return await albumRepository.createAlbum(newAlbumData);
    } catch (err) {
        throw new Error(`Error creating album: ${err.message}`);
    }
};

const updateAlbum = async (albumId, artistId, updateData) => {
    try {
        const album = await albumRepository.getAlbumById(albumId);
        if (!album) throw new Error('Album not found');
        if (album.artist_id.toString() !== artistId) {
            throw new Error('You can only update your own albums');
        }
        const { artist_id, created_at, updated_at, ...allowedData } = updateData;
        return await albumRepository.updateAlbum(albumId, allowedData);
    } catch (err) {
        throw new Error(`Error updating album: ${err.message}`);
    }
};

const deleteAlbum = async (albumId, artistId) => {
    try {
        const album = await albumRepository.getAlbumById(albumId);
        if (!album) throw new Error('Album not found');
        if (album.artist_id.toString() !== artistId) {
            throw new Error('You can only delete your own albums');
        }
        await albumRepository.deleteAlbum(albumId);
        return { message: 'Album deleted successfully' };
    } catch (err) {
        throw new Error(`Error deleting album: ${err.message}`);
    }
};

const getFeaturedAlbums = async (limit = 10) => {
    try {
        return await albumRepository.getFeaturedAlbums(limit);
    } catch (err) {
        throw new Error(`Error fetching featured albums: ${err.message}`);
    }
};

// [ADMIN FUNCTION - COMMENTED OUT UNTIL AUTH IS READY]
// Xóa album và gửi email thông báo (Admin)
// const deleteAlbumByAdmin = async (albumId) => {
//     try {
//         const album = await albumRepository.getAlbumById(albumId);
//         if (!album) throw new Error('Album not found');

//         // Delete album
//         await albumRepository.deleteAlbum(albumId);

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
//             to: album.artist_id.email,
//             subject: 'Album Removal Notification',
//             html: `
//                 <h3>Album Removal Notification</h3>
//                 <p>Dear ${album.artist_id.first_name} ${album.artist_id.last_name},</p>
//                 <p>Your album "<strong>${album.title}</strong>" has been removed due to inappropriate content.</p>
//                 <p>If you have any questions, please contact our support team.</p>
//                 <br>
//                 <p>Best regards,<br>Music Platform Team</p>
//             `
//         };

//         await transporter.sendMail(mailOptions);

//         return { message: 'Album deleted and artist notified via email' };
//     } catch (err) {
//         throw new Error(`Error deleting album by admin: ${err.message}`);
//     }
// };

module.exports = {
    // Public functions
    getFeaturedAlbums,
    getAlbumById,
    getAlbumsByArtist,

    // Artist functions
    createAlbum,
    updateAlbum,
    deleteAlbum

    // Admin functions (commented out)
    // deleteAlbumByAdmin
};