const mongoose = require("mongoose");

let statsSchema = new mongoose.Schema({
    UserWhoRestocked: String,
    AltsRestocked: Number,
    LastRestock: String,
    LastServiceRestocked: String
})
    
let statsThing = mongoose.model("Stats", statsSchema);
 
module.exports = statsThing;