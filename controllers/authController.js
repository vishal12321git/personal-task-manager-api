const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {User} = require('../models');
const asyncHandler = require('../utils/asyncHandler.js');
const {JWT_SECRET, JWT_EXPIRATION} = require('../config/appConfig.js');
const ApiError = require('../utils/ApiError.js');
const ApiResponse = require('../utils/ApiResponse.js');

const cookieOptions = {
  httpOnly: true,
  secure: true,
};
const getAll = async (req, res, next)=>{
  const task = await User.findAll();
  res.json(task);
};
// Controller for user register
const register = asyncHandler(async (req, res, next) => {
  const {username, email, password} = req.body;
  if (!username || !email || !password) {
    throw new ApiError(400, 'All fields are required.');
  }

  // Check user if already exist
  const existingUser = await User.findOne({where: {email: email}});
  if (existingUser) {
    throw new ApiError(409, 'User with this username already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
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

// Controller for user sign in
const login = asyncHandler(async (req, res, next) => {
  const {email, password} = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required.');
  }

  const user = await User.findOne({where: {email: email}});
  if (!user) {
    throw new ApiError(401, 'Invalid credentials.');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
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
  return res
      .status(200)
      .clearCookie('accessToken', cookieOptions)
      .json(
          new ApiResponse(200, {}, 'User logged out'),
      );
});

module.exports = {getAll, register, login, logout};
