require('dotenv').config();

const  { Pool, Client} = require('pg')

var pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.PORT

})

// var client = new Client({
//     user: 'firealem',
//     host: 'localhost',
//     database: 'task',
//     password: 'xxxxxx',
//     port: 4444
  
//   })

// const connectionString = 'postgresql://firealem:xxxxxx@localhost:4444/task'
// var client = new Client ({
//     connectionString: connectionString,
// })


var client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.PORT

})


module.exports = {pool, client}

