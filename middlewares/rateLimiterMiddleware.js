const ApiError = require('../utils/ApiError');

const ipRequestLimiter = {};

const limiter = (req, res, next) => {
  const ip = req.ip;

  if (!ipRequestLimiter[ip]) {
    ipRequestLimiter[ip] = {
      count: 1,
    };

    setTimeout(() => {
      delete ipRequestLimiter[ip];
    }, 1000 * 60 * 15);

    return next();
  }

  ipRequestLimiter[ip].count += 1;

  if (ipRequestLimiter[ip].count > 70) {
    return next(new ApiError(429, 'Request limit exceeded, try after some time.'));
  }

  return next();
};

module.exports = limiter;
