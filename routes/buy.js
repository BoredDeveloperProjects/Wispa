const express = require("express"),
router = express.Router()


router.get("/", (req, res, next) => {
    let plan;
    if(req.query) {
        plan = req.query;
    }
    res.render("buy", {plan});
})

module.exports = router;