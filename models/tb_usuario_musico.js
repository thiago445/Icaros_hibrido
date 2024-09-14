const { sequelize, Sequelize } = require('./db');

const Usuario_Musico = sequelize.define("TB_USUARIO_MUSICO", {
    id: {
        type: Sequelize.INTEGER, 
        autoIncrement: true,
        primaryKey: true,
    },
    cpf: {
        type: Sequelize.STRING, 
        allowNull: false,
        unique:true
    },
    TB_USUARIO_ID_USUARIO:{
        type: Sequelize.INTEGER, 
        allowNull: false,
    },
    
    TB_EVENTOS_ID_EVENTO:{
        type: Sequelize.INTEGER, 
        allowNull: false,
    }
});
// sequelize.sync({ force: false })

module.exports = Usuario_Musico;