const db = require("../../config/db");
module.exports.getAll = async () => {};
module.exports.getOne = async (id) => {
  return await db("user").where("id", id).first();
};
module.exports.createOne = async (email, password) => {
  return await db("user").insert({
    email: email,
    password: password,
  });
};
