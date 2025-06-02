const express = require('express');
const router = express.Router();
const songController = require('../controllers/song.controller');
const { isAdmin } = require('../middlewares/auth.middleware');

router.get('/artist/:id', songController.getSongsByArtist);
router.delete('/:id',/*isAdmin,*/ songController.deleteSong);

module.exports = router;