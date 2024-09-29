const express = require('express');
const { registerUser, loginUser, confirm, reenviarEmail } = require('../controllers/authController');
const { setMaxParserCache } = require('mysql2');

const router = express.Router();

// Define a rota para registro de usuários
router.post('/register', registerUser);

// Define a rota para login de usuários
router.post('/login', loginUser);
    
router.post('/reenviar-email', reenviarEmail);

module.exports = router;
