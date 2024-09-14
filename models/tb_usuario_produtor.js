const { sequelize, Sequelize } = require('./db');

const Usuario_Produtor = sequelize.define("TB_USUARIO_PRODUTOR", {
    id: {
        type: Sequelize.INTEGER, 
        autoIncrement: true,
        primaryKey: true,
    },
    cnpj: {
        type: Sequelize.STRING, 
        allowNull: false,
        unique:true
    },
    NOME_EMPRESA:{
        type: Sequelize.STRING, 
        allowNull: false,
    },
    TB_USUARIO_ID_USUARIO:{
        type: Sequelize.INTEGER, 
        allowNull: false,
    }
    
    
});
// sequelize.sync({ force: false })

module.exports = Usuario_Produtor;