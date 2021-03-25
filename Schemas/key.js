
const { MongoStore } = require("connect-mongo");
let mongoose = require("mongoose");

let keySchema = new mongoose.Schema({
    key: String,
    plan: String
})

let keyModel = mongoose.model("keys", keySchema)

module.exports = keyModel