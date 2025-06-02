const userService = require("../services/userService");
const axios = require("axios");

class UserController {

  static async getAllUsers(req, res) {
    try{
      const response = await axios.get("http://localhost:3001/user/");
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getUserById(req, res) {
    try{
      const response = await axios.get(`http://localhost:3001/user/${req.params.id}`);
      res.status(200).json({
        success: true,
        message: "User fetched successfully",
        data: response.data
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateUser(req, res) {
    try{
      const response = await axios.put(`http://localhost:3001/user/${req.params.id}`, req.body);
      res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: response.data
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async deleteUser(req, res) {
    try{
      const response = await axios.delete(`http://localhost:3001/user/${req.params.id}`);
      res.status(200).json(
        response.data
      );
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

}


module.exports = UserController;
