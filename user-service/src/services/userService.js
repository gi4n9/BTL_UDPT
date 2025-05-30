const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  address: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Profile = mongoose.model("Profile", profileSchema);

const createProfile = async (userId, fullName, address) => {
  const profile = new Profile({ userId, fullName, address });
  await profile.save();
  return profile;
};

const getProfileByUserId = async (userId) => {
  const profile = await Profile.findOne({ userId });
  if (!profile) throw new Error("Profile not found");
  return profile;
};

module.exports = { createProfile, getProfileByUserId };
