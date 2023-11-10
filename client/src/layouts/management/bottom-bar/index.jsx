import { useState, useEffect } from "react";
import { JsonView, allExpanded, darkStyles, defaultStyles } from 'react-json-view-lite';
import Cookies from "universal-cookie";

export const BottomBar = ({dataInf, timer}) => {

  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const cookies = new Cookies();

  const fetchData = ()=>{
    
    
    if(dataInf.id != undefined)
    {
      setLoading(true);
    let url = `/api/ssh/systeminfo/${dataInf.id}`;
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
        cookies.remove("token");
      });}
  }

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
    fetchData();
    }, timer); 

    return () => {
      clearInterval(intervalId);
    };
  }, [dataInf]);

  return <div className="w-full max-h-64 h-48 bg-white overflow-scroll px-4 py-2">
    <JsonView data={data} shouldExpandNode={allExpanded} style={darkStyles} />
  </div>;
};
