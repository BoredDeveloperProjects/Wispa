const router = require("express").Router(), Ban = require("../../Schemas/ban");

router.post("/:userID", async (req, res) => {
    if(!req.user) return res.status(404).render({error: {message: "Not Found"}, status: 404});
    if(req.user.plan.admin === false) return res.status(404).render("error", {err: {message: "Not Found"}, status: 404});
    let Reason;
    let RSET = false;
    if(req.body.reason.length > 0) Reason = req.body.reason; else Reason = "None Provided";
    if(req.body.reason.length > 0) RSET = true;
    let length = 0;
    let permanent = false;
    if(req.body.length && req.body.length.toLowerCase() !== "p") {
        let Givelength = req.body.length.toLowerCase().split(" ");
        Givelength.forEach(time => {
            let len = time.slice(0, -1);
            if(time.includes("y")) {
                length = length + (31556952000 * len);
            } else if(time.includes('m')){
                length = length + (2419200000 * len);
            } else if(time.includes("w")) {
                length = length = (604800000  * len);
            } else if(time.includes("d")) {
                length = length + (86400000 * len);
            } else if(time.includes("h")) {
                length = length + (3600000 * len);
            }
        })
        length = new Date().getTime() + length
    } else if(req.body.length.toLowerCase() === "p") permanent = true; 
    let UserID = req.params.userID;
    let ban = new Ban({
        UserID,
        Reason: {
            data: Reason,
            set: RSET
        },
        Date: new Date().getTime(),
        length: {
            permanent,
            length
        }
    })
    await ban.save();
    res.redirect(`/admin?BannedUser=true`)
})

module.exports = router;