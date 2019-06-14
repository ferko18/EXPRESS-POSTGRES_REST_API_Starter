//const connection = require("../database/connection.js");
const router = require("express").Router();
const db = require("../database/models/userModel");

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

router.post("/", async (req, res) => {
    try {
     const {first_name, last_name, email, password}=req.body
      const newuser = await db.addUser(first_name,last_name, email, password);
      res.status(200).json(newuser);
    } catch (err) {
      res.status(500).json({ message: "could add user to the database" });
    }
  });


module.exports = router;
