const router = require("express").Router();
const db = require("../database/models/userModel");
const bcrypt = require("bcrypt");
const Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");
require("dotenv").config();
// const passport = require("passport");
// const passportconf = require("./protected");


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

const schema_signin = Joi.object().keys({
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    email: Joi.string()
      .email({ minDomainSegments: 2 })
      .required()
  });

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