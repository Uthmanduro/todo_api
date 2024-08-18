const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getTodoById, createTodo, updateTodo, deleteTodo, getAllTodo } = require('../controllers/userControllers.js');
const protect = require('../authMiddleware.js');



router.post('/api/auth/register', registerUser);
router.post("/api/auth/login", loginUser);
router.post("/api/todo", protect, createTodo);
router.get("/api/todo", protect, getAllTodo);
router.get("/api/todo/:id", protect, getTodoById);
router.put("/api/todo/:id", protect, updateTodo);
router.delete("/api/todo/:id", protect, deleteTodo);


module.exports = router;