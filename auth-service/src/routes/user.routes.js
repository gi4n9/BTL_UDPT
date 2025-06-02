const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controllers");

router.get("/:id", userController.getUserById);
router.get("/", userController.getAllUsers);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.put("/:id/status", userController.updateStatus);

module.exports = router;