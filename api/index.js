const express = require("express");
const dotenv = require("dotenv");
const routers = require("./routers/index");
const customErrorHandler = require("./middlewares/errors/customErrorHandler");
const path = require("path");
let cors = require("cors");
const scheduler = require("node-schedule");
const expressWinston = require("express-winston");
const { transports, format } = require("winston");
const logger = require("./logger");
const {serverInfoLogger} = require("./helpers/systemInfo");


dotenv.config({
  path: "./config/env/config.env",
});

const app = express();

app.use(
  expressWinston.logger({
    winstonInstance: logger,
    statusLevels: true,
  })
);


app.use(cors());

app.use(express.json());

const PORT = process.env.PORT;

scheduler.scheduleJob("* */2 * * *", function () {
  try {
    serverInfoLogger();
    
  } catch (error) {
    
  }
});

const { deleteServerInfo }  = require("./helpers/db");

scheduler.scheduleJob("* */24 * * *", function () {
  deleteServerInfo();
});



const http = require("http");
const socket= require("./helpers/socket/index")
const server = http.createServer(app);


socket.initializeSocket(server);

  
app.use("/api", routers);

app.use(express.static(path.join(__dirname, "public")));

const myFormat = format.printf(({ level, meta, timestamp }) => {
  return `${timestamp} ${level}: ${meta.message}`;
});

app.use(
  expressWinston.errorLogger({
    transports: [
      new transports.File({
        filename: "logsInternalErrors.log",
      }),
    ],
    format: format.combine(format.json(), format.timestamp(), myFormat),
  })
);



app.use(customErrorHandler);

server.listen(PORT, () => {
  console.log(`API started on ${PORT}`);
});
