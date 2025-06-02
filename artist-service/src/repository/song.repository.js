const mongoose = require('mongoose');
const Song = require('../models/Song');
const Album = require('../models/Album');

// Lấy danh sách bài hát theo nghệ sĩ với phân trang, tìm kiếm, lọc
const getSongsByArtist = async (artistId, { page = 1, limit = 10, album_id = '', search = '' }) => {
    const query = { artist_id: artistId };

    // Lọc theo album
    if (album_id) {
        query.album_id = album_id;
    }

    // Tìm kiếm theo title
    if (search) {
        query.title = { $regex: search, $options: 'i' };
    }

    const songs = await Song.find(query)
        .populate('artist_id', 'first_name last_name profile_image')
        .populate('album_id', 'title cover_image type')
        .sort({ created_at: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

    const count = await Song.countDocuments(query);

    return {
        songs,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        totalCount: count
    };
};

// Lấy bài hát theo album (chỉ của artist hiện tại)
const getSongsByAlbum = async (albumId, artistId = null) => {
    const query = { album_id: albumId };

    // Nếu có artistId, kiểm tra quyền sở hữu album
    if (artistId) {
        const album = await Album.findOne({ _id: albumId, artist_id: artistId });
        if (!album) {
            throw new Error('Album not found or you do not have permission');
        }
    }

    return await Song.find(query)
        .populate('artist_id', 'first_name last_name profile_image')
        .populate('album_id', 'title cover_image type')
        .sort({ created_at: 1 }) // Sắp xếp theo thứ tự trong album
        .exec();
};

// Lấy bài hát theo ID
const getSongById = async (songId, artistId = null) => {
    const query = { _id: songId };
    if (artistId) {
        query.artist_id = artistId;
    }

    return await Song.findOne(query)
        .populate('artist_id', 'first_name last_name profile_image')
        .populate('album_id', 'title cover_image type')
        .exec();
};

// Tạo bài hát mới
const createSong = async (songData, artistId) => {
    // Kiểm tra quyền sở hữu album nếu có
    if (songData.album_id) {
        const album = await Album.findOne({
            _id: songData.album_id,
            artist_id: artistId
        });
        if (!album) {
            throw new Error('Album not found or you do not have permission');
        }
    }

    const song = new Song({
        ...songData,
        artist_id: artistId
    });

    const savedSong = await song.save();
    return await Song.findById(savedSong._id)
        .populate('artist_id', 'first_name last_name profile_image')
        .populate('album_id', 'title cover_image type')
        .exec();
};

// Cập nhật bài hát (chỉ artist sở hữu)
const updateSong = async (songId, artistId, updateData) => {
    // Nếu thay đổi album, kiểm tra quyền sở hữu album mới
    if (updateData.album_id) {
        const album = await Album.findOne({
            _id: updateData.album_id,
            artist_id: artistId
        });
        if (!album) {
            throw new Error('Album not found or you do not have permission');
        }
    }

    return await Song.findOneAndUpdate(
        { _id: songId, artist_id: artistId },
        { $set: updateData },
        { new: true, runValidators: true }
    )
        .populate('artist_id', 'first_name last_name profile_image')
        .populate('album_id', 'title cover_image type')
        .exec();
};

// Xóa bài hát (chỉ artist sở hữu)
const deleteSong = async (songId, artistId) => {
    return await Song.findOneAndDelete({
        _id: songId,
        artist_id: artistId
    });
};

// Kiểm tra quyền sở hữu bài hát
const checkSongOwnership = async (songId, artistId) => {
    const song = await Song.findOne({
        _id: songId,
        artist_id: artistId
    });
    return !!song;
};

// Tăng view cho bài hát
const incrementSongViews = async (songId) => {
    return await Song.findByIdAndUpdate(
        songId,
        { $inc: { views: 1 } },
        { new: true }
    );
};

// Lấy top bài hát theo view
const getTopSongs = async (limit = 15, period = 'week') => {
    let dateFilter = {};

    if (period === 'week') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        dateFilter = { created_at: { $gte: oneWeekAgo } };
    }

    return await Song.find(dateFilter)
        .populate('artist_id', 'first_name last_name profile_image')
        .populate('album_id', 'title cover_image')
        .sort({ views: -1 })
        .limit(limit)
        .exec();
};

// Lấy bài hát trending (view cao trong thời gian ngắn)
const getTrendingSongs = async (limit = 15) => {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    return await Song.find({ created_at: { $gte: threeDaysAgo } })
        .populate('artist_id', 'first_name last_name profile_image')
        .populate('album_id', 'title cover_image')
        .sort({ views: -1 })
        .limit(limit)
        .exec();
};

// Lấy bài hát mới nhất
const getLatestSongs = async (limit = 10) => {
    return await Song.find({})
        .populate('artist_id', 'first_name last_name profile_image')
        .populate('album_id', 'title cover_image')
        .sort({ created_at: -1 })
        .limit(limit)
        .exec();
};

// Tìm kiếm bài hát
const searchSongs = async (searchTerm, { page = 1, limit = 10 }) => {
    const query = {
        title: { $regex: searchTerm, $options: 'i' }
    };

    const songs = await Song.find(query)
        .populate('artist_id', 'first_name last_name profile_image')
        .populate('album_id', 'title cover_image')
        .sort({ views: -1, created_at: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

    const count = await Song.countDocuments(query);

    return {
        songs,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        totalCount: count
    };
};

// Lấy tổng lượt xem của các bài hát theo nghệ sĩ
const getTotalViewsByArtist = async (artistId) => {
    const result = await Song.aggregate([
        { $match: { artist_id: new mongoose.Types.ObjectId(artistId) } },
        { $group: { _id: '$artist_id', totalViews: { $sum: '$views' } } }
    ]);
    return result.length > 0 ? result[0].totalViews : 0;
};

// Đếm số bài hát của artist
const getSongCountByArtist = async (artistId) => {
    return await Song.countDocuments({ artist_id: artistId });
};

// Lấy bài hát gần đây của artist
const getRecentSongsByArtist = async (artistId, limit = 5) => {
    return await Song.find({ artist_id: artistId })
        .populate('album_id', 'title cover_image')
        .sort({ created_at: -1 })
        .limit(limit)
        .exec();
};

module.exports = {
    getSongsByArtist,
    getSongsByAlbum,
    getSongById,
    createSong,
    updateSong,
    deleteSong,
    checkSongOwnership,
    incrementSongViews,
    getTopSongs,
    getTrendingSongs,
    getLatestSongs,
    searchSongs,
    getTotalViewsByArtist,
    getSongCountByArtist,
    getRecentSongsByArtist
};