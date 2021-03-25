const express = require("express"),
router = express.Router()
const { names } = require("debug");
let api = require("./api/index"),
gen = require("./generator"),
Alts = require("../Schemas/alt"),
admin = require("./admin"),
me = require("./me"),
purchase = require("./buy"),
Users = require("../Schemas/user"),
redeem = require("./redeem"),
discord = require("./discord"),
bans = require("../Schemas/ban"),
Stats = require("../Schemas/stats"),
{randomBytes} = require("crypto");


router.use("/admin", admin)
router.use("/discord", discord);
router.use("/generator", gen)
router.use("/api", api)
router.use("/me", me)
router.use("/buy", purchase)
router.use("/redeem", redeem)
router.get("/", async (req, res, next) => {
    let punishments = {
        banned: {
            banned: false,
            length: 0,
            reason: ""
        }
    }
    let user = false;
    if (req.user) user = true;
    if(req.query.banned == "true") {
        punishments.banned.banned = true;
        punishments.banned.length = req.query.length;
        punishments.banned.reason = req.query.reason;

    }
    if(req.session.csrf === undefined) {
        req.session.csrf = randomBytes(100).toString('base64');
    }
    if(punishments.banned.banned != true) {
        if(req.user) {
            return res.redirect("/dashboard")
        }
    }
    res.render("index", {user})
})
router.get('/dashboard', async (req, res, next) => {
    if(!req.user) return res.redirect("/api/auth/discord")
    let s = await Stats.find({})
    let asd = s[0];
    let a = {}
    if(asd !== undefined) {
        a = {
            UWR: asd.UserWhoRestocked,
            AR: asd.AltsRestocked,
            LS: asd.LastRestock,
            LSR: asd.LastServiceRestocked
        }
    }
    if(a.UWR === undefined) a = undefined;
    let Bans = await bans.findOne({UserID: req.user.discordID}); 
    if(Bans !== null) {
            let len, reason = "No reason given.";
            if(Bans.length.permanent == true) len="Permanent"; else len = new Date(Bans.length.length)
            res.redirect(`./?banned=true&length=${len}&reason=${Bans.Reason.data}`)
    }
    let i = await Alts.find({ })
    let users = await Users.find({ })
    let altsGenedToday = 0;
    users.forEach(u => {
        altsGenedToday = altsGenedToday + u.genedAltsToday
    })
    let totalAlts = i.length
    let alts = {
        total: totalAlts,
        AltsToday: altsGenedToday
    }
    let admin = false;
    if(req.user.plan.admin == true) admin = true
    let use = {
        discordID: req.user.discordID,
        username: req.user.username,
        discriminator: req.user.discriminator,
        avatar: req.user.avatar,
        admin: admin,
        plan: req.user.plan,
        AltsToday: req.user.genedAltsToday
    }
    res.render("test", {user: use, alts: alts, stats: a})
})
router.get("/logout", (req, res, next) => {
    req.logout();
    res.redirect("/");
})

module.exports = router;