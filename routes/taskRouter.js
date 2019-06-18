const router = require("express").Router();
const db = require("../database/models/taskModel");
const Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const passport = require("passport");
const passportconf = require("./protected");
const jwtdecode = require('jwt-decode');

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
  duedate: Joi.date()
      .required()
});

// add task and task_owner 
router.post("/addTask",  passport.authenticate("jwt", { session: false }),async (req, res) => {
    const validatedbody = Joi.validate(req.body, schema);
    if (!validatedbody.error) {
      const { title, description, duedate} = req.body;
      const task = await db.addTask(title,description,duedate);
      const userid = jwtdecode(req.headers.authorization)
      console.log(task)
      const taskowner= await db.addTaskOwner(userid.user_id, task[0].task_id)
      res.json(task) 
     
    } else {
      const message = validatedbody.error.details[0].message;
      res.json({ message });
    }
  });

  module.exports = router;