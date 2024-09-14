const { sequelize, Sequelize } = require('./db');

const UsuarioAmanteMusica = sequelize.define('UsuarioAmanteMusica', {
    ID_AMANTE_MUSICA: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    CPF: {
        
        type: DataTypes.STRING(14),
        allowNull: false,
        unique: true
    },
    COMENTARIO: {
        type: DataTypes.TEXT,
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
    tableName: 'tb_usuario_am',
    timestamps: false, // Ajuste conforme a necessidade
});

module.exports = UsuarioAmanteMusica;