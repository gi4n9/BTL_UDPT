const authService = require("../services/auth.services");

const register = async (req, res) => {
  try {
    const { first_name, last_name, email, password, confirmPassword } =
      req.body;
    console.log(req.body);
    console.log(confirmPassword);
    const user = await authService.register(
      first_name,
      last_name,
      email,
      password,
      confirmPassword
    );
    res.status(201).json(user);
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
  res.status(200).json({ message: "Logout successful" });
};

module.exports = { register, login, logout };
