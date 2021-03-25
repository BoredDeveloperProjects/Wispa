const express = require("express"),
router = express.Router(),
users = require("../../Schemas/user"),
Alt = require("../../Schemas/alt")

router.post("/id", async (req, res) => {
    if(!req.user) return res.status(404).render({error: {message: "Not Found"}, status: 404});
    if(req.user.plan.admin === false) return res.status(404).render("error", {err: {message: "Not Found"}, status: 404});
    let uid = req.body.userId;
    if(uid === undefined) return res.send({error: {message: "Bad request"}, status: 400})
    let FindUserID = await users.findOne({discordID: uid})
    if(FindUserID === null) return res.send({error: {message: "No account found"}, status: 400})
    let s = {
        plan: FindUserID.plan,
        discordID: FindUserID.discordID,
        username: FindUserID.username,
        discriminator: FindUserID.discriminator,
        avatar: FindUserID.avatar,
        datebought: FindUserID.datebought,
        genedAltsToday: FindUserID.genedAltsToday,
        status: 200
    }
    let r = JSON.stringify(s);
    console.log(r);
    res.redirect(`/admin?userlookup=true&body=${r}`);
})

module.exports = router