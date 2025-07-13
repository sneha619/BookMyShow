const express = require("express");
const router = express.Router();
const User = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddlewares = require("../middlewares/authMiddlewares");

router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.send({
        success: false,
        message: "User already exists",
      });
    }

    const newUser = new User({ name, email, password });
    await newUser.validate();

    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);
    await newUser.save();

    res.send({
      success: true,
      message: "User Registered Successfully",
    });
  } catch (error) {
    console.log(error);
    if (error.name === "ValidationError") {
      return res.status(400).send({ success: false, message: error.message });
    }
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (!userExists) {
      return res.status(400).send({
        success: false,
        message: "User does not exist",
      });
    }

    const validPassword = await bcrypt.compare(password, userExists.password);

    if (!validPassword) {
      return res.send({
        success: false,
        message: "Incorrect Password",
      });
    }
    
    const token = jwt.sign({ userId: userExists._id }, process.env.SECRET_KEY, { expiresIn: "3d" });

    res.send({
      success: true,
      user: userExists,
      message: "Logged in successfully",
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
});

router.get("/get-current-user", authMiddlewares, async (req, res) => {
  try {
    // Use req.user._id instead of req.user.userId
    const currentUser = await User.findById(req.user._id).select('-password');
    console.log("Current User:", currentUser);
    
    if (!currentUser) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    
    res.send({
      success: true,
      user: currentUser,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
});

module.exports = router;
