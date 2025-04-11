const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://moshatmedhashree15:shreePorbe21@learningnode.xjrw4lu.mongodb.net/devTinder"
  );
};

module.exports = connectDB;