const mongoose = require('mongoose');
const User = require('../models/User');
const Song = require('../models/Song');
const Album = require('../models/Album');

// Lấy danh sách nghệ sĩ (ROLE_ARTIST) với phân trang và tìm kiếm
const getArtists = async ({ page = 1, limit = 10, search = '', status = '' }) => {
    const query = {
        role: 'ROLE_ARTIST',
        ...(search && {
            $or: [
                { first_name: { $regex: search, $options: 'i' } },
                { last_name: { $regex: search, $options: 'i' } }
            ]
        }),
        ...(status && { status })
    };

    const artists = await User.find(query)
        .select('first_name last_name profile_image bio status created_at')
        .sort({ created_at: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

    const count = await User.countDocuments(query);

    return {
        artists,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        totalCount: count
    };
};

// Lấy nghệ sĩ nổi bật (có nhiều view hoặc bài hát)
const getFeaturedArtists = async (limit = 10) => {
    return await User.aggregate([
        { $match: { role: 'ROLE_ARTIST', status: 'ACTIVE' } },
        {
            $lookup: {
                from: 'songs',
                localField: '_id',
                foreignField: 'artist_id',
                as: 'songs'
            }
        },
        {
            $lookup: {
                from: 'albums',
                localField: '_id',
                foreignField: 'artist_id',
                as: 'albums'
            }
        },
        {
            $addFields: {
                songCount: { $size: '$songs' },
                albumCount: { $size: '$albums' },
                totalViews: { $sum: '$songs.views' }
            }
        },
        {
            $match: {
                $or: [
                    { songCount: { $gt: 0 } },
                    { albumCount: { $gt: 0 } }
                ]
            }
        },
        {
            $sort: { totalViews: -1, songCount: -1 }
        },
        {
            $limit: limit
        },
        {
            $project: {
                first_name: 1,
                last_name: 1,
                profile_image: 1,
                bio: 1,
                songCount: 1,
                albumCount: 1,
                totalViews: 1
            }
        }
    ]);
};

// Lấy thông tin nghệ sĩ theo ID với thống kê
const getArtistById = async (artistId) => {
    if (!mongoose.Types.ObjectId.isValid(artistId)) {
        throw new Error('Invalid artist ID');
    }

    const artist = await User.findOne({
        _id: artistId,
        role: 'ROLE_ARTIST'
    })
        .select('first_name last_name profile_image bio status created_at')
        .exec();

    if (!artist) {
        return null;
    }

    // Lấy thống kê
    const [songCount, albumCount, totalViews] = await Promise.all([
        Song.countDocuments({ artist_id: artistId }),
        Album.countDocuments({ artist_id: artistId }),
        Song.aggregate([
            { $match: { artist_id: new mongoose.Types.ObjectId(artistId) } },
            { $group: { _id: null, totalViews: { $sum: '$views' } } }
        ])
    ]);

    return {
        ...artist.toObject(),
        stats: {
            songCount,
            albumCount,
            totalViews: totalViews.length > 0 ? totalViews[0].totalViews : 0
        }
    };
};

// Lấy profile chi tiết của artist (bao gồm albums và songs gần đây)
const getArtistProfile = async (artistId) => {
    if (!mongoose.Types.ObjectId.isValid(artistId)) {
        throw new Error('Invalid artist ID');
    }

    const artist = await User.findOne({
        _id: artistId,
        role: 'ROLE_ARTIST'
    })
        .select('first_name last_name email profile_image bio status created_at')
        .exec();

    if (!artist) {
        throw new Error('Artist not found');
    }

    // Lấy albums và songs gần đây
    const [recentAlbums, recentSongs, stats] = await Promise.all([
        Album.find({ artist_id: artistId })
            .select('title cover_image type release_date created_at')
            .sort({ created_at: -1 })
            .limit(5)
            .exec(),
        Song.find({ artist_id: artistId })
            .select('title duration views created_at')
            .populate('album_id', 'title')
            .sort({ created_at: -1 })
            .limit(5)
            .exec(),
        getArtistStats(artistId)
    ]);

    return {
        ...artist.toObject(),
        recentAlbums,
        recentSongs,
        stats
    };
};

// Lấy thống kê chi tiết của artist
const getArtistStats = async (artistId) => {
    const [
        totalSongs,
        totalAlbums,
        totalViewsResult,
        recentSongs,
        topSong
    ] = await Promise.all([
        Song.countDocuments({ artist_id: artistId }),
        Album.countDocuments({ artist_id: artistId }),
        Song.aggregate([
            { $match: { artist_id: new mongoose.Types.ObjectId(artistId) } },
            { $group: { _id: null, totalViews: { $sum: '$views' } } }
        ]),
        Song.countDocuments({
            artist_id: artistId,
            created_at: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }),
        Song.findOne({ artist_id: artistId })
            .select('title views')
            .sort({ views: -1 })
            .exec()
    ]);

    return {
        totalSongs,
        totalAlbums,
        totalViews: totalViewsResult.length > 0 ? totalViewsResult[0].totalViews : 0,
        recentSongs,
        topSong: topSong || null
    };
};

// Cập nhật thông tin nghệ sĩ
const updateArtist = async (artistId, updateData) => {
    if (!mongoose.Types.ObjectId.isValid(artistId)) {
        throw new Error('Invalid artist ID');
    }

    // Validate update data
    const allowedUpdates = ['first_name', 'last_name', 'bio', 'profile_image'];
    const updates = Object.keys(updateData)
        .filter(key => allowedUpdates.includes(key))
        .reduce((obj, key) => {
            obj[key] = updateData[key];
            return obj;
        }, {});

    if (Object.keys(updates).length === 0) {
        throw new Error('No valid fields to update');
    }

    const artist = await User.findOneAndUpdate(
        { _id: artistId, role: 'ROLE_ARTIST' },
        { $set: updates },
        { new: true, runValidators: true }
    ).select('first_name last_name email profile_image bio status created_at');

    if (!artist) {
        throw new Error('Artist not found');
    }

    return artist;
};

// Thay đổi mật khẩu
const changePassword = async (artistId, hashedPassword) => {
    if (!mongoose.Types.ObjectId.isValid(artistId)) {
        throw new Error('Invalid artist ID');
    }

    const artist = await User.findOneAndUpdate(
        { _id: artistId, role: 'ROLE_ARTIST' },
        { $set: { password: hashedPassword } },
        { new: true }
    ).select('first_name last_name email');

    if (!artist) {
        throw new Error('Artist not found');
    }

    return artist;
};

// Upload avatar
const updateAvatar = async (artistId, avatarUrl) => {
    if (!mongoose.Types.ObjectId.isValid(artistId)) {
        throw new Error('Invalid artist ID');
    }

    const artist = await User.findOneAndUpdate(
        { _id: artistId, role: 'ROLE_ARTIST' },
        { $set: { profile_image: avatarUrl } },
        { new: true }
    ).select('first_name last_name profile_image');

    if (!artist) {
        throw new Error('Artist not found');
    }

    return artist;
};

// Lấy thông tin user để verify password
const getUserForPasswordVerification = async (artistId) => {
    if (!mongoose.Types.ObjectId.isValid(artistId)) {
        throw new Error('Invalid artist ID');
    }

    const artist = await User.findOne({
        _id: artistId,
        role: 'ROLE_ARTIST'
    }).select('password').exec();

    return artist;
};

// Kiểm tra xem user có phải là artist không
const isArtist = async (userId) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return false;
    }
    
    const user = await User.findById(userId).select('role').exec();
    return user && user.role === 'ROLE_ARTIST';
};

module.exports = {
    getArtists,
    getFeaturedArtists,
    getArtistById,
    getArtistProfile,
    getArtistStats,
    updateArtist,
    changePassword,
    updateAvatar,
    getUserForPasswordVerification,
    isArtist
};