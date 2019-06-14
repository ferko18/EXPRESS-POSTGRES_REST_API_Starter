const server = require ('./server.js');
const port = 5000 || process.env.PORT || 4000;
 server.listen(port, ()=>{
     console.log(`\n Listening on port ${port}... \n`)
 })