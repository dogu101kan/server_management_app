const { NodeSSH } = require("node-ssh");


const connect_ssh = async (host, username, password) => {
  let error = {}
  const ssh = new NodeSSH();
  try{
    await ssh.connect({
      host,
      username,
      password,
    });
    return {err:false, ssh:ssh};
  }catch(err){
    error = err
  }
  return {err: error}
};

const exec_ssh = async (ssh, command, cwd) => {
    let data = {
      err:null,
      onStdout:null,
      onStderr:null
    }
  try {
    // io.emit(name, `Sistem: SSH bağlantısı kuruldu. Komut çalıştırılıyor...`);
    await ssh.execCommand(command, {
      cwd,
      onStdout(chunk) {
        // io.emit(name, chunk.toString('utf8'));
        console.log(chunk.toString('utf8'))
        data.onStdout = chunk.toString('utf8')
        data.onStderr = null
      },
      onStderr(chunk) {
        // io.emit(name, chunk.toString('utf8'));
        console.log(chunk.toString('utf8'))
        data.err = true
        data.onStderr = chunk.toString('utf8')
      },
    });

  } catch (err) {
    // io.emit(name, `Sistem: SSH bağlantısı kurulamadı. Hata: ${err.message}`);
    data.err = err;
  }

  return data
};

const dispose_ssh = async (ssh) => {
  let data = {
    err:null,
    message:null
  }
  try {
    await ssh.dispose();
  } catch (err) {
    data.err = true;
    data.message = err
  }
  return data
};

module.exports = { connect_ssh, exec_ssh, dispose_ssh };
