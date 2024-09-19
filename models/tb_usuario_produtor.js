const { sequelize, Sequelize } = require('./db');
const Usuario = require('./tb_usuario'); // Ajuste o caminho para o seu modelo Usuario

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
        model: Usuario, // Nome da tabela referenciada
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
  