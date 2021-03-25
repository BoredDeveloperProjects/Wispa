const express = require("express"),
router = express.Router(),
AccountTypesMongo = require("../Schemas/accountTypes"),
Alt = require("../Schemas/alt"),
Stats = require("../Schemas/stats"),
lookup = require("./admin/lookup"),
userActions = require("./admin/userActions")

router.get("/", async (req, res, next) => {
    if(!req.user) return res.status(404).render("error", {err: {message: "Not Found"}, status: 404});
    if(req.user.plan.admin === false) return res.status(404).render("error", {err: {message: "Not Found"}, status: 404});
    let getAccountTypes = await AccountTypesMongo.find({ }) 
    const AccountTypesInDb = [];
    getAccountTypes.forEach(ele => {
        let name = ele.ServiceName
        let stock = ele.Stock
        let i = {
            name,
            stock
        }
        AccountTypesInDb.push(i);
    })
    let q = req.query
    let u = {
          discordID: req.user.discordID,
          username: req.user.username,
          discriminator: req.user.discriminator,
          admin: req.user.plan.admin,
          avatar: req.user.avatar
    }
    let messages = {};
    if(q.addedAccountTyped == "false") {
        messages.addAccountType = false
        messages.hasMessage = true;
        messages.error = "Service Already Exists"
    } else if(q.addedAccountTyped == "true") {
        messages.addAccountType = true
        messages.hasMessage = true;
    } else if(q.KickedUser == 'true') {
        messages.KickedUser = true
        messages.hasMessage = true;
    } else if(q.addedAccounts == 'true') {
        messages.addAccounts = true
        messages.hasMessage = true;
    } else {
        messages.hasMessage = null;
    }
    let lookedUp;
    if(req.query.userlookup === 'true') lookedUp = true; else lookedUp = false;
    const userLookup = {lookedUp, data: []};
    if(req.query.userlookup === 'true') {
        let userResponse = JSON.parse(req.query.body)
        let plan;
        if(userResponse.plan.admin == true) plan = "Admin"; else if(userResponse.plan.bought.weekly == true) plan = "Weekly"; else if(userResponse.plan.bought.monthly == true) plan = "Monthly"; else if(userResponse.plan.bought.yearly == true) plan = "Yearly"; else if(userResponse.plan.bought.lifetime == true) plan = "Lifetime"; else plan = "Free";
        let send = {
            plan,
            discordID: userResponse.discordID,
            usernameAndDiscrim: userResponse.username + "#" + userResponse.discriminator,
            username: userResponse.username,
            avatar: userResponse.avatar,
            genedToday: userResponse.genedAltsToday
        }
        userLookup.data.push(send)
    }
    res.render("admin2", {user: u, AccountTypes: AccountTypesInDb, messages: messages, userLookup: userLookup})
});

router.post("/AddAccounts", async (req, res, next) => {
    if(!req.user) return res.status(404).render("error", {err: {message: "Not Found"}, status: 404});
    if(req.user.admin === false) return res.status(404).render("error", {err: {message: "Not Found"}, status: 404});
    if(!req.body.accounts || !req.body.AccountType) return res.status(400).render("error", {err: {message: "Not enough args"}, status: 400});
    let accounts = req.body.accounts.split("\r\n")
    let pre = req.body.AccountType.split(" ")
    let stock = pre.pop();
    pre.length = pre.length - 1
    const accountType = pre.join(" ");
    let findAccType = await AccountTypesMongo.findOne({ServiceName: accountType});
    let accountTypesUpdate = await AccountTypesMongo.findOneAndUpdate({ServiceName: accountType}, {Stock: Number(accounts.length) + Number(findAccType.Stock)})
    const s = await Stats.find({});
    if(s.length === 0) {
        let as = new Stats({
            UserWhoRestocked: req.user.username,
            AltsRestocked: accounts.length,
            LastRestock: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
            LastServiceRestocked: accountType
        })
        await as.save();
    } else {
        let sa = await Stats.findByIdAndDelete(s[0]._id)
        const as = new Stats({
            UserWhoRestocked: req.user.username,
            AltsRestocked: accounts.length,
            LastRestock: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
            LastServiceRestocked: accountType
        })
        await as.save();
    }
    accounts.forEach(async acc => {
        let check = await Alt.find({combo: acc, service: accountType})
        if(check.length == 0) {
            let nAlt = new Alt({
                combo: acc,
                service: accountType,
                used: 0,
                dateAdded: (new Date).getTime()
            })
            await nAlt.save();
        }
    })
    res.redirect("/admin?addedAccounts=true")
});

router.post("/addAccountType", async (req, res, next) => {
    if(!req.user) return res.status(404).render("error", {err: {message: "Not Found"}, status: 404});
    if(req.user.admin === false) return res.status(404).render("error", {err: {message: "Not Found"}, status: 404});
    if (!req.body.service) return res.status(400).render("error", { err: { message: "Not enough args" }, status: 400 });
    let prem = false;
    if(req.body.paid && req.body.paid == 'true') prem = true
    let check = await AccountTypesMongo.find({ServiceName: req.body.service})
    if(check.length == 0){
        let newAccountType = new AccountTypesMongo({
            ServiceName: req.body.service,
            Stock: 0,
            Premium: prem
        })
        await newAccountType.save();
        return res.redirect("/admin?addedAccountTyped=true");
    } else {
        return res.redirect("/admin?addedAccountTyped=false&reason=ServiceAlreadyExists");
    }
});

router.use("/lookup", lookup)
router.use("/user", userActions)

module.exports = router;