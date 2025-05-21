const authService = require("../services/auth.services");

module.exports.register = async function (req, res) {
  let { email, password } = req.body;
  try {
    let [id] = await authService.register(email, password);
    res.json({
      created_user_id: id,
      message: "Register successfully",
    });
  } catch (error) {
    res.json({
      message: "Error occurred on server",
      error,
    });
  }
};

module.exports.signIn = async function (req, res) {
  let { email, password } = req.body;
  try {
    let result = await authService.signIn(email, password);
    res.json({
      accessToken: result,
    });
  } catch (error) {
    res.json(error);
  }
};
