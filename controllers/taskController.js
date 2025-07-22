const { Task } = require('../models');
const asyncHandler = require('../utils/asyncHandler.js');
const ApiError = require('../utils/ApiError.js');
const ApiResponse = require('../utils/ApiResponse.js');

// Get all tasks for logged-in user
const getUserTasks = asyncHandler(async (req, res) => {
  const currentUserId = req.user.id;
  const tasks = await Task.findAll({ where: { userId: currentUserId } });

  return res.status(200).json(new ApiResponse(200, tasks, 'Tasks fetched successfully!'));
});

// Create a new task
const createTask = asyncHandler(async (req, res) => {
  const currentUserId = req.user.id;
  const { title, description, status, priority, dueDate } = req.body;

  if (!title || !priority || !dueDate) {
    throw new ApiError(400, 'Title, priority, and due date are required.');
  }

  const newTask = await Task.create({
    title,
    description: description || '',
    status: status || 'pending',
    priority,
    dueDate: new Date(dueDate),
    userId: currentUserId,
  });

  return res.status(201).json(new ApiResponse(201, newTask, 'Task created successfully!'));
});

// Get a specific task
const getTaskById = asyncHandler(async (req, res) => {
  const currentUserId = req.user.id;
  const { id: taskId } = req.params;

  const task = await Task.findByPk(taskId);
  if (!task || task.userId !== currentUserId) {
    throw new ApiError(404, 'Task not found or unauthorized.');
  }

  return res.status(200).json(new ApiResponse(200, task, 'Task retrieved successfully!'));
});

// Update a task
const updateTask = asyncHandler(async (req, res) => {
  const currentUserId = req.user.id;
  const { id: taskId } = req.params;
  const { title, description, priority, dueDate, status } = req.body;

  const task = await Task.findByPk(taskId);
  if (!task || task.userId !== currentUserId) {
    throw new ApiError(404, 'Task not found or unauthorized.');
  }

  task.title = title || task.title;
  task.description = description ?? task.description;
  task.priority = priority || task.priority;
  task.dueDate = dueDate ? new Date(dueDate) : task.dueDate;
  task.status = status || task.status;

  await task.save();

  return res.status(200).json(new ApiResponse(200, task, 'Task updated successfully!'));
});

// Delete a task
const deleteTask = asyncHandler(async (req, res) => {
  const currentUserId = req.user.id;
  const { id: taskId } = req.params;

  const task = await Task.findByPk(taskId);
  if (!task || task.userId !== currentUserId) {
    throw new ApiError(404, 'Task not found or unauthorized.');
  }

  await task.destroy();

  return res.status(200).json(new ApiResponse(200, null, 'Task deleted successfully!'));
});

module.exports = { getUserTasks, createTask, getTaskById, updateTask, deleteTask };
