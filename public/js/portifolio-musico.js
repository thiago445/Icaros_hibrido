document.addEventListener("DOMContentLoaded", function () {
    const BASE_URL = document.getElementById('config').getAttribute('data-base-url');
    // Função para buscar os dados do usuário
    async function fetchUserProfile() {
        try {
            const response = await fetch(`${BASE_URL}/profile/info`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Erro ao buscar o perfil do usuário');
            }

            const userProfile = await response.json();
            displayUserProfile(userProfile);

            // Se houver uma imagem, busca a URL da imagem
            if (userProfile.user.IMAGE) {
                const imageResponse = await fetch(`${BASE_URL}/pictures/${userProfile.user.IMAGE}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });

                if (imageResponse.ok) {
                    const imageData = await imageResponse.json();
                    displayImageUrl(imageData.url); // Exibe a URL da imagem
                } else {
                    console.error('Erro ao buscar a imagem:', imageResponse.statusText);
                }
            }
        } catch (error) {
            console.error('Erro ao buscar o perfil do usuário:', error);
        }
    }

    // Função para exibir os dados do usuário na tela
    function displayUserProfile(userProfile) {
        const nomeElement = document.getElementById('nome');
        const descricaoElement = document.getElementById('descricao');
        const opcoesElement = document.getElementById('opcoes');
        const emailElement = document.getElementById('email');

        if (nomeElement) {
            nomeElement.innerText = userProfile.user.NOME;
        }

        if (descricaoElement && userProfile.musician.COMENTARIO !== null) {
            descricaoElement.innerText = userProfile.musician.COMENTARIO;
        }
        if (opcoesElement) {
            opcoesElement.innerText = userProfile.user.GENERO_MUSICAL;
        }
        if (emailElement) {
            emailElement.innerText = userProfile.user.EMAIL;
        }
    }

    // Função para exibir a imagem
    function displayImageUrl(url) {
        const imagemElement = document.getElementById('imagem');
        if (imagemElement) {
            // Mudar a URL para que seja uma URL de imagem direta
            const directImageUrl = url.replace('dl=0', 'raw=1');
            imagemElement.src = directImageUrl; // Utiliza a URL ajustada do Dropbox
        }
    }
    

    fetchUserProfile();
});
