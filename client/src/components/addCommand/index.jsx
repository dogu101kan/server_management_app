import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useState } from "react";
import Cookies from "universal-cookie";



const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    maxHeight: '80vh', // Sayfaya sığacak şekilde maksimum yükseklik ayarlayın
    overflowY: 'auto',
    textAlign: "center",
  };



const AddCommand = ({setCheckData, checkData}) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(false);
    const [formData, setFormData] = useState({});

    const cookies = new Cookies();

    const handleOpen = () => {
      setOpen(true);
    };
    
    const handleClose = () => {
      setOpen(false);
    };
  
    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    };

    const handleSubmit = (e) => {
      setLoading(true);
      let url = "http://localhost:5000/api/ssh/addcommand";
  
      let headers = new Headers();
  
      headers.append("Content-Type", "application/json");
      headers.append("authorization", "Bearer " + cookies.get("token"));

  
      fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(formData)
      })
        .then((response) => response.json())
        .then((json) => {
          if(json.success===false) setErr(json.message);
          setLoading(false);
          setCheckData(!checkData)
          handleClose();
        })
        .catch((e) => {
          setErr(e);
          setLoading(false);
        });
    };
    return (
      <div className="inline-flex">

        <Button className='text-black w-6 h-6 max-w-6 -pl-5' onClick={handleOpen}>
          <svg
            className="w-6 h-6 mt-3 -px-2"
            viewBox="0 0 18 18"
            fill='currentColor'
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 1v16M1 9h16"
            />
          </svg>
        </Button>
        
        
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} >
            <Typography id="modal-modal-title" variant="h6" component="h2" style={{position:"relative"}}>
              <div>
                <p className=' px-3'>Add Your Command</p>
              </div>
            </Typography>
            <div className='flex flex-col items-start justify-center gap-2 mt-2'>
                <label className='flex justify-between w-full '>
                  Command:
                  <input id="value" type="text" onChange={handleChange} className='border border-gray-400 mx-1'/>
                </label>
            </div>

            <div className='flex flex-row gap-5 mt-10 justify-evenly'>
                <button onClick={handleSubmit} className='bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-sm'>kaydet</button>
            </div>
            {
              err&&(<div>Hata</div>)
            }
          </Box>
        </Modal>
      </div>
    );
}

export default AddCommand