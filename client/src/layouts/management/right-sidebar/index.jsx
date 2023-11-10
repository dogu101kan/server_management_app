import AddCommand from "../../../components/addCommand";
import { Command } from "../../../components/command";
import { useState, useEffect } from "react";
import Cookies from "universal-cookie";

export const RightBar = ({setCommand, inputRef}) => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [checkData, setCheckData] = useState(false);
  const cookies = new Cookies();

  useEffect(() => {
    setLoading(true);
    let url = "/api/ssh/commands";
    let headers = new Headers();
    headers.append("authorization", "Bearer " + cookies.get("token"));

    fetch(url, {
      method: "GET",
      headers: headers,
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.succes === false) {
          setData(false);
        } else {
          setData(json.data);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [checkData]);

  return (
    <div className="justify-center flex flex-col items-center gap-2">
      <div className="p-1 rounded-full bg-slate-100 hover:bg-slate-200">
        <AddCommand setCheckData={setCheckData} checkData={checkData}/>
      </div>
      <div className="max-h-80 overflow-auto flex flex-col gap-1">
        {
          data && data.map((el, index) => 
          <Command key={index} data={el} setCommand={setCommand} inputRef={inputRef}/>
          )
        }
      </div>
    </div>
  );
};
