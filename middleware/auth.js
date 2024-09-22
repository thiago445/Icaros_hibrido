const jwt = require('jsonwebtoken');
const secretKey = '4635rfd2o3i5WDsf3241GFLAIh';

function authenticateToken(req, res, next) {
    const token = req.cookies.jwt; // Captura o token do cookie
    if (!token) return res.status(403).json({ error: 'Token não fornecido' });

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.status(401).json({ error: 'Token inválido' });
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;
