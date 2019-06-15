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
    const { first_name, last_name, email, password } = req.body;
    if (!first_name || !last_name || !email || !password) {
      res.status(400).json({ error: " provide all fields." });
    } else {
      const newuser = await db.addUser(first_name, last_name, email, password);
      res.status(200).json(newuser);
    }
  } catch (err) {
    res.status(500).json({ message: "could not add user to the database" });
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
    const user = await db.deleteUser(id);
    if (user.length === 0) {
      res.status(404).json({ message: "user not found" });
    } else {
      res.status(200).json(user);
    }
  } catch (err) {
    res.status(500).json({ message: "can't delete user" });
  }
});

module.exports = router;
