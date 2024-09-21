const express = require('express')
const router= express.Router();

router.get('/', function (req, res) {
    res.render('index');
});

router.get('/login', function(req,res){
    res.render('login');
});

router.get('/signin', function(req,res){
    res.render('SIGNIN');
});

router.get('/attAm', function(req,res){
    res.render('attAM');
});

router.get('/attMusico', function(req,res){
    res.render('attMUSICO');
});

router.get('/attProdutor', function(req,res){
    res.render('attPRODUTOR');
});

router.get('/confirm', function(req,res){
    res.render('confirm');
});

router.get('/portifolio-am', function(req,res){
    res.render('portifolio-AM');
});

router.get('/portifolio-musico', function(req,res){
    res.render('portifolio-musico');
});

router.get('/portifolio-produtor', function(req,res){
    res.render('portifolio-produtor');
});



module.exports = router;