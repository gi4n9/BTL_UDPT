const authService = require("../services/auth.services");

const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const user = await authService.register(
      username,
      email,
      password,
      role || "user"
    );
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
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
  // Since we're using JWT, logout is typically handled client-side by deleting the token
  res.status(200).json({ message: "Logout successful" });
};

module.exports = { register, login, logout };
