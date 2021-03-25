const express = require("express"),
Key = require("../../Schemas/key"),
router = express.Router(),
{randomBytes} = require("crypto")



router.get("/", async (req, res, next) => {
    if(!req.query.type || !req.query.password) return res.status(404).send("Page not found.");
    if(req.query.password !== "WISPA_y4fxdmvwcBCeaheF3M8gTNztfFAfH5Q8kh3Xq9jJzJEYpByFEGvue9t2NW38uZH4kYAg5CxfgDUEa2ttPKrurVSKyL") return res.status(404).send("Page not found.");
    let GenedKey = "Wispa-" + randomBytes(60).toString("hex");
    const newKey = new Key({
        key: GenedKey,
        plan: req.query.type
    })
    await newKey.save();
    res.send(GenedKey);
})


module.exports = router;