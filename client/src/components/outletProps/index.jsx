import { Management } from "../../pages/management"

export const OutletProps = ({ dataInf, setMessageBox, messageBox, command, setCommand, inputRef }) => {
  return (
    <div><Management dataInf={dataInf} setMessageBox={setMessageBox} messageBox={messageBox} command={command} setCommand={setCommand} inputRef={inputRef} /></div>
  )
}
