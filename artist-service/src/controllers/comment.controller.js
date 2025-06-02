const commentService = require('../services/comment.service');

// Lấy bình luận theo bài hát
const getCommentsBySong = async (req, res) => {
    try {
        const { songId } = req.params;
        if (!songId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'Invalid song ID' });
        }
        
        const { page = 1, limit = 10, type = 'parent' } = req.query;
        const comments = await commentService.getCommentsBySong(songId, { page, limit, type });
        res.status(200).json(comments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Lấy bình luận của bài hát thuộc về artist hiện tại
const getMyCommentsForMySongs = async (req, res) => {
    try {
        const userId = req.user.id; // User có role ROLE_ARTIST
        const { page = 1, limit = 10 } = req.query;
        
        const comments = await commentService.getCommentsForArtistSongs(userId, { page, limit });
        res.status(200).json(comments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Artist phản hồi bình luận
const replyToComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { content } = req.body;
        
        if (!commentId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'Invalid comment ID' });
        }
        
        if (!content || content.trim().length === 0) {
            return res.status(400).json({ message: 'Content is required' });
        }
        
        const replyData = {
            content: content.trim(),
            user_id: req.user.id,
            parent_id: commentId
        };
        
        const reply = await commentService.replyToComment(commentId, replyData, req.user.id);
        if (!reply) {
            return res.status(404).json({ message: 'Parent comment not found' });
        }
        res.status(201).json(reply);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Artist xóa bình luận (chỉ xóa bình luận trên bài hát của mình)
const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        if (!commentId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'Invalid comment ID' });
        }
        
        const result = await commentService.deleteCommentByArtist(commentId, req.user.id);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Lấy thống kê bình luận của artist hiện tại
const getMyCommentStats = async (req, res) => {
    try {
        const userId = req.user.id;
        const { period = '7d' } = req.query; // 7d, 30d, 90d, 1y
        
        const stats = await commentService.getCommentStatsByArtist(userId, period);
        res.status(200).json(stats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { 
    // Public routes
    getCommentsBySong,      // Lấy bình luận theo bài hát
    
    // Artist routes (cần authentication + role ROLE_ARTIST)
    getMyCommentsForMySongs, // Lấy bình luận trên bài hát của mình
    replyToComment,         // Phản hồi bình luận
    deleteComment,          // Xóa bình luận (chỉ trên bài hát của mình)
    getMyCommentStats       // Thống kê bình luận của mình
};