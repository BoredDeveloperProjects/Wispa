const express = require("express"),
fetch = require("node-fetch"),
router = express.Router(),
AccountType = require("../Schemas/accountTypes"),
GenLimit = require("../Schemas/Generate"),
{randomBytes} = require("crypto")


router.get("/", async (req, res, next) => {
    req.session.csrf = randomBytes(100).toString("hex")
    let pageNumber;
    if(!req.query.pg) {
        pageNumber = 1
    } else {
        if(isNaN(req.query.pg)) pageNumber = 1; else pageNumber = req.query.pg;
        if(req.query.pg < 0) pageNumber = 1;
    }
    if(!req.user) return res.redirect("/api/auth/discord")
    let generators = [];
    let admin = false;
    let pageArray = [], fsadf = 1;
    let generatorsInStock = false
    if(req.user.plan.admin == true) admin = true
    if(req.user.plan.bought.weekly === true || req.user.plan.bought.monthly === true || req.user.plan.bought.yearly === true || req.user.plan.bought.lifetime === true || req.user.plan.admin == true) {
        let GenTypes = await AccountType.find({ });
        if(GenTypes.length > 0) generatorsInStock = true;
        GenTypes.forEach(Gen => {
            let i = {
                type: Gen.ServiceName,
                stock: Gen.Stock,
                paid: Gen.Premium,
                _csrf: req.session.csrf
            }
            generators.push(i)
        })
    } else {
        let GenTypes = await AccountType.find({});
        GenTypes.forEach(Gen => {
            if(Gen.Premium === false){
                let i = {
                    type: Gen.ServiceName,
                    stock: Gen.Stock,
                    paid: Gen.Premium,
                    _csrf: req.session.csrf
                }
                generators.push(i);
            }
        })
        if(generators.length > 0) generatorsInStock = true;
    }
    let use = {
        discordID: req.user.discordID,
        username: req.user.username,
        discriminator: req.user.discriminator,
        admin: admin,
        avatar: req.user.avatar
    }
    while(generators.length > 0) {
        let a = generators.splice(0,6);
        let sfs = {
            page: fsadf,
            details: a
        }
        pageArray.push(sfs);
        fsadf = fsadf+1
    }
    if(pageNumber > pageArray.length) pageNumber = pageArray.length;
    let sendArray = [];
    if(pageNumber > pageArray.length) pageNumber = 0;
    pageArray.forEach(page => {
        if(page.page == pageNumber) {
            sendArray.push(page)
        }
    })
    let pgnn = parseInt(pageNumber)
    let pgnp;
    if(pgnp == 0) pgnp = null; else pgnp = parseInt(pageNumber) - 1;
    if(pgnn >= pageArray.length) pgnn = null; else pgnn = parseInt(pageNumber) + 1;

    let pgn = {
        next: pgnn,
        previous: pgnp
    }
    res.render("generator", {pages: sendArray, pgn, user: use, generatorsInStock})
})

router.post("/", async (req, res, next) => {
    if(!req.query.type || !req.query.csrf) return res.send("Error: Invaild Generator Type");
    let getLastGen = await GenLimit.findOne({userID: req.user.discordID});
    if(getLastGen === null) {
        let GenThing = new GenLimit({
            userID: req.user.discordID,
            LastGen: new Date().getTime()
        })
        await GenThing.save();
        fetch(`http://wispa.xyz/api/generator/getAccount?type=${req.query.type}&discordID=${req.user.discordID}`).then(d => d.text()).then(data => {
            return res.send(data)
        })
    }
    getLastGen = await GenLimit.findOne({userID: req.user.discordID});
    let time = new Date().getTime() - getLastGen.LastGen;
    let curTime = new Date().getTime();
    if(time <= 30000) {
        let result = {
            status: 429,
            reason: "We upped the time to 30 seconds sorry <3"
        }
        return res.status(429).send(result);
    }
    await GenLimit.findOneAndUpdate({userID: req.user.discordID}, {$set: {LastGen: curTime}})
    fetch(`http://wispa.xyz/api/generator/getAccount?type=${req.query.type}&discordID=${req.user.discordID}`).then(d => d.text()).then(data => {
        res.send(data)
    })
})

module.exports = router;