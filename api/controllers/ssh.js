const asyncErrorWrapper = require("express-async-handler");
const CustomError = require("../helpers/error/CustomError");
const { connect_ssh, exec_ssh, dispose_ssh } = require("../helpers/ssh/index");
const {parseSystemInfo} = require("../helpers/systemInfoJsonParser");

///////////////////////////////////////

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

let ssh;

const connect = asyncErrorWrapper(async (req, res) => {
  const { username, host, password } = req.query;
  ssh = await connect_ssh(host, username, password);

  res.status(200).json({
    success: true,
  });
});

const exec = asyncErrorWrapper(async (req, res) => {
  const { command } = req.body;

  await exec_ssh(ssh, command, "/home", "message2");

  res.send({
    success: true,
  });
});

const dispose = asyncErrorWrapper(async (req, res) => {
  await dispose_ssh(ssh);

  res.status(200).json({
    success: true,
  });
});

/////////////////////////////////////////////////////////////

const getServers = asyncErrorWrapper(async (req, res) => {
  const server = await prisma.server.findMany({
    where:{
      userId:req.user.id
    }
  });

  res.status(200).json({
    success: true,
    data: server,
  });
});

const addServer = asyncErrorWrapper(async (req, res) => {
  const { username, host, password, name } = req.body;
  const commands = ["ver", "uname -s"];
  let os;

  const data = {
    name,
    username,
    password,
    host,
    os:null,
    userId: req.user.id,
  };

  try {
    const serveros = await connect_ssh(host, username, password);

    for (const el of commands) {
      os = await exec_ssh(serveros.ssh, el, "/");
      
      if(!os.err){
        
        if(os.onStdout.slice(" ")[1].trim() === "Windows"){
          data.os = os.onStdout.slice("/").trim()
          break
        }

        if(os.onStdout.slice("/").trim() === "Linux"){
          data.os = os.onStdout.slice("/").trim()
          break;
        }
      }  
    };
    await dispose_ssh(serveros.ssh);
  } catch (error) {
    
  }
  const server = await prisma.server.create({ data });
  


  const { password: passw, ...rest } = server;
  res.status(201).json({
    success: true,
    data: rest,
  });
});

const testServer = asyncErrorWrapper(async (req, res) => {
  const { username, host, password } = req.body;
  const commands = ["ver", "uname -s"];
  let os;

  const data = {
    username,
    password,
    host,
    os:null,
  };

  try {
    const serveros = await connect_ssh(host, username, password);

    for (const el of commands) {
      os = await exec_ssh(serveros.ssh, el, "/");
      
      if(!os.err){
        
        if(os.onStdout.slice(" ")[1].trim() === "Windows"){
          data.os = os.onStdout.slice("/").trim()
          break
        }

        if(os.onStdout.slice("/").trim() === "Linux"){
          data.os = os.onStdout.slice("/").trim()
          break;
        }
      }  
    };
    await dispose_ssh(serveros.ssh);
  } catch (error) {
    
  }

  res.status(201).json({
    success: true,
  });
});

const connectServer = asyncErrorWrapper(async (req, res) => {
  const { id } = req.body.id;

  const server = await prisma.server.findUnique({
    where: {
      id,
    },
  });

  ssh = await connect_ssh(server.host, server.username, server.password);
  res.status(200).json({
    success: true,
  });
});

const addCommand = asyncErrorWrapper(async (req, res) => {
  const { value } = req.body;

  const data = {
    value,
    userId: req.user.id,
  };
  

  const server = await prisma.command.create({ data });
  
  res.status(201).json({
    success: true,
  });
});

const getCommand = asyncErrorWrapper(async (req, res) => {
  const commands = await prisma.command.findMany({
    where:{
      userId:req.user.id
    }
  });

  res.status(200).json({
    success: true,
    data: commands,
  });
});

const getSystemInfo = asyncErrorWrapper(async (req, res) => {
  const server = await prisma.server.findMany({
    where:{
      id:parseInt(req.params.serverId),
      userId:req.user.id,
    },
    include: {
      serverInfo: {
        orderBy: {
          id: 'desc'
        },
        take: 1
      }
    },
  });

  res.status(200).json({
    success: true,
    data: server[0].serverInfo[0]
  });
});



module.exports = {
  connectServer,
  getServers,
  addServer,
  connect,
  exec,
  dispose,
  addCommand, 
  getCommand,
  testServer,
  getSystemInfo
};
