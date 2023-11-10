function parseSystemInfo(info) {
    // Satırları ayır ve boş satırları temizle
    const lines = info.split('\n').filter(line => line.trim() !== '');
  
    // JSON nesnesi oluştur
    const result = {};
    lines.forEach(line => {
      const parts = line.split(':');
      const key = parts[0].trim();
      const value = parts[1].trim();
      result[key] = value;
    });
  
    return result;
  }

  module.exports = {
    parseSystemInfo,
  }