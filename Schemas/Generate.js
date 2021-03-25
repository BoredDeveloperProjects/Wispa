const mongoose = require("mongoose");

let statsSchema = new mongoose.Schema({
    userID: Number,
    LastGen: Number
})
    
let statsThing = mongoose.model("limit", statsSchema);
 
module.exports = statsThing;