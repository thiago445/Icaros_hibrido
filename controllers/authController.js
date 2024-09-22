const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = '4635rfd2o3i5WDsf3241GFLAIh';
const Usuario = require('../models/tb_usuario');
const UsuarioMusico = require('../models/tb_usuario_musico');
const UsuarioProdutor = require('../models/tb_usuario_produtor');
const UsuarioAmanteMusica = require('../models/tb_usuario_am')




// Função para registrar um novo usuário

async function registerUser(req, res) {
  const { birthDate, email, flagUserType, gender, musicalGenre, name, password, telephone } = req.body.user;
  const { userMusician } = req.body; // Isso permanece igual se esta chave está fora do 'user'
  const { producerUser } = req.body;
  const { userLover } = req.body;



  try {
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

    if (userMusician) {
      await UsuarioMusico.create({
        CPF: userMusician.cpf,// Ajuste para as propriedades adequadas
        ID_USUARIO: novoUsuario.ID_USUARIO
      });
    }

    if (producerUser) {
      await UsuarioProdutor.create({
        CNPJ: producerUser.cnpj,// Ajuste para as propriedades adequadas
        NOME_FANTASIA: producerUser.fantasyName,
        ID_USUARIO: novoUsuario.ID_USUARIO
      });
    }
    if (UsuarioAmanteMusica) {
      await UsuarioAmanteMusica.create({
        CPF: userLover.cpf,// Ajuste para as propriedades adequadas
        ID_USUARIO: novoUsuario.ID_USUARIO
      });
    }



    res.status(201).json({ message: 'Usuário e músico registrados com sucesso', usuario: novoUsuario });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
}

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
  maxAge: 36000000 // Expira em 10 horas
};

async function loginUser(req, res) {
  const { email, password } = req.body;
  try {
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const validPassword = await bcrypt.compare(password, usuario.SENHA);


    if (!validPassword) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    // Gerar um token JWT
    const token = jwt.sign({ id: usuario.ID_USUARIO }, secretKey, { expiresIn: '10h' }); // Expiração de 1 hora, ajuste conforme necessário


    // Defina um cookie com o token JWT
    res.cookie('jwt', token, COOKIE_OPTIONS);

    res.status(200).json({ message: 'Login bem-sucedido', usuario });

  } catch (error) {
    console.error('Erro ao autenticar usuário:', error);
    res.status(500).json({ error: 'Erro ao autenticar usuário' });
  }

}




module.exports = { registerUser, loginUser };
