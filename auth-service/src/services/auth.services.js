const db = require("../../config/db");
const bcrypt = require("bcryptjs");
const userService = require("./user.services");
const jwt = require("jsonwebtoken");

module.exports.register = async function (email, password) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  return await userService.createOne(email, hash);
};

module.exports.signIn = async function (email, password) {
  console.log("Hello world !!!!");
  let result = await db("user").select("*").where("email", email);

  if (result.length === 0) {
    return {
      message: `User with email: ${email} not existed`,
    };
  } else {
    let [user] = result;
    let comparedResult = await bcrypt.compare(password, user.password);
    if (comparedResult) {
      let token = jwt.sign(
        { user_id: user.id, role: user.role },
        process.env.TOKEN_SECRET,
        { expiresIn: 1 * 60 }
      );
      return token;
    } else {
      return {
        message: `Password is incorrect`,
      };
    }
  }
};
