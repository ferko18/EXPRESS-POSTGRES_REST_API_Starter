const express = require("express"),
  helmet = require("helmet"),
  cors = require("cors");

//server to point to 
const server = express();

//connect to database 
const connection = require('./database/connection')
connection.connect((err)=>{
  if(err){
      throw err
  }
  console.log('connected postgres database...')
})

//use dependencies/middlewares 
server.use(helmet(), express.json(), cors());

//Routes 

const usersRouter = require("./routes/userRouter");

//API Endpoints
server.use("/api/users", usersRouter);

//Default Endpoints
server.get("/", (req, res) => {
    res.send("Its working!");
  });

module.exports = server;