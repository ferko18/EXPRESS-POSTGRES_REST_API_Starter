//dependecies
const express = require("express"),
  helmet = require("helmet"),
  cors = require("cors"); logger= require("morgan")

//server to point to
const server = express();
server.use(logger('combined'))
//connect to database
const {client} = require("./database/connection");
client.connect(err => {
  if (err) {
    throw err;
  }
  console.log(`\nconnected postgres database...\n`);
});

//use dependencies/middlewares
server.use(helmet(), express.json(), cors());

//Routes
const register = require ('./routes/registerandLogin')
const usersRouter = require("./routes/userRouter");
const taskRouter = require("./routes/taskRouter");


//API Endpoints
server.use('/', register);
server.use("/api/users", usersRouter);
server.use("/api/tasks", taskRouter);

//Default Endpoint
server.get("/", (req, res) => {
  res.send("Its working!");
});

module.exports = server;
