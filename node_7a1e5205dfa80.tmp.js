const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const hbs = require('./config/handlebars');
const session = require('express-session');
//dotenv
require('dotenv').config()
require('./models/mongo/mongoDb');



app.use(cors({
    origin: 'http://localhost:8080', // domínio do cliente
    credentials: true
}));

app.use(session({
    secret: 'sua_chave_secreta',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Colocar true em produção
}));

//base url para quando tiver dominio
app.use((req, res, next) => {
    res.locals.baseUrl = process.env.API_BASE_URL || 'http://localhost:8081';
    next();
  });
    

app.use(cookieParser());

// Configuração do Handlebars
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Servindo arquivos estáticos
app.use('/css', express.static('public/css'));
app.use('/image', express.static('public/image'));
app.use('/script', express.static('public/js'));
app.use('/uploads', express.static('uploads'));


// Importa e usa as rotas
const pageRoutes = require('./routes/pageRoutes');
const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const profileRoutes = require('./routes/protectedRoutes/profilesRoutes')
const PictureRoutes = require('./routes/protectedRoutes/pictureRoutes');
const postRoutes = require('./routes/postRoutes');


app.use('/posts', postRoutes);
app.use('/prot', protectedRoutes);
app.use('/profile', profileRoutes);
app.use('/', pageRoutes);
app.use('/auth', authRoutes);
app.use('/pictures', PictureRoutes);

app.listen(8081, function () {
    console.log('Servidor rodando');
});

