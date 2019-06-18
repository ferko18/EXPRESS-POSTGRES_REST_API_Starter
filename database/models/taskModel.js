const pool = require("../connection.js");

//add a task and update task_owner table
//can be achieved with cte , triggers or async code here , the problem with doing it in javascript is  that if one of the insert fails, your data 
//won't be consistent. but cool to do it in JS

async function addTask(title, description, duedate) {
    const text =
      "insert into task(title, description, duedate) values ($1,$2, $3) returning *";
    const values = [title, description, duedate];
    const add = await pool.query(text, values);
    return add.rows;
  }

async function addTaskOwner(user_id, task_id)
{
    const text = 'insert into task_owner(user_id, task_id) values($1, $2) returning user_id'
    const values =[user_id,task_id];
    const add = await pool.query(text, values);
    return add.rows
}

module.exports ={addTask, addTaskOwner}