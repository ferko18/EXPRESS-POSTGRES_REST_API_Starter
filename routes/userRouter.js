//const connection = require("../database/connection.js");
const router = require("express").Router();
const db = require("../database/models/userModel");
const bcrypt = require("bcrypt");
const Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const passport = require('passport');
const passportconf = require('./protected')

//https://www.thepolyglotdeveloper.com/2015/05/use-regex-to-test-password-strength-in-javascript/   --for stronger validation
//define schema for signup validation
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
  email: Joi.string()
    .email({ minDomainSegments: 2 })
    .required()
});

//define schema for signin validation
const schema_signin = Joi.object().keys({
 
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
  email: Joi.string()
    .email({ minDomainSegments: 2 })
    .required()
});

//get all users
router.get("/", passport.authenticate('jwt', {session:false}) ,async (req, res) => {
  try {
    const users = await db.getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "could not retrive results" });
  }
});

//get user by id

router.get("/:id",passport.authenticate('jwt', {session:false}), async (req, res) => {
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

// add user minimal validation --not for production

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

router.post("/signup", async (req, res) => {
  const validatedbody = Joi.validate(req.body, schema);
  if (!validatedbody.error) {
    const { email } = req.body;
    const user = await db.getUserByEmail(email);
    if (user.length !== 0) {
      res.json({ message: "email already registered" });
    } else {
      var { first_name, last_name, password } = req.body;
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

//update user needs validation ******todo

router.put("/:id", passport.authenticate('jwt', {session:false}),async (req, res) => {
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

//update user with validation

router.delete("/:id", passport.authenticate('jwt', {session:false}),async (req, res) => {
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

//login endpoint---rate limiting should be added
//post endpoint
//find user by email-->found--->hash password from req--->match---> send back tokken
//validate user using , check if user in db
//create and sign jwt
//respond with jwt--user then stores and uses the the token

router.post("/login", async (req, res) => {
  const validatedbody = Joi.validate(req.body, schema_signin);
  if (!validatedbody.error) {
    const { email } = req.body;
    var user = await db.getUserByEmail(email);
    if (user.length !== 0) {
      const { password } = req.body;
      //console.log(user[0])
      const match = await bcrypt.compare(password, user[0].password);
      if (match) {
        const payload = {
          user_id: user[0].user_id
        };
        const options = {
          expiresIn: "1h"
        };
        jwt.sign(payload, process.env.JWT_SECRET, options, (err, token) => {
          if (err) {
            res.json({
              message: "can't process your request, try again latter"
            });
          } else {
            res.status(200).json({ token });
          }
        });
      } else {
        res.json({ message: "invalid credentials!" });
      }
    } else {
      res.json({ message: "user not found or incorrect credentials" });
    }
  } else {
    const message = validatedbody.error.details[0].message;
    res.json({ message });
  }
});
module.exports = router;
