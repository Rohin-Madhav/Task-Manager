const router = require('express').Router()
const tmRoutes = require("../controllers/tmControllers")
const auth = require("../middilware/authMiddilware")


router.post("/register",tmRoutes.registerUser)
router.post("/login",tmRoutes.loginUser)
router.get("/tasks",auth,tmRoutes.getTasks)
router.post("/tasks",auth,tmRoutes.addTasks)
router.patch("/task/:id",auth,tmRoutes.updateTask)
router.delete("/deltask/:id",auth,tmRoutes.deleteTask)

module.exports = router