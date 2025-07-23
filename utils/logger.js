const {createLogger, format, transports} = require('winston');
const {combine, timestamp, printf, colorize, errors} = format;

// Custom format
const customFormat = printf(({level, message, timestamp, stack}) => {
  return `${timestamp} | ${level} | ${stack || message}`;
});

const logger = createLogger({
  level: 'info', // Can be 'debug', 'warn', 'error' etc.
  format: combine(
      timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
      errors({stack: true}), // to print error stack traces
      customFormat,
  ),
  transports: [
    new transports.Console({
      format: combine(colorize(), customFormat),
    }),
    new transports.File({filename: 'logs/error.log', level: 'error'}),
    new transports.File({filename: 'logs/combined.log'}),
  ],
});

module.exports = logger;
