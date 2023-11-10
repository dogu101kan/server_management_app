import { Servers } from "../../../components/servers";
import AddServer from "../../../components/addServer";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";

export const LeftBar = ({setDataInf, setMessageBox}) => {

  const cookies = new Cookies;

  const [data, setData] = useState([]);
  const [checkData, setCheckData] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    let url = "/api/ssh/servers";
    let headers = new Headers();
    headers.append("authorization", "Bearer " + cookies.get("token"));

    fetch(url, {
      method: "GET",
      headers: headers,
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.success === false) {
          setData(false);
          cookies.remove("token");
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
        <AddServer setCheckData={setCheckData} checkData={checkData}/>
      </div>
      <div className="max-h-80 overflow-auto pr-2 flex flex-col gap-1">
      
      {data && data.map((el, index) => (
                <div key={index}>
                  <Servers  data={el} setDataInf={setDataInf} setMessageBox={setMessageBox}/>
                </div>
              ))}
      </div>
    </div>
  );
};
