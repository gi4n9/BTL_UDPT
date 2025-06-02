const express = require('express');
const router = express.Router();
const albumController = require('../controllers/album.controller');
const { isAdmin } = require('../middlewares/auth.middleware');

router.get('/artist/:id', albumController.getAlbumsByArtist);
router.delete('/:id',/*isAdmin,*/ albumController.deleteAlbum);

module.exports = router;