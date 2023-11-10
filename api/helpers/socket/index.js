const { Server } = require('socket.io');
const {connect_ssh, exec_ssh, dispose_ssh} = require("../ssh");
let io; 


let users = [];
let ssh = []


const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId, server:null });
};

const removeUser = async(socketId) => {
  try {
    let usertodispose = users.find((user) => user.socketId === socketId);
  await dispose_ssh(usertodispose.server.ssh);
  users = users.filter((user) => user.socketId !== socketId);
  } catch (error) {
    
  }
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

function initializeSocket(httpServer) {
  io = new Server(httpServer,{
    cors: {
        origin: "http://localhost:5173", 
        methods: ["GET", "POST"],
      },
  });

  io.on("connection", (socket) => {

    console.log("User connected.");
    
    socket.on("addUser", (userId) => {
      try {
        addUser(userId, socket.id);
      } catch (error) {
        
      }
    });
  
    socket.on("openserver", async({server, userId}) => {
      try {
        io.to(getUser(userId).socketId).emit("serverres", {
          err:null,
          message:"Connection Starting.."
        });
        ssh = await connect_ssh(server.host, server.username, server.password);
        if(!ssh.err){
          io.to(getUser(userId).socketId).emit("serverres", {
            err:null,
            message:"Connection Successful."
          });
          getUser(userId).server = ssh;
        }else{
          io.to(getUser(userId).socketId).emit("serverres", {err:true, message:"Connection Error."});
        }
      } catch (error) {
        console.log(error)
      }
    });
  
    
    socket.on("execserver", async({ userId, data }) => {
      try{
        const user = getUser(userId);
        let res = await exec_ssh(user.server.ssh, data.command, data.cwd)
        
      if(!res.err){
        io.to(user.socketId).emit("serverres", {
          err:res.err,
          message:res.onStdout
        });
      }else{
        
        if(data.command.split(" ")[0]=="cd"){
          io.to(user.socketId).emit("serverres", {
            err:res.err,
            message:res.onStdout
          });
        }else{
          io.to(user.socketId).emit("serverres", {
            err:false,
            message:res.onStderr
          });
        }
      }
      
      }catch(err){

      }

    });

    socket.on("disposeserver", async({ userId }) => {
      try {
        const user = getUser(userId);
      let res = await dispose_ssh(user.server.ssh)
      
      } catch (error) {
        
      }
    });
  
    //when disconnect
    socket.on("disconnect", () => {
      console.log("User disconnected!");
      try{
        removeUser(socket.id);
      }catch(err){
        throw customErr
      }
    });
  });
}

module.exports = {
  initializeSocket,
};
