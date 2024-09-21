const { sequelize, Sequelize } = require('./db');
const Usuario = require('./tb_usuario'); // Ajuste o caminho para o seu modelo Usuario

const UsuarioAmanteMusica = sequelize.define('UsuarioAmanteMusica', {
    ID_AMANTE_MUSICA: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    CPF: {

        type: Sequelize.STRING(14),
        allowNull: false,
        unique: true
    },
    COMENTARIO: {
        type: Sequelize.TEXT,
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
    tableName: 'tb_usuario_am',
    timestamps: false, // Ajuste conforme a necessidade
});

module.exports = UsuarioAmanteMusica;