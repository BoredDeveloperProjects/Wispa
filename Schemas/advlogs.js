const mongoose = require("mongoose");


const advanceLogsSchema = new mongoose.Schema({
    ip: String,
    userID: String,
    dateLoggedIn: String,
    key: String,
    beta: Boolean,
    username: String
});

module.exports = new mongoose.model("AdvancedLogs", advanceLogsSchema);
