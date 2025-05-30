const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/profile", userController.createProfile);
router.get("/profile/:userId", userController.getProfile);

module.exports = router;
