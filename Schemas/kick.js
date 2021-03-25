let mongoose = require("mongoose");

let kickSchema = new mongoose.Schema({
    UserID: String,
    Reason: String,
    Date: Number
})

let kickModel = mongoose.model("Kick", kickSchema)

module.exports = kickModel