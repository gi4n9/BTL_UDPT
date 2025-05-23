require("dotenv").config();
const { MongoClient } = require("mongodb");

const url = process.env.MONGO_URL;
const dbName = process.env.DB_NAME;

module.exports.connectDB = async function connectDB() {
  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    // Kết nối tới MongoDB
    await client.connect();
    console.log("Kết nối thành công tới MongoDB!");

    // Chọn database
    const db = client.db(dbName);
    return db; // Trả về đối tượng database để sử dụng
  } catch (err) {
    console.error("Lỗi kết nối:", err);
    throw err;
  }
};
