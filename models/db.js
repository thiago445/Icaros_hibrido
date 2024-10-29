const Sequelize = require('sequelize');

// Conexão com o banco de dados no Railway
const sequelize = new Sequelize('railway', 'root', 'zKgPDqFifwujcxpSXOvqbMWmkRFkdxUO', {
    host: 'autorack.proxy.rlwy.net',
    port: '32557',
    dialect: 'mysql',
    dialectOptions: {
        connectTimeout: 60000 // Ajusta o tempo de conexão, caso necessário
    },
    logging: false // Desativa o log de SQL, se preferir
});

// Verifica a conexão
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexão ao MySQL estabelecida com sucesso!');
    } catch (error) {
        console.error('Erro ao conectar ao MySQL:', error);
    }
})();

// Exportar a conexão
module.exports = { sequelize, Sequelize };
