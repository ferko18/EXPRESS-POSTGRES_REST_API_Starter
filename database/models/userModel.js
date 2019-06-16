
const pool = require("../connection.js");

//get all users
async function getAllUsers() {
  const res = await pool.query("select * from users");
  return res.rows;
}

//get user by id
async function getOneUser(id) {
  //parametrized query
  // const text = 'select * from users where user_id=$1'
  // values = [id]
  //const res = await pool.query(text, values);

  //we can also use prepared statment
  const query = {
    name: "getOneUser",
    text: "select * from users where user_id=$1",
    values: [id]
  };
  const res = await pool.query(query);
  return res.rows;
}

//get user by email 
async function getUserByEmail(email)
{
  const query = {
    name: "getUserByEmail",
    text: "select * from users where email=$1",
    values: [email]
  };
  const res = await pool.query(query);
  return res.rows;
}

//add user , note that the returing * statment returns the inserted record

async function addUser(first_name, last_name, email, password) {
  const text =
    "insert into users(first_name, last_name, email, password) values ($1,$2, $3, $4) returning *";
  const values = [first_name, last_name, email, password];
  const add = await pool.query(text, values);
  return add.rows;
}

//update user 

async function updateUser(id, first_name, last_name, email, password) {
    const text = "update users set first_name=$1, last_name=$2, email=$3, password=$4 where user_id=$5 returning *"
    const values = [first_name, last_name, email, password, id]
    const updated = await pool.query(text, values)
    return updated.rows
}

//delete user 

async function deleteUser(id) {
    const text = "delete from users where user_id=$1 returning user_id"
     const values = [id]
    const deleted = await pool.query(text, values)
    return deleted.rows
}

module.exports = { getAllUsers, getOneUser, addUser , updateUser, deleteUser, getUserByEmail};
