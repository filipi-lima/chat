const connectDB = require("./config/connect.js");
const User = require("./models/User.js");

const db = {
    connectDB,
    User,
};

module.exports = db
