const mongoose = require("mongoose");

let altSchema = new mongoose.Schema({
    combo: String,
    service: String,
    used: Number,
    dateAdded: String
})
    
let altUser = mongoose.model("Alts", altSchema);

module.exports = altUser;