const mongoose = require("mongoose");

let accountTypes = new mongoose.Schema({
    ServiceName: String,
    Stock: Number,
    Premium: Boolean,
    placeHolder: String
})
    
let accountTypesModel = mongoose.model("AccountTypes", accountTypes);

module.exports = accountTypesModel;