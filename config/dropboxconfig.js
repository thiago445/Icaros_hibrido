const axios = require('axios');
require('dotenv').config();

const DROPBOX_API_URL = 'https://api.dropbox.com/oauth2/token';

// Função para obter um novo access token usando o refresh token
async function refreshDropboxToken() {
  try {
    const response = await axios.post(DROPBOX_API_URL, null, {
      params: {
        grant_type: 'refresh_token',
        refresh_token: process.env.DROPBOX_REFRESH_TOKEN,
        client_id: process.env.DROPBOX_CLIENT_ID,
        client_secret: process.env.DROPBOX_CLIENT_SECRET,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const newAccessToken = response.data.access_token;

    // Atualize o access token em suas variáveis de ambiente ou banco de dados
    process.env.DROPBOX_ACCESS_TOKEN = newAccessToken;
    console.log('Access token renovado com sucesso!');

    // Você pode salvar o novo token em um banco de dados ou sistema de configuração aqui
    // Exemplo: db.saveAccessToken(newAccessToken);
  } catch (error) {
    console.error('Erro ao renovar o token:', error.response ? error.response.data : error.message);
  }
}

// Função para ser chamada antes de usar o access token
async function checkAndRefreshToken() {
  // Verifique se o token está expirado antes de prosseguir
  // Neste exemplo, vou chamar a função de renovação diretamente
  await refreshDropboxToken();
}

module.exports = {
  checkAndRefreshToken,
};
