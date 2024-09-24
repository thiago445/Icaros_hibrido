const express = require('express');
const Usuario = require('../models/tb_usuario');
const { registerUser, loginUser } = require('../controllers/authController');
const { setMaxParserCache } = require('mysql2');


const router = express.Router();

// Define a rota para registro de usuários
router.post('/register', registerUser);

// Define a rota para login de usuários
router.post('/login', loginUser);

router.get('/confirm', async (req, res) => {
    const { token } = req.query;

    try {
        const usuario = await Usuario.findOne({ where: { confirmationToken: token } });

        if (!usuario) {
            return res.status(400).send('Token inválido.');
        }

        usuario.confirmationToken = null; // Remove o token após confirmação
        await usuario.save();

        res.redirect('/login')
    } catch (error) {
        console.error('Erro ao confirmar e-mail:', error);
        res.status(500).send('Erro ao confirmar e-mail.');
    }
});


module.exports = router;
