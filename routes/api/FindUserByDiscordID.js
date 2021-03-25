const express = require("express"),
router = express.Router(),
User = require("../../Schemas/user");

router.get("/", (req, res, next) => {
    let query = req.query;
    if(!query.discordid) return res.send("{\"status\": 400, \"body\": \"Invaild args\"}")
    User.findOne({discordID: query.discordid}, (err, user) => {
        if(user === null) {
            return res.status(400).send("{\"status\": 400, \"body\": \"No user found\"}");
        }
        let sendRes = {
            status: 200,
            discordID: user.discordID,
            username: user.username,
            discriminator: user.discriminator,
            avatar: user.avatar,
            plan: user.plan,
            genedAlts: user.genedAlts,
            genedAltsToday: user.genedAltsToday
        }
        res.send(sendRes);
    })
})


module.exports = router;