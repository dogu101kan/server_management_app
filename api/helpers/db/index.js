const storeInfoToTxt = require("./log/index");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const deleteServerInfo = async () => {
    try {
        const allServers = await prisma.server.findMany();
        for (const server of allServers) {
          const serverInfos = await prisma.serverInfo.findMany({
            where: { serverId: server.id },
          });
    
          if (serverInfos.length > 0) {
            await storeInfoToTxt(serverInfos, "id_"+server.id+"_host_"+server.host);
            await prisma.serverInfo.deleteMany({
              where: { serverId: server.id },
            });
            console.log(`Server ${server.name} bilgileri silindi ve dosyaya kaydedildi.`);
          }
        }
      } catch (error) {
        console.error('Bilgi silme hatası:', error);
      }
};
module.exports = {
    deleteServerInfo
}