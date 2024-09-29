document.addEventListener('DOMContentLoaded', function () {
    const email = localStorage.getItem('email'); // Obtém o e-mail do armazenamento
    const authButton = document.getElementById('authButton');

    if (email) {
        console.log("Email:", email); // Aqui você pode fazer o que precisar com o e-mail
    }

    authButton.addEventListener('click', function () {
        // Tente autenticar o usuário
        autenticar(email) // Função para autenticação
            .then(() => {
                // Se a autenticação for bem-sucedida, remova o e-mail
                localStorage.removeItem('email');
                // Redirecione ou faça outra ação após autenticação
                window.location.href = '/dashboard'; // Exemplo de redirecionamento
            })
            .catch(error => {
                console.error('Erro na autenticação:', error);
                // Se a autenticação falhar, reenviar e-mail de confirmação
                reenviarEmail(email) // Função para reenviar o e-mail
                    .then(() => {
                        console.log("E-mail de confirmação reenviado.");
                    })
                    .catch(error => {
                        console.error('Erro ao reenviar e-mail:', error);
                    });
            });
    });
});
