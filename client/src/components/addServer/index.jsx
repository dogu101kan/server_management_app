import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import Cookies from "universal-cookie";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  maxHeight: "80vh",
  overflowY: "auto",
  textAlign: "center",
};

const AddServer = ({ setCheckData, checkData }) => {
  const cookies = new Cookies();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);
  const [formData, setFormData] = useState({});
  const [test, setTest] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setErr(null);
    setTest(false);
    setOpen(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
    setTest(false);
  };

  const testServer = () => {
    let url = "/api/ssh/testserver";

    let headers = new Headers();

    headers.append("Content-Type", "application/json");
    headers.append("authorization", "Bearer " + cookies.get("token"));

    fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.success === false) {
          setErr(json.message);
          setTest(false);
        } else {
          setErr(null);
          setTest(true);
        }
        setLoading(false);
        setCheckData(!checkData);
      })
      .catch((e) => {
        setErr(e);
        setLoading(false);
      });
  };

  const handleSubmit = (e) => {
    setLoading(true);
    let url = "http://localhost:5000/api/ssh/addserver";

    let headers = new Headers();

    headers.append("Content-Type", "application/json");
    headers.append("authorization", "Bearer " + cookies.get("token"));

    fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.success === false) {
          setErr(json.message);
        } else {
          setErr(null);
        }
        setLoading(false);
        setCheckData(!checkData);
        handleClose();
      })
      .catch((e) => {
        setErr(e);
        setLoading(false);
      });
  };

  return (
    <div className="inline-flex">
      <Button className="text-black w-6 h-6 max-w-6 -pl-5" onClick={handleOpen}>
        <svg
          className="w-6 h-6 mt-3 -px-2"
          viewBox="0 0 18 18"
          fill="currentColor"
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
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            style={{ position: "relative" }}
          >
            <div>
              <input
                id="name"
                type="text"
                placeholder="Server Name"
                onChange={handleChange}
                className="border border-gray-400 px-3"
              />
            </div>
          </Typography>
          <div className="flex flex-col items-start justify-center gap-2 mt-2">
            <label className="flex justify-between w-full ">
              username:
              <input
                id="username"
                type="text"
                onChange={handleChange}
                className="border border-gray-400 mx-1"
              />
            </label>
            <label className="flex justify-between w-full ">
              password:
              <input
                id="password"
                type="password"
                onChange={handleChange}
                className="border border-gray-400 mx-1"
              />
            </label>
            <label className="flex justify-between w-full ">
              host:
              <input
                id="host"
                type="text"
                onChange={handleChange}
                className="border border-gray-400 mx-1"
              />
            </label>
          </div>

          <div className="flex flex-row gap-5 mt-10 justify-evenly">
            {!test ? (
              <button
                className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-sm"
                onClick={testServer}
              >
                test
              </button>
            ) : (
              <button
                className="bg-gray-100 hover:bg-gray-100 px-3 py-1 rounded-sm disabled text-gray-500 cursor-not-allowed"
                onClick={testServer}
              >
                test
              </button>
            )}
            {test ? (
              <button className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-sm" onClick={handleSubmit}>
                kaydet
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="bg-gray-100 hover:bg-gray-100 px-3 py-1 rounded-sm disabled text-gray-500 cursor-not-allowed"
              >
                kaydet
              </button>
            )}
          </div>
          {err && <div>{err}</div>}
        </Box>
      </Modal>
    </div>
  );
};

export default AddServer;
