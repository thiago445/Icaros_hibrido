const { sequelize, Sequelize } = require('./db');

const UsuarioProdutor = sequelize.define('UsuarioProdutor', {
    ID_PRODUTOR: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    CNPJ: {
      type: Sequelize.STRING(18),
      allowNull: false,
      unique: true
    },
    NOME_FANTASIA: {
      type: Sequelize.STRING(255),
      allowNull: true
    },
    COMENTARIO: {
      type: Sequelize.STRING(255),
      allowNull: true
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
    }
  }, {
    tableName: 'tb_usuario_produtor',
    timestamps: false, // Ajuste conforme a necessidade
  });
  
  module.exports = UsuarioProdutor;
  