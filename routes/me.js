const express = require("express"),
Users = require("../Schemas/user"),
router = express.Router();

router.get("/", (req, res, next) => {
    if(!req.user) return res.redirect("/api/auth/discord")
    let alert;
    if(req.query.clearedAltList && req.query.clearedAltList == 'true') {
        alert = {
            message: "Cleared Alt History!",
            error: false
        }
    }
    let plan;
    let admin = false;
    let maxAlts = 0;
    let pageNumber;
    if(!req.query.pg) {
        pageNumber = 1
    } else {
        if(isNaN(req.query.pg)) pageNumber = 1; else pageNumber = req.query.pg;
    }
    if(req.user.plan.admin == true) admin = true
    if(req.user.plan.bought.weekly == true) {
        plan = "Weekly" 
        maxAlts = 200;
    } else if(req.user.plan.bought.monthly == true) {
        plan = "Monthly";
        maxAlts = 400
    } else if(req.user.plan.bought.yearly == true) {
        plan = "Yearly";
        maxAlts = 600
    } else if(req.user.plan.admin == true) {
        plan = "Admin";
        maxAlts = "Unlimited"
    } else if(req.user.plan.bought.lifetime == true) {
        plan = "Lifetime";
        maxAlts = 2000
    } else {
        plan="Free";
        maxAlts = 10;
    }
    let pages = [];
    let accounts = [];
    let alreadyGeneratedAccounts = req.user.genedAlts;
    alreadyGeneratedAccounts.forEach(acc => {
        let adsf = {
            combo: acc.combo,
            service: acc.service
        }
        if(acc.date && acc.date > 0) {
            adsf.date = new Date(acc.date).toLocaleString()
        } else {
            adsf.date = "Invaild Date."
        }
        accounts.push(adsf)
    })
    let sendArray = [], pgsndfs = 1;
    while(accounts.length > 0) {
        let a = accounts.splice(0,10);
        let sfsf = {
            page: pgsndfs,
            details: a
        }
        pages.push(sfsf);
        pgsndfs = pgsndfs +1;
    }
    if(pageNumber > pages.length) pageNumber = 0;
    pages.forEach(page => {
        if(page.page == pageNumber) {
            sendArray.push(page)
        }
    })
    let pgnn = parseInt(pageNumber), pgnp;
    if(pgnp == 0) pgnp = null; else pgnp = parseInt(pageNumber) - 1;
    if(pgnn >= pages.length) pgnn = null; else pgnn = parseInt(pageNumber) + 1;
    let pgn = {
        next: pgnn,
        previous: pgnp
    }
    let didGenAlts = false;
    if(req.user.genedAlts.length > 0) didGenAlts = true;
    let use = {
        discordID: req.user.discordID,
        username: req.user.username,
        discriminator: req.user.discriminator,
        avatar: req.user.avatar,
        plan: plan,
        admin: admin,
        pages: sendArray,
        didGenAlts,
        genedAltsToday: req.user.genedAltsToday,
        maxAlts
    }
    res.render("me", {user: use, pgn, alert})
})

router.get("/clearAltHistory", async (req, res, next) => {
    if(!req.user) res.redirect("/api/auth")
    if(req.query.confirmed && req.query.confirmed == true) {
        await Users.findOneAndUpdate({"discordID": req.user.discordID}, {$set: {"genedAlts": []}})
        res.redirect("/me?clearedAltList=true");
    }
})

module.exports = router;