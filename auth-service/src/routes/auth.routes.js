const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controllers");
const { validateBody } = require("../middlewares/auth.middlewares");

router.post("/register", validateBody, authController.register);
router.post("/sign-in", authController.signIn);

module.exports = router;
