const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { isAdmin } = require('../middlewares/auth.middleware');
const { authenticateToken } = require('../middlewares//auth.middleware');

router.get('/', userController.getArtists);
router.get('/featured', userController.getFeaturedArtists);
router.get('/:id', userController.getArtistById);
router.put('/:id',/*isAdmin,*/ userController.updateMyProfile);
router.get('/:id/is-artist', authenticateToken, userController.checkIsArtist);

module.exports = router;