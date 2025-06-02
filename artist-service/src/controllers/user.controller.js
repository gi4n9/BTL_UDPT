const userService = require('../services/user.service');

// Lấy danh sách nghệ sĩ (public)
const getArtists = async (req, res) => {
    try {
        const result = await userService.getArtists(req.query);

        res.status(200).json({
            success: true,
            message: 'Artists retrieved successfully',
            data: result
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// Lấy danh sách nghệ sĩ nổi bật (public)
const getFeaturedArtists = async (req, res) => {
    try {
        const { limit = 10 } = req.query;
        const artists = await userService.getFeaturedArtists(limit);

        res.status(200).json({
            success: true,
            message: 'Featured artists retrieved successfully',
            data: artists
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// Lấy thông tin nghệ sĩ theo ID (public)
const getArtistById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Artist ID is required'
            });
        }

        const artist = await userService.getArtistById(id);

        res.status(200).json({
            success: true,
            message: 'Artist retrieved successfully',
            data: artist
        });
    } catch (err) {
        const status = err.message === 'Artist not found' || err.message === 'Invalid artist ID' ? 404 : 500;
        res.status(status).json({
            success: false,
            message: err.message
        });
    }
};

const checkIsArtist = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID'
            });
        }

        const isArtist = await userService.isArtist(id);
        res.status(200).json({
            success: true,
            message: 'Checked artist role successfully',
            data: { isArtist }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// Lấy profile của nghệ sĩ hiện tại
const getMyProfile = async (req, res) => {
    try {
        // TODO: Uncomment when auth middleware is ready
        // if (!req.user || !req.user.id) {
        //     return res.status(401).json({
        //         success: false,
        //         message: 'Authentication required'
        //     });
        // }

        // Temporary: Get ID from params for testing
        const userId = req.user?.id || req.params.id;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        const profile = await userService.getArtistProfile(userId);

        res.status(200).json({
            success: true,
            message: 'Profile retrieved successfully',
            data: profile
        });
    } catch (err) {
        const status = err.message === 'Artist not found' || err.message === 'Invalid artist ID' ? 404 : 500;
        res.status(status).json({
            success: false,
            message: err.message
        });
    }
};

// Cập nhật thông tin nghệ sĩ hiện tại
const updateMyProfile = async (req, res) => {
    try {
        // TODO: Uncomment when auth middleware is ready
        // if (!req.user || !req.user.id) {
        //     return res.status(401).json({
        //         success: false,
        //         message: 'Authentication required'
        //     });
        // }

        // Temporary: Get ID from params for testing
        const userId = req.user?.id || req.params.id;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Update data is required'
            });
        }

        const updatedUser = await userService.updateArtist(userId, req.body, req);

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: updatedUser
        });
    } catch (err) {
        let status = 500;
        if (err.message.includes('Artist not found') || err.message.includes('Invalid artist ID')) {
            status = 404;
        } else if (err.message.includes('must be between') ||
            err.message.includes('No data provided') ||
            err.message.includes('No valid fields')) {
            status = 400;
        }

        res.status(status).json({
            success: false,
            message: err.message
        });
    }
};

// Thay đổi mật khẩu
const changePassword = async (req, res) => {
    try {
        // TODO: Uncomment when auth middleware is ready
        // if (!req.user || !req.user.id) {
        //     return res.status(401).json({
        //         success: false,
        //         message: 'Authentication required'
        //     });
        // }

        // Temporary: Get ID from params for testing
        const userId = req.user?.id || req.params.id;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current password and new password are required'
            });
        }

        const result = await userService.changePassword(userId, currentPassword, newPassword);

        res.status(200).json({
            success: true,
            message: 'Password changed successfully',
            data: result
        });
    } catch (err) {
        let status = 500;
        if (err.message.includes('Artist not found') || err.message.includes('Invalid artist ID')) {
            status = 404;
        } else if (err.message.includes('password')) {
            status = 400;
        }

        res.status(status).json({
            success: false,
            message: err.message
        });
    }
};

// Upload avatar
const uploadAvatar = async (req, res) => {
    try {
        // TODO: Uncomment when auth middleware is ready
        // if (!req.user || !req.user.id) {
        //     return res.status(401).json({
        //         success: false,
        //         message: 'Authentication required'
        //     });
        // }

        // Temporary: Get ID from params for testing
        const userId = req.user?.id || req.params.id;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const result = await userService.uploadAvatar(userId, req.file);

        res.status(200).json({
            success: true,
            message: 'Avatar uploaded successfully',
            data: result
        });
    } catch (err) {
        let status = 500;
        if (err.message.includes('Artist not found') || err.message.includes('Invalid artist ID')) {
            status = 404;
        } else if (err.message.includes('No file') ||
            err.message.includes('Invalid file') ||
            err.message.includes('File size')) {
            status = 400;
        }

        res.status(status).json({
            success: false,
            message: err.message
        });
    }
};

// Admin: Cập nhật thông tin bất kỳ nghệ sĩ nào
// const updateArtist = async (req, res) => {
//     try {
//         if (!req.user || !req.user.isAdmin) {
//             return res.status(403).json({
//                 success: false,
//                 message: 'Admin access required'
//             });
//         }

//         const { id } = req.params;

//         if (!id) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Artist ID is required'
//             });
//         }

//         const updatedArtist = await userService.updateArtist(id, req.body, req);

//         res.status(200).json({
//             success: true,
//             message: 'Artist updated successfully',
//             data: updatedArtist
//         });
//     } catch (err) {
//         const status = err.message === 'Artist not found' ? 404 : 500;
//         res.status(status).json({
//             success: false,
//             message: err.message
//         });
//     }
// };

module.exports = {
    // Public routes
    getArtists,         // GET /artists - Lấy danh sách nghệ sĩ
    getFeaturedArtists, // GET /artists/featured - Lấy nghệ sĩ nổi bật
    getArtistById,      // GET /artists/:id - Lấy thông tin nghệ sĩ theo ID

    // Protected routes (require authentication + role ROLE_ARTIST)
    getMyProfile,       // GET /artists/profile - Lấy profile của chính mình
    updateMyProfile,    // PUT /artists/profile - Cập nhật profile
    changePassword,     // POST /artists/change-password - Thay đổi mật khẩu
    uploadAvatar,       // POST /artists/upload-avatar - Upload avatar
    checkIsArtist,      // GET /artists/:id/check-artist - Kiểm tra xem user có phải artist không

    // Admin routes (commented out)
    // updateArtist     // PUT /artists/:id - Admin cập nhật nghệ sĩ
};