const express = require("express"),
router = express.Router()


router.get("/:invite", (req, res, next) => {
        res.send(req.params);
})


module.exports = router;