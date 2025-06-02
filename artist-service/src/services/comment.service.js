const commentRepository = require('../repository/comment.repository');

// Lấy danh sách bình luận theo bài hát
const getCommentsBySong = async (songId) => {
    try {
        return await commentRepository.getCommentsBySong(songId);
    } catch (err) {
        throw new Error(`Error fetching comments for song: ${err.message}`);
    }
};

// Thêm bình luận
const createComment = async (commentData) => {
    try {
        return await commentRepository.createComment(commentData);
    } catch (err) {
        throw new Error(`Error creating comment: ${err.message}`);
    }
};

module.exports = { getCommentsBySong, createComment };