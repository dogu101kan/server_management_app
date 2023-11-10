const express = require("express");
const auth = require("./auth");
const ssh = require("./ssh")
const router = express.Router();

router.use("/auth", auth);
router.use("/ssh", ssh);

module.exports = router;