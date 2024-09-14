const { sequelize, Sequelize } = require('./db');

const UsuarioProdutor = sequelize.define('UsuarioProdutor', {
    ID_PRODUTOR: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    CNPJ: {
      type: DataTypes.STRING(18),
      allowNull: false,
      unique: true
    },
    NOME_FANTASIA: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    COMENTARIO: {
      type: DataTypes.STRING(255),
      allowNull: true
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
    }
  }, {
    tableName: 'tb_usuario_produtor',
    timestamps: false, // Ajuste conforme a necessidade
  });
  
  module.exports = UsuarioProdutor;
  