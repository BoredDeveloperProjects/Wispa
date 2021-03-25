const express = require("express"),
router = express.Router(),
fetch = require("node-fetch"),
ratelimit = require("../Schemas/ratelimit"),
{randomBytes} = require("crypto")


router.get("/", async (req, res, next) => {
    if(!req.user) return res.redirect("/api/auth/discord")
    req.session.csrf = randomBytes(100).toString("hex");
    if(await addtoRateLimit(req) == "ratelimited") return res.redirect("https://www.fbi.gov/")
    let u = {
        id: req.user.discordID,
        avatar: req.user.avatar,
        csrf: req.session.csrf
    }
    res.render("redeem", {user:u})
})

router.post("/", async (req, res, next) => {
    if(!req.query.key || !req.query.csrf) return res.send("Error: Invaild Key.");
    fetch(`https://wispa.xyz/api/buy/redeemKey?discordID=${req.query.id}&key=${req.query.key}`).then(r => r.text()).then(data => {
        res.send(data);
    })
})

async function addtoRateLimit(req) {
    const ips = req.headers['x-forwarded-for'];
    let fsadf = ips.split(",");
    let ip = fsadf[0];
    let check = await ratelimit.findOne({ip});
    if(check === null) {
        let newRateLimit = new ratelimit({
            ip,
            requests: 1,
            ratelimited: false
        })
        await newRateLimit.save();
    }
    check = await ratelimit.findOne({ip});
    if(check.requests >= 30) {
        await ratelimit.findOneAndUpdate({ip}, {requests: 120, ratelimited: true})
        return "ratelimited"
    }
    let s = check.requests + 1;
    await ratelimit.findOneAndUpdate({ip}, {requests: s});
    return "not ratelimited";
}

module.exports = router;