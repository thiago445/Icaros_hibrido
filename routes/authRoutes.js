const express = require('express');
const { registerUser, loginUser, confirm, reenviarEmail } = require('../controllers/authController');
const { setMaxParserCache } = require('mysql2');

const router = express.Router();

// Define a rota para registro de usuários
router.post('/register', registerUser);

// Define a rota para login de usuários
router.post('/login', loginUser);
    
router.post('/reenviar-email', reenviarEmail);


router.post('/autentic', function (req, res) {
    const {email} = req.body;
    console.log('esse é o email que ta na rota: ' ,email);
    res.cookie('email', email);
    res.redirect('/autenticacaoa');
});

module.exports = router;
