const mongoose = require("mongoose");

let ratelimitSchema = new mongoose.Schema({
    ip: String,
    requests: Number,
    ratelimited: Boolean
})
    
let ratelimit = mongoose.model("ratelimit", ratelimitSchema);
 
module.exports = ratelimit;