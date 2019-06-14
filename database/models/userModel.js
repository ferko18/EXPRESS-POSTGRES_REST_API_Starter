const pool = require("../connection.js")

//get all users 
async function getAllUsers()
{
    const res = await pool.query('select * from users')
    return res.rows;
}

//get user by id 
async function getOneUser(id){
    const text = 'select * from users where user_id=$1'
    values = [id]
    const res= await pool.query(text, values)
    return res.rows
}

//add user 

async function addUser(first_name, last_name,email, password){
    const text = 'insert into users(first_name, last_name, email, password) values ($1,$2, $3, $4) returning user_id'
    const values=[first_name,last_name,email, password]
    const add = await pool.query(text, values)
    return add.rows
}

module.exports = {getAllUsers, getOneUser, addUser}