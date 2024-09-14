const { sequelize, Sequelize } = require('./db');

const UsuarioMusico = sequelize.define('Usuario_musico', {

  ID_MUSICO: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  CPF: {
    type: Sequelize.STRING(14),
    allowNull: false,
    unique: true
  },
  ID_USUARIO: {

    type: Sequelize.INTEGER,
    allowNull: true,
    unique: true,
    references: {
      model: 'tb_usuario', // Nome da tabela referenciada
      key: 'ID_USUARIO'
    }
  },
  IMAGEM: {
    type: Sequelize.BLOB('medium'),
    allowNull: true
  },
  COMENTARIO: {
    type: Sequelize.TEXT,
    allowNull: true
  }
}, {
  tableName: 'tb_usuario_musico',
  timestamps: false, // Ajuste conforme a necessidade
});

module.exports = UsuarioMusico;
