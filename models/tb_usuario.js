const { sequelize, Sequelize } = require('./db');

const Usuario = sequelize.define('Usuario', {
  ID_USUARIO: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    unique: true
  },
  NOME: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  EMAIL: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  SENHA: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  sexo: {
    type: DataTypes.ENUM('F', 'M', 'P'),
    allowNull: true
  },
  flag_tipo_usuario: {
    type: DataTypes.INTEGER(1),
    allowNull: false
  },
  DATA_NASC: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  TELEFONE: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  GENERO_MUSICAL: {
    type: DataTypes.ENUM(
      'Rock', 'Sertanejo', 'Pop', 'Hip_Hop', 'Jazz', 'Blues', 'Classical', 
      'Electronic_Dance_Music', 'Country', 'Reggae', 'Reggaeton', 'Soul', 
      'Funk', 'Disco', 'Gospel', 'Todos'
    ),
    allowNull: false
  }
}, {
  tableName: 'tb_usuario',
  timestamps: false, // Remove createdAt e updatedAt
  charset: 'utf8mb4',
  collate: 'utf8mb4_general_ci'
});

module.exports = Usuario;
