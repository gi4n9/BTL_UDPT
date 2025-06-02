const Album = require('../models/Album');
const Song = require('../models/Song');

// Lấy danh sách album theo nghệ sĩ với phân trang, tìm kiếm, lọc
const getAlbumsByArtist = async (artistId, { page = 1, limit = 10, search = '', type = '' }) => {
    const query = { artist_id: artistId };

    // Tìm kiếm theo title
    if (search) {
        query.title = { $regex: search, $options: 'i' };
    }

    // Lọc theo type (FREE/PREMIUM)
    if (type) {
        query.type = type;
    }

    const albums = await Album.find(query)
        .populate('artist_id', 'first_name last_name profile_image')
        .sort({ created_at: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

    const count = await Album.countDocuments(query);

    return {
        albums,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        totalCount: count
    };
};

// Lấy album theo ID (chỉ của artist hiện tại)
const getAlbumById = async (albumId, artistId = null) => {
    const query = { _id: albumId };
    if (artistId) {
        query.artist_id = artistId;
    }

    return await Album.findOne(query)
        .populate('artist_id', 'first_name last_name profile_image')
        .populate('songs') // Virtual populate
        .exec();
};

// Tạo album mới
const createAlbum = async (albumData) => {
    const album = new Album(albumData);
    const savedAlbum = await album.save();
    return await Album.findById(savedAlbum._id)
        .populate('artist_id', 'first_name last_name profile_image')
        .exec();
};

// Cập nhật album (chỉ artist sở hữu)
const updateAlbum = async (albumId, artistId, updateData) => {
    return await Album.findOneAndUpdate(
        { _id: albumId, artist_id: artistId },
        { $set: updateData },
        { new: true, runValidators: true }
    )
        .populate('artist_id', 'first_name last_name profile_image')
        .exec();
};

// Xóa album (chỉ artist sở hữu)
const deleteAlbum = async (albumId, artistId) => {
    // Kiểm tra xem album có bài hát không
    const songCount = await Song.countDocuments({ album_id: albumId });
    if (songCount > 0) {
        throw new Error('Cannot delete album that contains songs. Please remove all songs first.');
    }

    const album = await Album.findOneAndDelete({
        _id: albumId,
        artist_id: artistId
    });

    return album;
};

// Kiểm tra quyền sở hữu album
const checkAlbumOwnership = async (albumId, artistId) => {
    const album = await Album.findOne({
        _id: albumId,
        artist_id: artistId
    });
    return !!album;
};

// Lấy danh sách album công khai (cho public API)
const getPublicAlbums = async ({ page = 1, limit = 10, search = '', type = '' }) => {
    const query = {};

    if (search) {
        query.title = { $regex: search, $options: 'i' };
    }

    if (type) {
        query.type = type;
    }

    const albums = await Album.find(query)
        .populate('artist_id', 'first_name last_name profile_image')
        .sort({ created_at: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

    const count = await Album.countDocuments(query);

    return {
        albums,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        totalCount: count
    };
};

// Lấy album nổi bật (có nhiều bài hát hoặc view cao)
const getFeaturedAlbums = async (limit = 10) => {
    return await Album.aggregate([
        {
            $lookup: {
                from: 'songs',
                localField: '_id',
                foreignField: 'album_id',
                as: 'songs'
            }
        },
        {
            $addFields: {
                songCount: { $size: '$songs' },
                totalViews: { $sum: '$songs.views' }
            }
        },
        {
            $sort: { totalViews: -1, songCount: -1 }
        },
        {
            $limit: limit
        },
        {
            $lookup: {
                from: 'users',
                localField: 'artist_id',
                foreignField: '_id',
                as: 'artist'
            }
        },
        {
            $unwind: '$artist'
        },
        {
            $project: {
                title: 1,
                cover_image: 1,
                type: 1,
                release_date: 1,
                songCount: 1,
                totalViews: 1,
                'artist.first_name': 1,
                'artist.last_name': 1,
                'artist.profile_image': 1
            }
        }
    ]);
};

module.exports = {
    getAlbumsByArtist,
    getAlbumById,
    createAlbum,
    updateAlbum,
    deleteAlbum,
    checkAlbumOwnership,
    getPublicAlbums,
    getFeaturedAlbums
};