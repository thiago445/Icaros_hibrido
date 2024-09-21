const express = require('express');

const { registerUser, loginUser } = require('../controllers/authController');

const router = express.Router();

// Define a rota para registro de usuários
router.post('/register', registerUser);

// Define a rota para login de usuários
router.post('/login', loginUser);

module.exports = router;
