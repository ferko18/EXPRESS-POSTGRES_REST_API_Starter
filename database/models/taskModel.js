const { pool, client } = require("../connection.js");
//add a task and update task_owner table
//can be achieved with cte , triggers or async code here , the problem with doing it in javascript is  that if one of the insert fails, your data
//won't be consistent. but cool to do it in JS

//add task 
async function addTask(title, description, duedate) {
  const text =
    "insert into task(title, description, duedate) values ($1,$2, $3) returning *";
  const values = [title, description, duedate];
  const add = await pool.query(text, values);
  return add.rows;
}


//add task owner 
async function addTaskOwner(user_id, task_id) {
  const text =
    "insert into task_owner(user_id, task_id) values($1, $2) returning user_id";
  const values = [user_id, task_id];
  const add = await pool.query(text, values);
  return add.rows;
}

//get all tasks 
async function getTask(user_id) {
  const text =
    "select task.task_id, title, description, duedate, user_id from task join task_owner on task.task_id=task_owner.task_id where user_id = $1";
  const values = [user_id];
  const gettask = await pool.query(text, values);
  return gettask.rows;
}

//get task by id 

async function getTaskbyId(task_id) {
  const text =
    "select task.task_id, title, description, duedate, user_id from task join task_owner on task.task_id=task_owner.task_id where task.task_id = $1";
  const values = [task_id];
  const gettaskbyid = await pool.query(text, values);
  return gettaskbyid.rows;
}


// delete task 
async function deleteTask(task_id) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("delete from task_owner where task_id = $1", [task_id]);
    await client.query("delete from task where task_id = $1", [task_id]);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

//edit task 

async function updateTask(id, title, description, duedate){
  const text = "update task set title =$1, description =  $2, duedate =$3 where task_id =$4 "
  const values = [title, description, duedate, id ]
  const updated = await pool.query(text, values)
  return updated.rows
}

module.exports = { addTask, addTaskOwner, getTask, getTaskbyId, deleteTask, updateTask };
