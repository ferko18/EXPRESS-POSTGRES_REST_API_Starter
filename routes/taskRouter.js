const router = require("express").Router();
const db = require("../database/models/taskModel");
const Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const passport = require("passport");
const passportconf = require("./protected");
const jwtdecode = require("jwt-decode");

const schema = Joi.object().keys({
  title: Joi.string()
    .alphanum()
    .min(3)
    .max(255)
    .required(),
  description: Joi.string()
    .alphanum()
    .min(5)
    .max(255)
    .required(),
  duedate: Joi.date().required()
});

// add task and task_owner : this relies on two async calls, better to
//use triggers instead.

router.post(
  "/addTask",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const validatedbody = Joi.validate(req.body, schema);
    if (!validatedbody.error) {
      const { title, description, duedate } = req.body;
      const task = await db.addTask(title, description, duedate);
      const userid = jwtdecode(req.headers.authorization);
      //   console.log(task);
      const taskowner = await db.addTaskOwner(userid.user_id, task[0].task_id);
      res.json(task);
    } else {
      const message = validatedbody.error.details[0].message;
      res.json({ message });
    }
  }
);

//get all tasks per user
router.get(
  "/tasklist",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userid = await jwtdecode(req.headers.authorization);
      // console.log(userid)
      const tasks = await db.getTask(userid.user_id);
      // console.log(tasks)
      res.json(tasks);
    } catch (error) {
      res.json({ message: "could not retrive results" });
    }
  }
);

//get task per user per task_id --might not be required in the app

router.get(
  "/tasklist/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const id = req.params.id;
      const task = await db.getTaskbyId(id);

      if (task.length === 0) {
        res.status(404).json({ message: "task not found" });
      } else {
        res.status(200).json(task);
      }
    } catch (error) {
      res.json({ message: "could not get task" });
    }
  }
);


//delete task



//edit task

module.exports = router;
