const express = require("express");
const { connect, exec, dispose, addServer, getServers, connectServer, addCommand, getCommand, testServer, getSystemInfo } = require("../controllers/ssh");
const { getAccess } = require("../middlewares/auth/index");
const router = express.Router();


router.post("/connect", getAccess, connectServer);
router.get("/servers", getAccess, getServers);
router.post("/addserver", getAccess, addServer);
router.post("/testserver", testServer);
router.post("/addcommand", getAccess, addCommand);
router.get("/commands", getAccess, getCommand);
router.post("/exec", exec);
router.get("/dispose", dispose);
router.post("/systeminfo", getAccess, getSystemInfo);
router.get("/systeminfo/:serverId", getAccess, getSystemInfo);

module.exports = router;