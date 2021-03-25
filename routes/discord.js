const express = require("express"),
router = express.Router()


router.get("/", (req, res, next) => {
    return res.redirect("https://discord.gg/fxXB4SpzRK");
})

module.exports = router;