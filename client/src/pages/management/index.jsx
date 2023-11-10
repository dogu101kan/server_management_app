import { useEffect, useState } from "react";
import io from "socket.io-client";
import Cookies from "universal-cookie";
import { Messages } from "../../components/messages";

const socket = io.connect("http://localhost:5000");
export const Management = ({dataInf, messageBox, setMessageBox, command, setCommand, inputRef}) => {

  const [cwd, setCwd] = useState("");
  const [data, setData] = useState(command);
  const [user, setUser] = useState();
  const cookies = new Cookies();

  useEffect(()=>{
    setData(command)
  },[command]);

  useEffect(()=>{
    setCommand(data)
  },[data]);

  useEffect(()=>{
    socket.on("serverres", data => {
      setMessageBox((prev) => [...prev, data])
    });
  },[socket])
  
  useEffect(()=>{
    setUser(parseJwt(cookies.get("token")))
  }, [])

  useEffect(()=>{
    user && socket.emit("addUser", user.id)
  }, [user])

  useEffect(()=>{
    user && socket.emit("openserver", {server:dataInf, userId:user.id})
    user && socket.emit("disposeserver", {userId:user.id})
  }, [dataInf])

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };


  const sendCommand = (command, cwd)=>{
    socket.emit("execserver", {data:{command, cwd}, userId:user.id})
    setData("")
  }

  const handleCommand = (command) => {
    let commandlist = command.split(" ")
    let commandCwd=cwd+ "/";
    if (commandlist[0].trim() == "cd") {
      if(commandlist[1].trim() !== ".."){
        commandCwd += commandlist[1];
        setCwd(`${cwd+ "/" + commandlist[1]}`);
        setMessageBox((prev)=>[...prev, {message:commandCwd+">>>  "+command, err:null}])
        sendCommand(command, commandCwd)
      }else if(commandlist[1].trim() === ".."){
        const lastIndex1 = commandCwd.lastIndexOf('/');
        const lastIndex = commandCwd.lastIndexOf('/', lastIndex1 - 1);
        if (lastIndex !== -1) {
          commandCwd = commandCwd.substring(0, lastIndex);
          setCwd(commandCwd);
          setMessageBox((prev)=>[...prev, {message:commandCwd+">>>  "+command, err:null}])
          setData("")
        }
      }


    }else {
      setMessageBox((prev)=>[...prev, {message:commandCwd+">>>  "+command, err:null}])
      sendCommand(command, commandCwd)
    }
  };

  const handleEnterPress = (e) => {
    if (e.key === 'Enter') {
      handleCommand(data);
    }
  };

  return (
    <div className="">
      <div className="flex flex-col gap-2">
      <div className="bg-white h-80 max-h-80 p-1 px-4 text-sm mt-2 overflow-auto flex flex-col-reverse">
          <Messages messages={messageBox}/>
        </div>
        <label className="flex bg-white">
          <input
            className="w-full px-1 text-xs font-medium focus-within:outline-none"
            type="text"
            value={data}
            ref={inputRef}
            onChange={(e)=>setData(e.target.value)}
            onKeyDown={handleEnterPress}
          />
          <button className="px-2 text-sm border hover:bg-slate-100 fo" onClick={()=>handleCommand(data)}>
            Enter
          </button>
        </label>
        
      </div>
    </div>
  );
};
