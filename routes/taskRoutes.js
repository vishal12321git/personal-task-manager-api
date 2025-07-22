const express = require('express');
const { getUserTasks, createTask, getTaskById, updateTask, deleteTask } = require('../controllers/taskController.js');
const verifyJWT = require('../middlewares/authMiddleware.js');

const router = express.Router();

router.get('/', verifyJWT, getUserTasks);
router.get('/:id', verifyJWT, getTaskById);
router.post('/', verifyJWT, createTask);
router.put('/:id', verifyJWT, updateTask);     
router.delete('/:id', verifyJWT, deleteTask);  

module.exports = router;
