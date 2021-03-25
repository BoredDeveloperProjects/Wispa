const router = require("express").Router(),
Users = require("../../Schemas/user"),
Kick = require("../../Schemas/kick"),
kick = require("./kick"),
ban = require("./ban"),
Ban = require("../../Schemas/ban"),
genLogs = require("./genLogs")

router.use("/ban", ban)
router.use("/kick", kick)
router.use("/genLogs", genLogs)

router.get("/lookup/:userid", async (req, res, next) => {
    if(!req.user) return res.status(404).render("error", {err: {message: "Not Found"}, status: 404});
    if(req.user.admin === false) return res.status(404).render("error", {err: {message: "Not Found"}, status: 404});
    if(req.params.userid === undefined) return res.send(400).render("error", {err: {message: "Not enough args"}, status: 400})
    let discordID = req.params.userid;
    let user = await Users.findOne({discordID})
    let use = {
        discordID: req.user.discordID,
        username: req.user.username,
        discriminator: req.user.discriminator,
        avatar: req.user.avatar,
        admin: true,
        genedAltsToday: req.user.genedAltsToday
    }
    let plan;
    let dateBought;
    if(user.plan.admin == true) plan = "Admin"; else if(user.plan.bought.weekly == true) plan = "Weekly"; else if(user.plan.bought.monthly === true) plan = "Monthly"; else if(user.plan.bought.yearly == true) plan = "Yearly"; else if(user.plan.bought.lifetime == true) plan = "Lifetime"; else plan = "Free";
    if(plan !== "Free") {
        dateBought  = new Date(user.dateBought)
    } else {
        dateBought = "Not Bought."
    }
    let Avaplans = ['Free', 'Weekly', 'Monthly', 'Yearly', 'Lifetime', 'Admin']
    let plans = [];
    Avaplans.forEach(plas => {
        if(plas != plan) {
            plans.push({plan: plas})
        }
    })
    let CheckKICK = await Kick.findOne({UserID: user.discordID})
    let Kicked;
    if(CheckKICK !== null) Kicked = "True"; else Kicked = "False";
    let CheckBan = await Ban.findOne({UserID: user.discordID})
    let banned;
    if(CheckBan !== null) banned = "True"; else banned = "False";
    let lookedUpUser = {
        discordID: user.discordID,
        username: user.username,
        discriminator: user.discriminator,
        avatar: user.avatar,
        dateBought,
        genedAltsToday: user.genedAltsToday,
        plan,
        kicked: Kicked,
        banned
    }
    let alert = {
        alert: false,
        message: ""
    }
    if(req.query.updateWorked == 'true') alert.alert = true; alert.message = "Updated the user's roles!"
    res.render("LookUpUser", {user: use, lookedUpUser, plans, alert})
})

router.post("/lookup/:userid", async (req, res) => {
    if(!req.user) return res.status(404).render("error", {err: {message: "Not Found"}, status: 404});
    if(req.user.admin === false) return res.status(404).render("error", {err: {message: "Not Found"}, status: 404});
    if(req.params.userid === undefined || req.body.plan === undefined) return res.send(400).render("error", {err: {message: "Not enough args"}, status: 400})
    let discordID = req.params.userid
    let plan = req.body.plan
    let plans = {
        bought: {
        weekly: false,
        monthly: false,
        yearly: false,
        lifetime: false
        },
        admin: false
    }
    let dateBought;
    if(plan === "Free") dateBought = 0; else dateBought = new Date().getTime();
    if(plan === "Admin") plans.admin = true; else if(plan === "Weekly") plans.bought.weekly = true; else if(plan === "Monthly") plans.bought.monthly = true; else if(plan === "Yearly") plans.bought.yearly = true; else if(plan === "Lifetime") plans.bought.lifetime = true;
    await Users.findOneAndUpdate({discordID}, {$set: {plan: plans, dateBought}})
    res.redirect(`/admin/user/lookup/${discordID}?updateWorked=true`)
})

module.exports = router