const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {User} = require('../models');
const asyncHandler = require('../utils/asyncHandler.js');
const {JWT_SECRET, JWT_EXPIRATION} = require('../config/appConfig.js');
const ApiError = require('../utils/ApiError.js');
const ApiResponse = require('../utils/ApiResponse.js');
const logger = require('../utils/logger.js');

const cookieOptions = {
  httpOnly: true,
  secure: true,
};

// Controller for user register
const register = asyncHandler(async (req, res, next) => {
  const {username, email, password} = req.body;
  if (!username || !email || !password) {
    logger.error('All fields are required.');
    throw new ApiError(400, 'All fields are required.');
  }

  // Check user if already exist
  const existingUser = await User.findOne({where: {email: email}});
  if (existingUser) {
    logger.error('User with this username already exists.');
    throw new ApiError(409, 'User with this username already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  // Generate jwt token
  const token = jwt.sign({id: newUser.id, email: newUser.email}, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION,
  });

  const cookieOptions = {
    httpOnly: true,
    secure: true,
  };

  const responseUserData = {
    id: newUser.id,
    username: newUser.username,
    email: newUser.email,
  };
  logger.info('User registered successfully!');
  return res
      .status(201)
      .cookie('accessToken', token, cookieOptions)
      .json(
          new ApiResponse(
              201,
              {user: responseUserData, accessToken: token},
              'User registered successfully!',
          ),
      );
});

// login controller
const login = asyncHandler(async (req, res, next) => {
  const {email, password} = req.body;

  if (!email || !password) {
    logger.error('Email and password are required.');
    throw new ApiError(400, 'Email and password are required.');
  }

  const user = await User.findOne({where: {email: email}});
  if (!user) {
    logger.error('Invalid credentials.');
    throw new ApiError(401, 'Invalid credentials.');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    logger.error('Invalid credentials.');
    throw new ApiError(401, 'Invalid credentials.');
  }

  // Generate JWT token
  const token = jwt.sign({id: user.id, email: user.email}, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION,
  });

  const responseUserData = {
    id: user.id,
    username: user.username,
    email: user.email,
  };
  logger.info('Logged in successfully!');
  return res
      .status(200)
      .cookie('accessToken', token, cookieOptions)
      .json(
          new ApiResponse(
              200,
              {user: responseUserData, accessToken: token},
              'Logged in successfully!',
          ),
      );
});

// Controller to logout user
const logout = asyncHandler(async (req, res, next) => {
  logger.info('User logged out');
  return res
      .status(200)
      .clearCookie('accessToken', cookieOptions)
      .json(
          new ApiResponse(200, {}, 'User logged out'),
      );
});

module.exports = {register, login, logout};
