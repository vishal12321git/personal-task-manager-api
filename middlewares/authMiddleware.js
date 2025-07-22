const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler.js');
const ApiError = require('../utils/ApiError');
const { User } = require('../models');

require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

const verifyJWT = asyncHandler(async (req, _, next) => {
  const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    throw new ApiError(401, 'Unauthorized request');
  }

  const decodedToken = jwt.verify(token, JWT_SECRET);

  const user = await User.findOne({ where: { id: decodedToken?.id } });

  if (!user) {
    throw new ApiError(401, 'Invalid Access Token');
  }

  req.user = user;
  next();
});

module.exports = verifyJWT;

