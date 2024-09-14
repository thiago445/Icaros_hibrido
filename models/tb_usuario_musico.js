const { sequelize, Sequelize } = require('./db');

const UsuarioMusico = sequelize.define('Usuario_musico', {

  ID_MUSICO: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  CPF: {
    type: DataTypes.STRING(14),
    allowNull: false,
    unique: true
  },
  ID_USUARIO: {
    
    type: DataTypes.INTEGER,
    allowNull: true,
    unique: true,
    references: {
      model: 'tb_usuario', // Nome da tabela referenciada
      key: 'ID_USUARIO'
    }
  },
  IMAGEM: {
    type: DataTypes.BLOB('medium'),
    allowNull: true
  },
  COMENTARIO: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'tb_usuario_musico',
  timestamps: false, // Ajuste conforme a necessidade
});

module.exports = UsuarioMusico;
