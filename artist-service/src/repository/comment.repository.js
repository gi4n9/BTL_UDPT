const Comment = require('../models/Comment');
const Song = require('../models/Song');

// Lấy danh sách bình luận theo bài hát với phân trang
const getCommentsBySong = async (songId, { page = 1, limit = 10, type = 'parent' }) => {
    let query = { song_id: songId };

    // Lọc chỉ lấy comment gốc hoặc tất cả
    if (type === 'parent') {
        query.parent_id = null;
    }

    const comments = await Comment.find(query)
        .populate('user_id', 'first_name last_name profile_image')
        .populate({
            path: 'replies',
            populate: {
                path: 'user_id',
                select: 'first_name last_name profile_image'
            }
        })
        .sort({ created_at: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

    const count = await Comment.countDocuments(query);

    return {
        comments,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        totalCount: count
    };
};

// Lấy bình luận trên các bài hát của artist
const getCommentsForArtistSongs = async (artistId, { page = 1, limit = 10 }) => {
    // Lấy tất cả song IDs của artist
    const artistSongs = await Song.find({ artist_id: artistId }).select('_id');
    const songIds = artistSongs.map(song => song._id);

    const comments = await Comment.find({ song_id: { $in: songIds } })
        .populate('user_id', 'first_name last_name profile_image')
        .populate('song_id', 'title')
        .sort({ created_at: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

    const count = await Comment.countDocuments({ song_id: { $in: songIds } });

    return {
        comments,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        totalCount: count
    };
};

// Tạo bình luận mới (reply)
const createComment = async (commentData) => {
    const comment = new Comment(commentData);
    const savedComment = await comment.save();
    return await Comment.findById(savedComment._id)
        .populate('user_id', 'first_name last_name profile_image')
        .populate('song_id', 'title')
        .exec();
};

// Artist phản hồi bình luận
const replyToComment = async (parentCommentId, replyData, artistId) => {
    // Kiểm tra comment gốc có thuộc bài hát của artist không
    const parentComment = await Comment.findById(parentCommentId)
        .populate({
            path: 'song_id',
            select: 'artist_id'
        });

    if (!parentComment) {
        throw new Error('Parent comment not found');
    }

    if (parentComment.song_id.artist_id.toString() !== artistId.toString()) {
        throw new Error('You can only reply to comments on your songs');
    }

    // Tạo reply
    const replyComment = new Comment({
        ...replyData,
        parent_id: parentCommentId,
        song_id: parentComment.song_id._id
    });

    const savedReply = await replyComment.save();
    return await Comment.findById(savedReply._id)
        .populate('user_id', 'first_name last_name profile_image')
        .exec();
};

// Artist xóa bình luận (chỉ trên bài hát của mình)
const deleteCommentByArtist = async (commentId, artistId) => {
    // Tìm comment và kiểm tra quyền
    const comment = await Comment.findById(commentId)
        .populate({
            path: 'song_id',
            select: 'artist_id'
        });

    if (!comment) {
        throw new Error('Comment not found');
    }

    if (comment.song_id.artist_id.toString() !== artistId.toString()) {
        throw new Error('You can only delete comments on your songs');
    }

    // Xóa tất cả replies trước
    await Comment.deleteMany({ parent_id: commentId });

    // Xóa comment chính
    return await Comment.findByIdAndDelete(commentId);
};

// User xóa bình luận của chính mình
const deleteOwnComment = async (commentId, userId) => {
    const comment = await Comment.findOne({
        _id: commentId,
        user_id: userId
    });

    if (!comment) {
        throw new Error('Comment not found or you do not have permission');
    }

    // Xóa tất cả replies trước
    await Comment.deleteMany({ parent_id: commentId });

    // Xóa comment chính
    return await Comment.findByIdAndDelete(commentId);
};

// Lấy comment theo ID
const getCommentById = async (commentId) => {
    return await Comment.findById(commentId)
        .populate('user_id', 'first_name last_name profile_image')
        .populate('song_id', 'title artist_id')
        .exec();
};

// Cập nhật bình luận (chỉ người tạo)
const updateComment = async (commentId, userId, updateData) => {
    return await Comment.findOneAndUpdate(
        { _id: commentId, user_id: userId },
        { $set: updateData },
        { new: true, runValidators: true }
    )
        .populate('user_id', 'first_name last_name profile_image')
        .exec();
};

// Đếm số bình luận theo bài hát
const getCommentCountBySong = async (songId) => {
    return await Comment.countDocuments({ song_id: songId });
};

// Lấy bình luận mới nhất của artist songs
const getLatestCommentsForArtist = async (artistId, limit = 5) => {
    const artistSongs = await Song.find({ artist_id: artistId }).select('_id');
    const songIds = artistSongs.map(song => song._id);

    return await Comment.find({ song_id: { $in: songIds } })
        .populate('user_id', 'first_name last_name profile_image')
        .populate('song_id', 'title')
        .sort({ created_at: -1 })
        .limit(limit)
        .exec();
};

module.exports = {
    getCommentsBySong,
    getCommentsForArtistSongs,
    createComment,
    replyToComment,
    deleteCommentByArtist,
    deleteOwnComment,
    getCommentById,
    updateComment,
    getCommentCountBySong,
    getLatestCommentsForArtist
};