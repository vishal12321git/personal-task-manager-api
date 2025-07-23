const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/authRoutes.js');
const taskRouter = require('./routes/taskRoutes.js');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/tasks', taskRouter);

app.listen(PORT, ()=> console.log(`server running at port ${PORT}`));

