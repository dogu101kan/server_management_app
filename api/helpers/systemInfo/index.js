const asyncErrorWrapper = require("express-async-handler");
const { connect_ssh, exec_ssh, dispose_ssh } = require("../ssh/index");
const { parseSystemInfo } = require("../systemInfoJsonParser");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const serverInfoLogger = asyncErrorWrapper(async () => {
  const server = await prisma.server.findMany();
  let systemInfo;
  server.forEach(async (el) => {
    const serverssh = await connect_ssh(el.host, el.username, el.password);
    if (el.os === "Linux") {
      systemInfo = await exec_ssh(serverssh.ssh, "lscpu", "/");
      const parsedInfo = parseSystemInfo(systemInfo.onStdout);
      const data = {
        serverId: el.id,
        health: parsedInfo,
      };

      await prisma.serverInfo.create({ data });
    }
    else if (el.os === "Windows") {
      systemInfo = await exec_ssh(serverssh.ssh, "systemInfo", "/");
      const parsedInfo = parseSystemInfo(systemInfo.onStdout);
      const data = {
        serverId: el.id,
        health: parsedInfo,
      };

      await prisma.serverInfo.create({ data });
    }

    await dispose_ssh(serverssh.ssh);
  });
});

module.exports = {
  serverInfoLogger,
};
