//const connection = require("../database/connection.js");
const router = require("express").Router();
const db = require("../database/models/userModel");
const bcrypt = require("bcrypt");
const Joi = require("@hapi/joi");

//define schema for validation 
const schema = Joi.object().keys({
  first_name: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),
  last_name: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
  email: Joi.string().email({ minDomainSegments: 2 }).required()
});

//get all users
router.get("/", async (req, res) => {
  try {
    const users = await db.getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "could not retrive results" });
  }
});

//get user by id

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await db.getOneUser(id);

    if (user.length === 0) {
      res.status(404).json({ message: "user not found" });
    } else {
      res.status(200).json(user);
    }
  } catch (err) {
    res.status(500).json({ message: "could not retrive results" });
  }
});

// add user

// router.post("/", async (req, res) => {

//   //check the email is not in use
//   //validate entry
//   try {
//     // const valres = Joi.vaidate(req.body, schema)
//     var { first_name, last_name, email, password } = req.body;
//     if (!first_name || !last_name || !email || !password) {
//       res.status(400).json({ error: " provide all fields." });
//     } else {
//       //hash the password
//       const hash = bcrypt.hashSync(password, 12);
//       password = hash;
//       const newuser = await db.addUser(first_name, last_name, email, password);
//       res.status(200).json(newuser);
//     }
//   } catch (err) {
//     res.status(500).json({ message: "could not add user to the database" });
//   }
// });

//add user with validation --using @hapi/joi

router.post("/", async (req, res) => {
  const validatedbody = Joi.validate(req.body, schema);
  if (!validatedbody.error) {
    const { email } = req.body;
    const user = await db.getUserByEmail(email);
    if (user.length!==0) {
      res.json({message:'user already registered'});
    } else {
      var { first_name, last_name,  password } = req.body;
      const hash = bcrypt.hashSync(password, 12);
      password = hash;
      const newuser = await db.addUser(first_name, last_name, email, password);
      res.status(200).json(newuser);
    }
  } else {
    const message = validatedbody.error.details[0].message;
    res.json({ message });
  }
});

//update user

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { first_name, last_name, email, password } = req.body;
    const user = await db.updateUser(
      id,
      first_name,
      last_name,
      email,
      password
    );
    if (user.length === 0) {
      res.status(404).json({ message: "user not found" });
    } else {
      res.status(200).json(user);
    }
  } catch (err) {
    res.status(500).json({ message: "can't update user" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const userid = await db.deleteUser(id);
    if (user.length === 0) {
      res.status(404).json({ message: "user not found" });
    } else {
      res.status(200).json(userid);
    }
  } catch (err) {
    res.status(500).json({ message: "can't delete user" });
  }
});

module.exports = router;
