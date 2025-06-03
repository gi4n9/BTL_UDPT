const jwt = require("jsonwebtoken");

// Middleware để decode token và lấy userId, set role
const authenticateToken = async (req, res, next) => {
  try {
    // Lấy token từ header Authorization
    const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Access token is required" });
    }

    // Decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    const userId = decoded.userId;
    console.log(userId);

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token: userId not found" });
    }

    // Kiểm tra user có tồn tại và có phải artist không
    if (decoded.role !== "artist") {
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

module.exports = {
  authenticateToken,
};
