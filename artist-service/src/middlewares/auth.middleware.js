const jwt = require("jsonwebtoken");
const userService = require("../services/user.service");

// Middleware để decode token và lấy userId, set role
const authenticateToken = async (req, res, next) => {
  try {
    // Lấy token từ header Authorization
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Access token is required" });
    }

    // Decode token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_jwt_secret_key"
    );

    // Lấy userId từ decoded token
    const userId = decoded.id;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token: userId not found" });
    }

    // Kiểm tra user có tồn tại và có phải artist không
    const isArtist = await userService.isArtist(userId);
    if (!isArtist) {
      return res
        .status(403)
        .json({ success: false, message: "User does not have artist role" });
    }

    // Gắn thông tin user vào req
    req.user = {
      id: userId,
      role: "artist",
    };

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ success: false, message: "Token has expired" });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// Middleware kiểm tra admin (comment vì chưa triển khai auth admin)
/*
const isAdmin = async (req, res, next) => {
    try {
        if (!req.user || req.user.role !== 'ROLE_ADMIN') {
            return res.status(403).json({ success: false, message: 'Admin access required' });
        }
        next();
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
*/

module.exports = {
  authenticateToken,
  // isAdmin
};
