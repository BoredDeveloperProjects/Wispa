const express = require("express"),
router = express.Router(),
User = require("../../Schemas/user");

router.get("/", (req, res, next) => {
    let query = req.query;
    if(!query.discordid || !query.username || !query.discriminator || !query.avatar || !query.admin || !query.weekly || !query.monthly || !query.yearly || !query.lifetime) return res.send("{\"status\": 400, \"body\": \"Invaild args\"}");
    User.findOne({discordID: query.discordid}, async (err, user) => {
        if(err) {
            return console.log(err);
        } 
        let weekly = false, monthly = false, yearly = false, lifetime = false
        if(query.weekly === "true") {
            weekly = true
        } else if(query.monthly === "true"){
            monthly = true
        } else if(query.yearly === "true") {
            yearly = true
        } else if(query.lifetime === "true") {
            lifetime = true
        }
       if(user === null) {
           let newUser = new User({
            discordID: `${query.discordid}`,
            username: `${query.username}`,
            discriminator: `${query.discriminator}`,
            avatar: `${query.avatar}`,
            plan: {
                bought: {
                    weekly: weekly,
                    monthly: monthly,
                    yearly: yearly,
                    lifetime: lifetime,
                    dateBought: (new Date).getTime()
                },
                admin: `${query.admin}`
            },
            genedAlts: [],
            genedAltsToday: 0
           })
           let user = newUser;
           await newUser.save();
           let UserSend = {
                status: 200,
                discordID: user.discordID,
                username: user.username,
                discriminator: user.discriminator,
                avatar: user.avatar,
                plan: user.plan,
                genedAlts: user.genedAlts,
                genedAltsToday: user.genedAltsToday
        }
        return res.send(UserSend);
       }
      let UserSend = {
        status: 200,
        discordID: user.discordID,
        username: user.username,
        discriminator: user.discriminator,
        avatar: user.avatar,
        plan: user.plan,
        genedAlts: user.genedAlts,
        genedAltsToday: user.genedAltsToday
      } 
      res.send(UserSend)
    })
})


module.exports = router;