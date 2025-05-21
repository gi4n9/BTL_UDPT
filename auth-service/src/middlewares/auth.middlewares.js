const { registerBody } = require("../../config/validate-schema");
const jwt = require("jsonwebtoken");

module.exports.validateBody = function (req, res, next) {
  // email, pass
  let { email, password } = req.body;

  let { error } = registerBody.validate({ email, password });
  if (error) {
    res.json(error);
  } else {
    next();
  }
};
