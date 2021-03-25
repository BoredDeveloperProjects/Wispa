const express = require("express"),
router = express.Router(),
FUBDI = require("./FindUserByDiscordID"),
auth = require("./auth"),
user = require("./user"),
gen = require("./generator"),
buy = require("./buy"),
key = require("./genkey"),
test = require("./test")

router.use("/buy", buy)
router.use("/auth", auth);
router.use("/FindUserByDiscordID", FUBDI);
router.use("/user", user);
router.use("/generator", gen);
router.use("/genkey", key);
router.use("/test", test);



module.exports = router;