const fs = require('fs/promises');
const path = require('path');

const projectFolderPath = process.cwd();

const storeInfoToTxt = async(info, server) => {
  const currentDate = new Date().toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  const logPath = path.join(projectFolderPath, "log")
  
  const folderPath = path.join(logPath, `${server}`);
  const filePath = path.join(folderPath, `${currentDate}.txt`);

  try {
    await fs.mkdir(folderPath, { recursive: true });

    const logData = JSON.stringify(info) + '\n';
    await fs.appendFile(filePath, logData, 'utf8');
  } catch (error) {
    console.error('Bilgi kaydetme hatası:', error);
  }
};
module.exports = storeInfoToTxt;