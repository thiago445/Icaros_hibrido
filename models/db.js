const { Sequelize } = require('sequelize');
 
const sequelize = new Sequelize('liebe4735_Icaros', 'liebe4735', 'IIFVd3kkV6uDOb6', {
    host: '15.235.9.156', // IP do servidor
    dialect: 'mysql',
    port: 3306,
    dialectOptions: {
      ssl: false, // Desabilita o SSL se não for necessário
    },
  });
 
  sequelize.authenticate()
    .then(() => {
      console.log('Conexão estabelecida com sucesso.');
    })
    .catch((error) => {
      console.error('Erro ao conectar ao MySQL:', error);
    });
 
    module.exports = { sequelize, Sequelize };