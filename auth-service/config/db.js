const knex = require("knex");
const config = require("./knex-file");

let db = knex(config.development);

module.exports = db;
