const mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
    discordID: String,
    username: String,
    discriminator: String,
    avatar: String,
    plan: {
        bought: {
            weekly: Boolean,
            monthly: Boolean,
            yearly: Boolean,
            lifetime: Boolean,
        },
        admin: Boolean
    },
    dateBought: Number,
    genedAlts: Array,
    genedAltsToday: Number
})
    
let UserModel = mongoose.model("Users", userSchema);
 
module.exports = UserModel;