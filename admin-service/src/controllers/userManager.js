const axios = require("axios");

const baseUrl = "http://localhost:3001";
class UserManager {
    static async getAllUsers(req, res) {
        try {
            const response = await axios.get(`${baseUrl}/user`);
            // console.log(response.data);
            res.status(200).json({
                success: true,
                message: "Users fetched successfully",
                data: response.data
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                success: false,
                message: "Users fetched failed",
                error: error.message
            });
        }
    }

    static async updateUserStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const response = await axios.put(`${baseUrl}/user/${id}/status`, { status });
            res.status(200).json({
                success: true,
                message: "User status updated successfully",
                data: response.data
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                success: false,
                message: "User status updated failed",
            });
        }
    }
}

module.exports = UserManager;
