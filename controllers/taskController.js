const {Task} = require('../models');
const asyncHandler = require('../utils/asyncHandler.js');
const ApiError = require('../utils/ApiError.js');
const ApiResponse = require('../utils/ApiResponse.js');
const {Op} = require('sequelize');
const logger = require('../utils/logger.js');

// Get all tasks for logged-in user
const getUserTasks = asyncHandler(async (req, res) => {
  const currentUserId = req.user.id;

  const {
    priority,
    status,
    sortBy = 'dueDate',
    sortOrder = 'ASC',
    dueDateFrom,
    dueDateTo,
  } = req.query;

  const where = {userId: currentUserId};

  if (priority) where.priority = priority;
  if (status) where.status = status;

  if (dueDateFrom || dueDateTo) {
    where.dueDate = {};
    if (dueDateFrom) where.dueDate[Op.gte] = new Date(dueDateFrom);
    if (dueDateTo) where.dueDate[Op.lte] = new Date(dueDateTo);
  }

  const tasks = await Task.findAll({
    where,
    order: [[sortBy, sortOrder.toUpperCase()]],
  });
  logger.info('Tasks fetched successfully!');
  return res.status(200).json(new ApiResponse(200, tasks, 'Tasks fetched successfully!'));
});

// Create a new task
const createTask = asyncHandler(async (req, res) => {
  const currentUserId = req.user.id;
  const {title, description, status, priority, dueDate} = req.body;

  if (!title || !priority || !dueDate) {
    logger.error('Title, priority, and due date are required.');
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
  logger.info('Task created successfully!');
  return res.status(201).json(new ApiResponse(201, newTask, 'Task created successfully!'));
});

// Get a specific task
const getTaskById = asyncHandler(async (req, res) => {
  const currentUserId = req.user.id;
  const {id: taskId} = req.params;

  const task = await Task.findByPk(taskId);
  if (!task || task.userId !== currentUserId) {
    logger.error('Task not found or unauthorized.');
    throw new ApiError(404, 'Task not found or unauthorized.');
  }
  logger.info('Task retrieved successfully!');
  return res.status(200).json(new ApiResponse(200, task, 'Task retrieved successfully!'));
});

// Update a task
const updateTask = asyncHandler(async (req, res) => {
  const currentUserId = req.user.id;
  const {id: taskId} = req.params;
  const {title, description, priority, dueDate, status} = req.body;

  const task = await Task.findByPk(taskId);
  if (!task || task.userId !== currentUserId) {
    logger.error('Task not found or unauthorized.');
    throw new ApiError(404, 'Task not found or unauthorized.');
  }

  task.title = title || task.title;
  task.description = description ?? task.description;
  task.priority = priority || task.priority;
  task.dueDate = dueDate ? new Date(dueDate) : task.dueDate;
  task.status = status || task.status;

  await task.save();
  logger.info('Task updated successfully!');
  return res.status(200).json(new ApiResponse(200, task, 'Task updated successfully!'));
});

// Delete a task
const deleteTask = asyncHandler(async (req, res) => {
  const currentUserId = req.user.id;
  const {id: taskId} = req.params;

  const task = await Task.findByPk(taskId);
  if (!task || task.userId !== currentUserId) {
    logger.error('Task not found or unauthorized.');
    throw new ApiError(404, 'Task not found or unauthorized.');
  }

  await task.destroy();
  logger.info('Task deleted successfully!');
  return res.status(200).json(new ApiResponse(200, null, 'Task deleted successfully!'));
});

module.exports = {getUserTasks, createTask, getTaskById, updateTask, deleteTask};
