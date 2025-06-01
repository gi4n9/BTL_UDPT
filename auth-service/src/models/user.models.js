const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  first_name: { type: String, required: true, maxlength: 100 },
  last_name: { type: String, required: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, maxlength: 255 },
  password: { type: String, required: true, maxlength: 255 },
  profile_image: { type: String, maxlength: 255 },
  bio: { type: String },
  status: {
    type: String,
    enum: ["VERIFY", "ACTIVE", "BLOCKED"],
    default: "VERIFY",
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

userSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

const User = mongoose.model("User", userSchema);

let lastId = 0;

const getNextSequence = async () => {
  const lastUser = await User.findOne().sort({ id: -1 });
  if (lastUser) {
    lastId = lastUser.id;
  }
  return ++lastId;
};

module.exports = { User, getNextSequence };
