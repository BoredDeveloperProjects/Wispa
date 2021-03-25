const passport = require("passport"),
Discord = require("passport-discord"),
fetch = require("node-fetch"),
User = require("../Schemas/user")

passport.serializeUser((user, done) => {
    done(null, user.discordID);
});

passport.deserializeUser(async (id, done) => {
    User.findOne({discordID: id}, (err, user) => {
        if(err) {
            return done(err, null)
        }
        done(null, user);
    })
})  
passport.use(new Discord({
    clientID: process.env.MAXS_DISCORD_CLIENT_ID,
    clientSecret: process.env.MAXS_DISCORD_CLIENT_SECRET,
    callbackURL: process.env.DISCORD_CLIENT_CALLBACK,
    scope: ['identify']
}, async (accessToken, refreshToken, profile, done) => {
    let { username, discriminator, avatar, id} = profile;
    User.findOne({discordID: id}, async (err, user) => {
        if(err) {
            return console.log(err);
        }
        let weekly = false, monthly = false, yearly = false, lifetime = false
        if(user === null) {
            let newUser = new User({
             discordID: id,
             username: username,
             discriminator: discriminator,
             avatar: avatar,
             plan: {
                 bought: {
                     weekly: weekly,
                     monthly: monthly,
                     yearly: yearly,
                     lifetime: lifetime,
                 },
                 admin: false
             },
             dateBought: 0,
             genedAlts: [],
             genedAltsToday: 0
            })
            let d = newUser;
            await newUser.save();
            done(null, d)
        }
        done(null, user);
    })
}));