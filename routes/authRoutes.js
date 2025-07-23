const express = require('express');
const router = express.Router();
const {register, login, logout, getAll} = require('../controllers/authController');
router.get('/', getAll);
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;
