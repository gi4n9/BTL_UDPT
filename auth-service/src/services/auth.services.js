const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, getNextSequence } = require("../models/user.models");

const register = async (
  firstName,
  lastName,
  email,
  password,
  confirmPassword
) => {
  console.log(password);
  console.log(confirmPassword);
  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Email already exists");
  }

  const nextId = await getNextSequence();
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    id: nextId,
    first_name: firstName,
    last_name: lastName,
    email,
    password: hashedPassword,
    status: "VERIFY",
  });
  await user.save();
  return {
    message: "User registered successfully",
    user: {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      status: user.status,
    },
  };
};

const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = jwt.sign(
    { userId: user.id, email: user.email, status: user.status, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  return {
    token,
    user: {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      status: user.status,
    },
  };
};

const getUserById = async (userId) => {
  const user = await User.findOne({ id: userId });
  if (!user) throw new Error("User not found");
  return {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    status: user.status,
    profile_image: user.profile_image,
    bio: user.bio,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
};

module.exports = { register, login, getUserById };
