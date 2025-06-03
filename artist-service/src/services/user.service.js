const userRepository = require("../repository/user.repository");
const bcrypt = require("bcrypt");

// Lấy danh sách nghệ sĩ (ROLE_ARTIST)
const getArtists = async (query) => {
  try {
    const { page = 1, limit = 10, search = "", status = "" } = query;

    // Validate pagination
    const validatedPage = Math.max(1, parseInt(page));
    const validatedLimit = Math.min(50, Math.max(1, parseInt(limit))); // Max 50 items per page

    return await userRepository.getArtists({
      page: validatedPage,
      limit: validatedLimit,
      search: search.trim(),
      status,
    });
  } catch (err) {
    throw new Error(`Error fetching artists: ${err.message}`);
  }
};

// Lấy danh sách nghệ sĩ nổi bật
const getFeaturedArtists = async (limit = 10) => {
  try {
    const validatedLimit = Math.min(20, Math.max(1, parseInt(limit))); // Max 20 featured artists
    return await userRepository.getFeaturedArtists(validatedLimit);
  } catch (err) {
    throw new Error(`Error fetching featured artists: ${err.message}`);
  }
};

// Lấy thông tin nghệ sĩ theo ID (public)
const getArtistById = async (artistId) => {
  try {
    const artist = await userRepository.getArtistById(artistId);
    if (!artist) {
      throw new Error("Artist not found");
    }
    return artist;
  } catch (err) {
    if (
      err.message === "Artist not found" ||
      err.message === "Invalid artist ID"
    ) {
      throw err;
    }
    throw new Error(`Error fetching artist: ${err.message}`);
  }
};

// Lấy profile của artist hiện tại (authentication required)
const getArtistProfile = async (artistId) => {
  try {
    return await userRepository.getArtistProfile(artistId);
  } catch (err) {
    if (
      err.message === "Artist not found" ||
      err.message === "Invalid artist ID"
    ) {
      throw err;
    }
    throw new Error(`Error fetching artist profile: ${err.message}`);
  }
};

// Cập nhật thông tin nghệ sĩ (chỉ cho phép update chính mình)
const updateArtist = async (artistId, updateData, req) => {
  try {
    // Validate input data
    if (!updateData || Object.keys(updateData).length === 0) {
      throw new Error("No data provided for update");
    }

    // Sanitize data
    const sanitizedData = {};
    if (updateData.first_name) {
      sanitizedData.first_name = updateData.first_name.trim();
      if (
        sanitizedData.first_name.length < 1 ||
        sanitizedData.first_name.length > 100
      ) {
        throw new Error("First name must be between 1 and 100 characters");
      }
    }

    if (updateData.last_name) {
      sanitizedData.last_name = updateData.last_name.trim();
      if (
        sanitizedData.last_name.length < 1 ||
        sanitizedData.last_name.length > 100
      ) {
        throw new Error("Last name must be between 1 and 100 characters");
      }
    }

    if (updateData.bio !== undefined) {
      sanitizedData.bio = updateData.bio.trim();
    }

    if (updateData.profile_image) {
      sanitizedData.profile_image = updateData.profile_image.trim();
    }

    return await userRepository.updateArtist(artistId, sanitizedData);
  } catch (err) {
    if (
      err.message.includes("Artist not found") ||
      err.message.includes("Invalid artist ID") ||
      err.message.includes("must be between") ||
      err.message.includes("No data provided") ||
      err.message.includes("No valid fields")
    ) {
      throw err;
    }
    throw new Error(`Error updating artist: ${err.message}`);
  }
};

// Thay đổi mật khẩu
const changePassword = async (artistId, currentPassword, newPassword) => {
  try {
    // Validate new password
    if (!newPassword || newPassword.length < 6) {
      throw new Error("New password must be at least 6 characters long");
    }

    // Get current password hash
    const artist = await userRepository.getUserForPasswordVerification(
      artistId
    );
    if (!artist) {
      throw new Error("Artist not found");
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      artist.password
    );
    if (!isValidPassword) {
      throw new Error("Current password is incorrect");
    }

    // Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    return await userRepository.changePassword(artistId, hashedNewPassword);
  } catch (err) {
    if (
      err.message.includes("Artist not found") ||
      err.message.includes("password") ||
      err.message.includes("Invalid artist ID")
    ) {
      throw err;
    }
    throw new Error(`Error changing password: ${err.message}`);
  }
};

// Upload avatar
const uploadAvatar = async (artistId, file) => {
  try {
    // Validate file
    if (!file) {
      throw new Error("No file provided");
    }

    // Validate file type
    const allowedMimes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedMimes.includes(file.mimetype)) {
      throw new Error(
        "Invalid file type. Only JPEG, PNG, and WebP are allowed"
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error("File size too large. Maximum size is 5MB");
    }
    const avatarUrl = `/uploads/avatars/${artistId}_${Date.now()}_${
      file.originalname
    }`;

    return await userRepository.updateAvatar(artistId, avatarUrl);
  } catch (err) {
    if (
      err.message.includes("No file") ||
      err.message.includes("Invalid file") ||
      err.message.includes("File size") ||
      err.message.includes("Artist not found") ||
      err.message.includes("Invalid artist ID")
    ) {
      throw err;
    }
    throw new Error(`Error uploading avatar: ${err.message}`);
  }
};

module.exports = {
  // Public functions
  getArtists,
  getFeaturedArtists,
  getArtistById,

  // Protected functions (require authentication)
  getArtistProfile,
  updateArtist,
  changePassword,
  uploadAvatar,
};
