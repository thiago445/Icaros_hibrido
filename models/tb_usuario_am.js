const { sequelize, Sequelize } = require('./db');

const Usuario_Am = sequelize.define("TB_USUARIO_AM", {
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
    NOME:{
        type: Sequelize.STRING, 
        allowNull: false,
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

module.exports = Usuario_Am;