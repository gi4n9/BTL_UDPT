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
    user: { id: user.id, email: user.email, status: user.status },
  };
};

const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = jwt.sign(
    { userId: user.id, email: user.email, status: user.status },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  return {
    token,
    user: { id: user.id, email: user.email, status: user.status },
  };
};

module.exports = { register, login };
