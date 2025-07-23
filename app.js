const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const {sequelize} = require('./models');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/authRoutes.js');
const taskRouter = require('./routes/taskRoutes.js');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/tasks', taskRouter);

app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
  console.log(`Server is running on http://localhost:${PORT}`);
});
