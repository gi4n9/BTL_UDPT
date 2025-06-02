const albumService = require('../services/album.service');

// Lấy danh sách album của artist hiện tại
const getMyAlbums = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, type } = req.query;
        const albums = await albumService.getAlbumsByArtist(req.user.id, { page, limit, search, type });
        res.status(200).json({ success: true, message: 'Albums retrieved successfully', data: albums });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Lấy danh sách album của một artist cụ thể (public)
const getAlbumsByArtist = async (req, res) => {
    try {
        const { artistId } = req.params;
        if (!artistId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ success: false, message: 'Invalid artist ID' });
        }
        const { page = 1, limit = 10, type } = req.query;
        const albums = await albumService.getAlbumsByArtist(artistId, { page, limit, type });
        res.status(200).json({ success: true, message: 'Albums retrieved successfully', data: albums });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Thêm mới album
const createAlbum = async (req, res) => {
    try {
        const albumData = {
            ...req.body,
            artist_id: req.user.id
        };
        const newAlbum = await albumService.createAlbum(albumData);
        res.status(201).json({ success: true, message: 'Album created successfully', data: newAlbum });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Cập nhật album
const updateAlbum = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ success: false, message: 'Invalid album ID' });
        }
        const updatedAlbum = await albumService.updateAlbum(id, req.user.id, req.body);
        if (!updatedAlbum) {
            return res.status(404).json({ success: false, message: 'Album not found or you lack permission' });
        }
        res.status(200).json({ success: true, message: 'Album updated successfully', data: updatedAlbum });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Xóa album
const deleteAlbum = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ success: false, message: 'Invalid album ID' });
        }
        const result = await albumService.deleteAlbum(id, req.user.id);
        if (!result) {
            return res.status(404).json({ success: false, message: 'Album not found or you lack permission' });
        }
        res.status(200).json({ success: true, message: 'Album deleted successfully', data: result });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Lấy chi tiết album
const getAlbumById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ success: false, message: 'Invalid album ID' });
        }
        const album = await albumService.getAlbumById(id);
        if (!album) {
            return res.status(404).json({ success: false, message: 'Album not found' });
        }
        res.status(200).json({ success: true, message: 'Album retrieved successfully', data: album });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { 
    // Public routes
    getAlbumsByArtist,  // Lấy album của artist theo ID  
    getAlbumById,       // Lấy chi tiết album
    
    // Artist routes (cần authentication + role ROLE_ARTIST)
    getMyAlbums,        // Lấy album của mình
    createAlbum,        // Tạo album mới
    updateAlbum,        // Cập nhật album
    deleteAlbum         // Xóa album
};