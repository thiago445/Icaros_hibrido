const Sequelize = require('sequelize');

// Conexão com o banco de dados no Railway
const sequelize = new Sequelize('railway', 'root', 'MkzzKLsbjrMLvPETVqKgdAYjxwfizvlT', {
    host: 'autorack.proxy.rlwy.net',
    port: '20799',
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

        // Sincroniza todos os modelos, criando as tabelas se não existirem
        await sequelize.sync({ alter: true }); // ou use { force: true } para recriar as tabelas
        console.log('Tabelas sincronizadas com sucesso!');
    } catch (error) {
        console.error('Erro ao conectar ao MySQL:', error);
    }
})();

module.exports = { sequelize, Sequelize };
