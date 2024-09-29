const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middleware/auth');
const {redirect} =require('../../controllers/profilesController');
const Usuario = require('../../models/tb_usuario');

router.get('/info', authenticateToken, function(res,req){
    const user = Usuario.findByPk(req.user.id);
    console.log(user);
    res.json(user);


});

module.exports= router;