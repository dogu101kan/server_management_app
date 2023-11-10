export const Servers = ({ data, setDataInf, setMessageBox }) => {
  const imageUrl = (data.os=="Linux")?'/img/linux.png':"/img/windows.png";
  return (
    <div 
    className="bg-contain bg-center bg-no-repeat rounded-md"
    style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <button className="w-full p-2 h-20 bg-slate-100 hover:bg-white/100 flex flex-col bg-white/90 rounded-md"
      onClick={()=>{setDataInf(data);setMessageBox([]);}}>
        <p className="text-bold">{data.name}</p>
        <p className="text-xs">{data.username}</p>
        <p className="text-xs">{data.host}</p>
      </button>
    </div>
  );
};

