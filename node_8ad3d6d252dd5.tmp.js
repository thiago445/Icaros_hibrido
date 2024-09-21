const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const hbs = require('./config/handlebars'); 
const session = require('express-session');


app.use(session({
    secret: 'sua_chave_secreta',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Coloque true em produção
}));

// Configuração do Handlebars
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Servindo arquivos estáticos
app.use('/css', express.static('public/css'));
app.use('/image', express.static('public/image'));
app.use('/script', express.static('public/js'));

// Importa e usa as rotas
const indexRoute = require('./routes/indexRoute');
const pageLoginRoute= require('./routes/pageLoginRoute');
const pageSigninRoute = require('./routes/pageSigninRoute');


app.use('/', indexRoute);
app.use('/login', pageLoginRoute);
app.use('/signin', pageSigninRoute);


app.listen(8081, function () {
    console.log('Servidor rodando');
});
