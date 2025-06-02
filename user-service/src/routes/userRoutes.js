const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { auth, checkRole } = require("../middlewares/auth");

router.get("/", auth, checkRole("admin"), userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", auth, checkRole("admin"), userController.deleteUser);

module.exports = router;
