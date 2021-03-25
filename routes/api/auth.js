const express = require("express"),
passport = require("passport"),
        router = express.Router(),
moment = require("moment-timezone"),
        base32 = require("base32"),
crypto = require("crypto-js"),
advLogs = require("../../Schemas/advlogs");

router.get("/discord", passport.authenticate('discord'));

router.get("/discord/callback", passport.authenticate('discord'), async (req, res, next) => {
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        console.log(req.query);
        if (ip) {
                var d = new Date();
                var Timezone = "America/Detroit";
                var myFormat = "YYYY-MM-DD hh:mm:ss a z";
                var Data = moment(d).tz(Timezone).format(myFormat);
                const key = Buffer.from(Buffer.from(ip.toString() + "UNAME" + req.user.username).toString("hex")).toString("base64");
                const encrypted = crypto.AES.encrypt(ip.toString(), key);
                const newAdvLogs = new advLogs({
                        ip: encrypted,
                        userID: req.user.discordID,
                        dateLoggedIn: Data,
                        key,
                        beta: false,
                        username: req.user.username
                });
                await newAdvLogs.save();
        }
        return res.redirect("/dashboard");
});


module.exports = router;