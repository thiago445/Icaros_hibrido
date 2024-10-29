require('dotenv').config();
const fetch = require('node-fetch');

let accessToken = process.env.DROPBOX_ACCESS_TOKEN;
let refreshToken = process.env.DROPBOX_REFRESH_TOKEN;

async function refreshAccessToken() {
    if (!refreshToken) {
        throw new Error("Refresh token não está disponível.");
    }

    const response = await fetch('https://api.dropboxapi.com/oauth2/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            'grant_type': 'refresh_token',
            'refresh_token': refreshToken,
            'client_id': process.env.DROPBOX_CLIENT_ID, // Client ID do seu aplicativo
            'client_secret': process.env.DROPBOX_CLIENT_SECRET, // Client Secret do seu aplicativo
        }),
    });

    if (!response.ok) {
        throw new Error(`Erro ao renovar o token: ${response.statusText}`);
    }

    const data = await response.json();
    accessToken = data.access_token; // Atualiza o access token
    refreshToken = data.refresh_token || refreshToken; // Atualiza o refresh token se retornado

    // Aqui você pode armazenar o novo access token e refresh token em um local seguro
    console.log('Token de acesso renovado com sucesso.');

    // Atualiza o arquivo .env ou onde você armazenar suas credenciais
    updateEnvFile();
}

function updateEnvFile() {
    const fs = require('fs');
    const envFilePath = './.env';

    // Lê o arquivo .env e atualiza os tokens
    const envContent = fs.readFileSync(envFilePath, 'utf-8');
    const newEnvContent = envContent
        .replace(/DROPBOX_ACCESS_TOKEN=.*/, `DROPBOX_ACCESS_TOKEN=${accessToken}`)
        .replace(/DROPBOX_REFRESH_TOKEN=.*/, `DROPBOX_REFRESH_TOKEN=${refreshToken}`);

    fs.writeFileSync(envFilePath, newEnvContent);
}

async function getAccessToken() {
    if (!accessToken) {
        throw new Error("Access token não está disponível.");
    }

    // Aqui você pode implementar lógica para verificar se o token está perto da expiração
    // Ou apenas chamar a função de refresh para garantir que ele esteja atualizado
    await refreshAccessToken();
    return accessToken;
}

module.exports = {
    getAccessToken,
};
