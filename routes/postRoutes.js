const multer = require('multer');
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/auth');

// Configuração do Multer
const storage = multer.memoryStorage(); // Usando memória para armazenamento temporário
const upload = multer({
    storage: storage,
    limits: { fileSize: Infinity } // Limite definido como infinito
}).fields([{ name: 'video', maxCount: 1 }, { name: 'image', maxCount: 1 }]);

// Rota para criar postagem
router.post('/create', authMiddleware, upload, postController.createPost);

module.exports = router;
