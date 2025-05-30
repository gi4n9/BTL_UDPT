const userService = require("../services/userService");

const createProfile = async (req, res) => {
  try {
    const { userId, fullName, address } = req.body;
    const profile = await userService.createProfile(userId, fullName, address);
    res.status(201).json({ message: "Profile created successfully", profile });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await userService.getProfileByUserId(userId);
    res.status(200).json({ profile });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = { createProfile, getProfile };
