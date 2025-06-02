const express = require("express");
const router = express.Router();
const userManager = require("../controllers/userManager");
const { auth, checkRole} = require("../middlewares/auth");

router.get("/user", auth, checkRole("admin"), userManager.getAllUsers);
router.put("/user/:id/status", auth, checkRole("admin"), userManager.updateUserStatus);

module.exports = router;
