import { Outlet } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { BottomBar } from "./bottom-bar";
import { LeftBar } from "./left-sidebar";
import { RightBar } from "./right-sidebar";
import { OutletProps } from "../../components/outletProps";
import Select from "react-dropdown-select";

export const ManagementLayer = () => {
  const [messageBox, setMessageBox] = useState([]);
  const [command, setCommand] = useState("");
  const [timer, setTimer] = useState(10000);
  const [dataInf, setDataInf] = useState({});
  const inputRef = useRef();

  const options = [
    { 
      value: 10000,
      label: "10s"
    },
    {
      value:  300000,
      label: "5m"
    },
    {
      value:  600000,
      label: "10m"
    }
  ];


  const customStyles = {
    control: (provided) => ({
      ...provided,
      color: 'black',
    }),
  };

  return (
    <div className=" bg-slate-400 p-16 m-20 rounded-md items-center">
      <div className="mb-6 grid grid-flow-col gap-2">
        <div className="col-span-1">
          <LeftBar setDataInf={setDataInf} setMessageBox={setMessageBox}/>
        </div>
        <div className="col-span-10">
          <OutletProps dataInf={dataInf} messageBox={messageBox} setMessageBox={setMessageBox} command={command} setCommand={setCommand} inputRef={inputRef} />
        </div>
        <div className="col-span-1">
          <RightBar setCommand={setCommand} inputRef={inputRef}/>
        </div>
      </div>
      <div className="mt-10 -mb-5 relative">
        <BottomBar dataInf={dataInf} timer={timer} />
        <div className="absolute px-3 py-2 right-1 top-1 text-xs rounded-md flex flex-row items-center gap-2 bg-white/90">
          <p>Update Timer</p>
          <Select options={options}  onChange={(values) => setTimer(values[0].value)} style={customStyles}/>
        </div>
      </div>
    </div>
  );
};
