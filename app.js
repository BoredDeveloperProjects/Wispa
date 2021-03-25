require("dotenv").config();
require("./strategies/discord");
const express = require('express');
const exphbs = require('express-handlebars');
var createError = require('http-errors');
const bodyParser = require("body-parser");
var CronJob = require('cron').CronJob;
const csrf = require("csurf");
const app = express();
const indexRouter = require("./routes/index")
const passport = require("passport");
const mongoose = require("mongoose");
const session = require("express-session");
const SessionStore = require("connect-mongo")(session);

let connect = mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false},  (err) => {
    if(err) {
        console.log(err.message);
    } else {
        console.log("Connected to MongoDB!")
    }
})

app.use(bodyParser.urlencoded({ extended: false }))
app.set('trust proxy', true)

// Register Handlebars view engine
app.engine('hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
// Use Handlebars view engine
app.set('view engine', 'hbs');
    
app.use(express.static("public"))

app.use(express.urlencoded({ extended: true }))

app.use(session({
  name: ".WISPA_SESSION",
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000*60*60*24,
    sameSite: 'lax'
  },
  store: new SessionStore({mongooseConnection: mongoose.connection})
}))
app.use( passport.initialize() );
app.use( passport.session() );

app.use('/', indexRouter)

app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
      res.status(err.status || 500);
    res.render('error', { err, status: err.status});
});

const Job1 = new CronJob("00 00 00 * * *", function() {
  const User = require("./Schemas/user")
  User.updateMany({}, {genedAltsToday: 0 }, (err, raw) => {
    if(err) {
        console.log(er)
    }
})
User.find({ }).then(async USERS => { 
    let i = 1;
    await USERS.forEach(async user => {
        console.log(`Checking User number: ${i}`);
        let planLength;
        let curDate = new Date().getTime();
            if(user.dateBought) {
            if(user.dateBought > 0) {
                if(user.plan.bought.weekly) planLength = 60000*60*24*7; else if(user.plan.bought.monthly) planLength = 60000*60*24*7*4; else if(user.plan.bought.yearly)planLength = 60000*60*24*7*4*12; else planLength = 0;
                if(planLength > 0) {
                    let planTime = user.dateBought + planLength;
                    let admin = user.plan.admin;
                    if(planTime <= curDate) {
                        await User.findOneAndUpdate({discordID: user.discordID}, {plan: {bought: {lifetime: false, yearly: false, monthly: false, weekly: false}, admin}}, (err, res) => {
                            if(err) {
                                return console.log(err)
                            }
                        })
                    }
                }
            }
        }
        i++
    })
})
})

const Job2 = new CronJob("* * * * *", async function() {
  const ratelimit = require("./Schemas/ratelimit")
  ratelimit.find().then(async res => {
    await ratelimit.deleteMany();
  })
})

const Job3 = new CronJob("0 * * * *", function() {
  const Bans = require("./Schemas/ban")
  Bans.find({ }).then(async BANS => {
    await BANS.forEach(async ban => {
        if(ban.length.permanent != true) {
            if(ban.length.length >= new Date().getTime()) {
                await Bans.findOneAndRemove({UserID: ban.UserID}, (err, res) => {
                    if(err) console.log(err);
                    console.log(res);
                })
            }
        }
    })
})
})

Job1.start();
Job2.start();
Job3.start();

app.listen(process.env.port || 3000 , () => {
  console.log(`WispaGen Site is running → PORT 3000`);
});
