const { User } = require("../models/user.models");

class UserController {
    static async getUserById(req, res) {
        try {
            const { id } = req.params;
            const user = await User.findOne({ id: id });
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }


    static async getAllUsers(req, res) {
        try {
            const users = await User.find();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async updateUser(req, res) {
        try {
            const { id } = req.params;
            const { first_name, last_name, email } = req.body;
            const user = await User.findOne({ id: id });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            if (first_name !== undefined) user.first_name = first_name;
            if (last_name !== undefined) user.last_name = last_name;
            if (email !== undefined) user.email = email;

            await user.save();
            return res.status(200).json(user);

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: error.message });
        }
    }
    
    static async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const user = await User.findOne({ id: id });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            await user.deleteOne();
            return res.status(200).json({ 
                success: true,
                message: "User deleted successfully",
                data: user
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = UserController;