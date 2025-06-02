const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');

router.get('/song/:id', commentController.getCommentsBySong);
router.post('/', commentController.createComment);

module.exports = router;