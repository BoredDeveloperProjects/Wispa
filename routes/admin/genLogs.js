const router = require("express").Router();
const Users = require("../../Schemas/user")

router.get("/:userID", async (req, res) => {
    if(!req.user) return res.status(404).render({error: {message: "Not Found"}, status: 404});
    if(req.user.plan.admin === false) return res.status(404).render("error", {err: {message: "Not Found"}, status: 404});
    if(!req.params.userID) return res.status(400).render("error", {err: {message: "Bad request"}, status: 400})
    const user = await Users.findOne({"discordID": req.params.userID})
    if(user === null) return res.status(400).render("error", {err: {message: "No user found"}, status: 400})
    let usersend = {
        ID: user.discordID,
        name: user.username,
        admin: user.plan.admin
    }
    if(user.dateBought > 0) {
        usersend.dateBought = new Date(user.dateBought)
    } else {
        usersend.dateBought ="Unknown"
    }
    let accs = []
    user.genedAlts.forEach(acc => {
        let d = new Date(acc.date).toLocaleString()
        let s = acc.service;
        let c = acc.combo
        let b = {
            date: d,
            service: s,
            combo: c
        }
        accs.push(b)
    })
    res.render("genlogs", {accs: accs, user: usersend})
})

module.exports = router