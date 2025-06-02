const songService = require('../services/song.service');

const getMySongs = async (req, res) => {
    try {
        const { page = 1, limit = 10, album_id, search } = req.query;
        const songs = await songService.getSongsByArtist(req.user.id, { page, limit, album_id, search });
        res.status(200).json({ success: true, message: 'Songs retrieved successfully', data: songs });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const getSongsByArtist = async (req, res) => {
    try {
        const { artistId } = req.params;
        if (!artistId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ success: false, message: 'Invalid artist ID' });
        }
        const { page = 1, limit = 10, album_id } = req.query;
        const songs = await songService.getSongsByArtist(artistId, { page, limit, album_id });
        res.status(200).json({ success: true, message: 'Songs retrieved successfully', data: songs });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const getSongsByAlbum = async (req, res) => {
    try {
        const { albumId } = req.params;
        if (!albumId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ success: false, message: 'Invalid album ID' });
        }
        const songs = await songService.getSongsByAlbum(albumId, req.user.id);
        res.status(200).json({ success: true, message: 'Songs retrieved successfully', data: songs });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const createSong = async (req, res) => {
    try {
        const songData = {
            ...req.body,
            artist_id: req.user.id
        };
        const newSong = await songService.createSong(songData, req.user.id);
        res.status(201).json({ success: true, message: 'Song created successfully', data: newSong });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const updateSong = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ success: false, message: 'Invalid song ID' });
        }
        const updatedSong = await songService.updateSong(id, req.user.id, req.body);
        if (!updatedSong) {
            return res.status(404).json({ success: false, message: 'Song not found or you lack permission' });
        }
        res.status(200).json({ success: true, message: 'Song updated successfully', data: updatedSong });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const deleteSong = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ success: false, message: 'Invalid song ID' });
        }
        const result = await songService.deleteSong(id, req.user.id);
        if (!result) {
            return res.status(404).json({ success: false, message: 'Song not found or you lack permission' });
        }
        res.status(200).json({ success: true, message: 'Song deleted successfully', data: result });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const getSongById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ success: false, message: 'Invalid song ID' });
        }
        const song = await songService.getSongById(id, req.user.id);
        if (!song) {
            return res.status(404).json({ success: false, message: 'Song not found' });
        }
        res.status(200).json({ success: true, message: 'Song retrieved successfully', data: song });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const getMySongStats = async (req, res) => {
    try {
        const userId = req.user.id;
        const { period = '7d' } = req.query;
        const stats = await songService.getSongStatsByArtist(userId, period);
        res.status(200).json({ success: true, message: 'Song stats retrieved successfully', data: stats });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = {
    getSongsByArtist,
    getSongsByAlbum,
    getSongById,
    getMySongs,
    createSong,
    updateSong,
    deleteSong,
    getMySongStats
};