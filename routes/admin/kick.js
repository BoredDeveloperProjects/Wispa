const router = require("express").Router(),
Kicks = require("../../Schemas/kick");

router.post("/:userID", async (req, res) => {
    if(!req.user) return res.status(404).render({error: {message: "Not Found"}, status: 404});
    if(req.user.plan.admin === false) return res.status(404).render("error", {err: {message: "Not Found"}, status: 404});
    let Reason;
    if(req.body.reason !== undefined) Reason = req.body.reason; else Reason = "None Provided";
    let UserID = req.params.userID;
    let kick = new Kicks({
        UserID,
        Reason,
        Date: new Date().getTime()
    })
    await kick.save();
    res.redirect(`/admin?KickedUser=true`)
})

module.exports = router;