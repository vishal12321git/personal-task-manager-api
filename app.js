const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/authRoutes.js');
const taskRouter = require('./routes/taskRoutes.js');
const limiter = require('./middlewares/rateLimiterMiddleware.js');
const logger = require('./utils/logger.js');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cookieParser());
app.use('/api', limiter);
app.use((req, res, next)=>{
  logger.info(`[${req.method}] ${req.url}`);
  next();
});
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/tasks', taskRouter);


app.listen(PORT, ()=> logger.info(`server running at port ${PORT}`));

