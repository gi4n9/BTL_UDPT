const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    // console.log(token);
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    next();
}

const checkRole = (role) => {
    return (req, res, next) => {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "No token provided" });

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decoded);
            
            req.userId = decoded.userId;
            req.email = decoded.email;
            req.status = decoded.status;
            req.role = decoded.role;

            if (req.role !== role) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            next();
        } catch (error) {
            res.status(401).json({ message: "Invalid token" });
        }
    }
}

module.exports = { auth, checkRole };
