const express = require("express"),
router = express.Router()


router.post("/", (req, res, next) => {
    if(!req.body || !req.body.id || !req.body.monitor || !req.body.description || !req.body.rule) return res.status(404);
    let nhook = process.env.DISCORD_MONITORING;
    let send = {
        content: ""
    }
})

module.exports = router;