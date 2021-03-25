const express = require("express"),
Keys = require("../../Schemas/key"),
User = require("../../Schemas/user"),
router = express.Router()

router.get("/redeemKey", async (req, res, next) => {
    if(!req.query.key || !req.query.discordID) return res.status(400).send("Bad Request.")
    console.log(req.query)
    let checkKey = await Keys.findOne({key: req.query.key})
    console.log(checkKey)
    if(checkKey == null) return res.status(400).send("Invaild Key.")
    let curUser = await User.findOne({discordID: req.query.discordID});
    if(curUser == null) return res.status(400).send("Invaild Key.");
    let admin = false;
    let dateBought = new Date().getTime();
    if(curUser.plan.admin) admin = true;
    if(checkKey.plan == "yearly") {
        await User.findOneAndUpdate({discordID: req.query.discordID}, {plan: {bought: {yearly: true, monthly: false, weekly: false, lifetime: false}, admin}, dateBought})
    } else if(checkKey.plan == "monthly") {
        await User.findOneAndUpdate({discordID: req.query.discordID}, {plan: {bought: {monthly: true, yearly: false, weekly: false, lifetime: false}, admin}, dateBought})
    } else if(checkKey.plan == "weekly") {
        await User.findOneAndUpdate({discordID: req.query.discordID}, {plan: {bought: {weekly: true, yearly: false, monthly: false, lifetime: false}, admin}, dateBought})
    } else if(checkKey.plan == "lifetime")  {
        await User.findOneAndUpdate({discordID: req.query.discordID}, {plan: {bought: {lifetime: true, yearly: false, monthly: false, weekly: false}, admin}, dateBought})
    } else {
        return res.send("Invaild Key")
    }
    await Keys.findOneAndDelete({key: req.query.key})
    res.send("Success!")
})

router.get("/", (req, res, next) => {
    res.send("Hi!")
})

module.exports = router;