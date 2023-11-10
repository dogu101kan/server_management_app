
export const Command = ({data, setCommand, inputRef}) => {

  const handlePress = () => {
    inputRef.current.focus();
  };


  return (
    <div className="pr-2 w-20">
      <button className="w-full p-2 h-10 bg-gray-200 rounded-md text-center overflow-ellipsis overflow-hidden hover:bg-gray-300" onClick={()=>{setCommand(data.value);handlePress();}}>{data.value}</button>
    </div>
  );
};

