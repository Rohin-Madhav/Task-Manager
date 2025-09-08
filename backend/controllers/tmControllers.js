require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/userSchema");
const Task = require("../models/taskSchema");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    await newUser.save();
    res.status(201).send("User registered successfully");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send("Invalid credentials");
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.status(500).send("Error logging in user: " + error.message);
  }
};

exports.getTasks = async (req, res) => {
  try {
    const taskDatas = await Task.find(req.query);
    res.status(200).json(taskDatas);
  } catch (error) {
    res
      .status(404)
      .json({ message: "Error finding data", error: error.message });
  }
};

exports.addTasks = async (req, res) => {
  try {
    const task = await Task.create({
      user: req.user.id, 
      title: req.body.title,
      description: req.body.description,
      completed: false,
    });
    res.status(201).json(task);
  } catch (error) {
    console.error("Add task error:", error.message);
    res.status(500).json({ message: "Error in adding data", error: error.message });
  }
};


exports.updateTask = async (req, res) => {
  try {
    const updateTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updateTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ message: "Data not found" });
    }
    res
      .status(200)
      .json({ message: "Data deleted successfully", data: deletedTask });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting data", error: error.message });
  }
};
