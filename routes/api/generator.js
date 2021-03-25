const express = require("express"),
Alt = require("../../Schemas/alt"),
User = require("../../Schemas/user"),
AccountTypes = require("../../Schemas/accountTypes.js"),
router = express.Router();

router.get("/getAccount", async (req, res, next) => {
    if(!req.query.type || !req.query.discordID) return res.status(400).send("{\"status\": 400, \"body\": \"Not enough arguments\"}")
    let findUser = await User.findOne({discordID: req.query.discordID})
    let CheckAccountType = await AccountTypes.findOne({ServiceName: req.query.type})
    if(CheckAccountType !== null) {
        if(CheckAccountType.Premium === true) {
            if(findUser.plan.bought.weekly === true && findUser.genedAltsToday < 200) {
                let alt = await findRandomAlt(req.query.type, findUser)
                return res.send(alt);
            } else if(findUser.plan.bought.monthly === true && findUser.genedAltsToday < 400){
                let alt = await findRandomAlt(req.query.type, findUser)
                return res.send(alt);
            } else if(findUser.plan.bought.yearly === true && findUser.genedAltsToday < 600) {
                let alt = await findRandomAlt(req.query.type, findUser)
                return res.send(alt);
            }  else if(findUser.plan.bought.lifetime === true && findUser.genedAltsToday < 2000) {
                let alt = await findRandomAlt(req.query.type, findUser)
                return res.send(alt);
            }
            else {
               return res.send(bitchThisHoeThinkItFree());
            }
        } else {
            if(findUser.genedAltsToday < 10){
                let alt = await findRandomAlt(req.query.type, findUser)
                return res.send(alt);
            } else {
                let fasdf = {
                    status: 409,
                    reason: "You hit your daily alt limit."
                }
                return res.send(fasdf)
            }
        }
    } else {
        let paidnotFree= {
            status: 400,
            reason: "Generator Type Not Found."
        }
        return res.send(paidnotFree)
    }
})

async function findRandomAlt(type = String, user) {
    console.log("type:" +  type)
    console.log(user.discordID)
    let AccountType = await AccountTypes.findOne({ServiceName: type})
    console.log(AccountType);
    if(AccountType.Stock <= 0) {
        let returnJson = {
            status: 200,
            body: "Out of Stock!"
        }
        return returnJson;
    }
    let alts = await Alt.find({service: type});
    const alt = alts[0];
    console.log(alt);
    let updatedStock = AccountType.Stock - 1;
    await AccountTypes.findOneAndUpdate({ServiceName: type}, {Stock: updatedStock})
    await Alt.findOneAndDelete({combo: alt.combo, service: type})
    let genAlt = {date: new Date().getTime(),combo: alt.combo, service: alt.service}
    user.genedAlts.unshift(genAlt)
    let n = user.genedAltsToday + 1;
    await User.findOneAndUpdate({discordID: user.discordID}, {$set: { genedAlts: user.genedAlts}, genedAltsToday: n});
    let returnJson = {
        status: 200,
        body: alt.combo
    }
    return returnJson;
}

  

function bitchThisHoeThinkItFree() {
    let paidnotFree= {
        status: 401,
        reason: "Unauthorized"
    }
    return paidnotFree
}


module.exports = router;
