let mongoose = require("mongoose");

let banSchema = new mongoose.Schema({
    UserID: String,
    Reason: {
        data: String,
        set: Boolean
    },
    Date: Number,
    length: {
        permanent: Boolean,
        length: Number
    }    
})

let banModel = mongoose.model("Bans", banSchema)

module.exports = banModel