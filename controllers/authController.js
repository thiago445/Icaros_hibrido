const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const sendEmail = require('../emails/sendEmail');
const Usuario = require('../models/tb_usuario');
const UsuarioMusico = require('../models/tb_usuario_musico');
const UsuarioProdutor = require('../models/tb_usuario_produtor');
const UsuarioAmanteMusica = require('../models/tb_usuario_am');

const secretKey = '4635rfd2o3i5WDsf3241GFLAIh';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 36000000
};

// Função para registrar um novo usuário
async function registerUser(req, res) {
  const { birthDate, email, flagUserType, gender, musicalGenre, name, password, telephone } = req.body.user;
  const { userMusician } = req.body;
  const { producerUser } = req.body;
  const { userLover } = req.body;

  try {
    const existingUser = await Usuario.findOne({ where: { EMAIL: email } });
    if (existingUser) {
      return res.status(400).json({ error: 'E-mail já está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const novoUsuario = await Usuario.create({
      NOME: name,
      EMAIL: email,
      SENHA: hashedPassword,
      sexo: gender,
      flag_tipo_usuario: flagUserType,
      DATA_NASC: birthDate,
      TELEFONE: telephone,
      GENERO_MUSICAL: musicalGenre
    });

    const confirmationToken = crypto.randomBytes(20).toString('hex');
    novoUsuario.confirmationToken = confirmationToken;
    await novoUsuario.save();

    if (userMusician) {
      await UsuarioMusico.create({
        CPF: userMusician.cpf,
        ID_USUARIO: novoUsuario.ID_USUARIO
      });
    }

    if (producerUser) {
      await UsuarioProdutor.create({
        CNPJ: producerUser.cnpj,
        NOME_FANTASIA: producerUser.fantasyName,
        ID_USUARIO: novoUsuario.ID_USUARIO
      });
    }

    if (userLover) {
      await UsuarioAmanteMusica.create({
        CPF: userLover.cpf,
        ID_USUARIO: novoUsuario.ID_USUARIO
      });
    }

    console.log('User Musician:', userMusician);
    console.log('User Lover:', userLover);
    console.log('Producer User:', producerUser);

    await sendEmail(
      email,
      'Confirmação de Cadastro',
      `<strong>Clique no <a href="http://localhost:8081/auth/confirm?token=${confirmationToken}">link</a> para confirmar seu e-mail.</strong>`
    );
    console.log('sendEmail:', sendEmail);

    res.status(201).json({ message: 'Usuário registrado com sucesso', usuario: novoUsuario });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { EMAIL: email } });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const validPassword = await bcrypt.compare(password, usuario.SENHA);
    if (!validPassword) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    
    const jwtToken = jwt.sign(
      { id: usuario.ID_USUARIO, userType: usuario.flag_tipo_usuario },
      secretKey,
      { expiresIn: '10h' }
    );
    res.cookie('jwt', jwtToken, COOKIE_OPTIONS);


    res.status(200).json({ message: 'Login bem-sucedido', usuario });
  } catch (error) {
    console.error('Erro ao autenticar usuário:', error);
    res.status(500).json({ error: 'Erro ao autenticar usuário' });
  }
}

async function confirm(req, res) {
  const { token } = req.query;

  try {
    const usuario = await Usuario.findOne({ where: { confirmationToken: token } });

    if (!usuario) {
      return res.status(400).send('Token inválido.');
    }

    usuario.confirmationToken = null; // Remove o token após confirmação
    await usuario.save();

    const jwtToken = jwt.sign(
      { id: usuario.ID_USUARIO, userType: usuario.flag_tipo_usuario },
      secretKey,
      { expiresIn: '10h' }
    );
    res.cookie('jwt', jwtToken, COOKIE_OPTIONS);

    res.send(`
      <h1>Email registrado com sucesso!</h1>
      <p>Você será redirecionado para sua página em breve...</p>
      <script>
          setTimeout(() => {
              window.location.href = '/prot/redirect'; // Altere para sua rota de dashboard do usuário
          }, 3000);
      </script>
      `);
  } catch (error) {
    console.error('Erro ao confirmar e-mail:', error);
    res.status(500).send('Erro ao confirmar e-mail.');
  }
};

async function redirect(req, res) {
  try {
    const usuario = await Usuario.findByPk(req.user.id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    const userType = usuario.flag_tipo_usuario;
    const NewUser = usuario.NovoUsuario;

    if (!NewUser) {
      switch (userType) {
        case 1:
          res.redirect('/portifolio-musico');
          break;
        case 2:
          res.redirect('/portifolio-AM');
          break;
        case 3:
          res.redirect('/portifolio-produtor');

          break;
        default:
          console.log('Tipo de usuário desconhecido');
      }
    }
    switch (userType) {
      case 1:

        res.redirect('/attMusico');

        break;
      case 2:
        res.redirect('/attAm');

        break;
      case 3:
        res.redirect('/attProdutor');

        break;
      default:
        console.log('Tipo de usuário desconhecido');
    }


  } catch (error) {
    console.error('Erro ao buscar detalhes do usuário:', error);
    res.status(500).json({ error: 'Erro ao buscar detalhes do usuário' });
  }

}

module.exports = { registerUser, loginUser, confirm, redirect };
