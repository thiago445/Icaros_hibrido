const express = require('express')
const router= express.Router();

router.get('/login', function(req,res){
    res.render('login');
});

router.get('/signin', function(req,res){
    res.render('SIGNIN');
});
router.get('/', function (req, res) {
    res.render('index');
});


module.exports = router;