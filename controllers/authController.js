const bcrypt = require('bcrypt');
const Usuario = require('../models/tb_usuario');
const UsuarioMusico = require('../models/tb_usuario_musico');

// Função para registrar um novo usuário

async function registerUser(req, res) {
  const { birthDate, email, flagUserType, gender, musicalGenre, name, password, telephone } = req.body.user;
  const { userMusician } = req.body; // Isso permanece igual se esta chave está fora do 'user'
  
  
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

    res.status(201).json({ message: 'Usuário e músico registrados com sucesso', usuario: novoUsuario });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
}


async function loginUser(req, res) {
  const { EMAIL, SENHA } = req.body;
  try {
    const usuario = await Usuario.findOne({ where: { EMAIL } });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    const validPassword = await bcrypt.compare(SENHA, usuario.SENHA);
    if (!validPassword) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }
    res.status(200).json({ message: 'Login bem-sucedido', usuario });
  } catch (error) {
    console.error('Erro ao autenticar usuário:', error);
    res.status(500).json({ error: 'Erro ao autenticar usuário' });
  }
}

module.exports = { registerUser, loginUser };
