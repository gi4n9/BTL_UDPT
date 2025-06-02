const authService = require("../services/auth.services");

const register = async (req, res) => {
  console.log("Received req.body:", req.body);
  try {
    const { first_name, last_name, email, password, confirmPassword } =
      req.body;
    const user = await authService.register(
      first_name,
      last_name,
      email,
      password,
      confirmPassword
    );
    console.log("confirm password:", confirmPassword);
    res.status(201).json(user);
  } catch (error) {
    console.log("Error in register:", error.message);
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await authService.login(email, password);
    res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

const logout = (req, res) => {
  res.status(200).json({ message: "Logout successful" });
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await authService.getUserById(userId);
    res.status(200).json(user);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

module.exports = { register, login, logout, getUserProfile };
