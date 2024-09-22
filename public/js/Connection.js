function togglePasswordVisibility() {
    var passwordField = document.getElementById("senha");
    var passwordToggle = document.getElementById("toggleSenha");

    if (passwordField.type === "password") {
        passwordField.type = "text";
        passwordToggle.textContent = "Esconder Senha";
    } else {
        passwordField.type = "password";
        passwordToggle.textContent = "Mostrar Senha";
    }
}

async function loginUser() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("senha").value;

    try {
        const response = await fetch('http://localhost:8081/auth/login', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            }),
            credentials: 'include' // Necessário para enviar cookies de sessão
        });

        if (response.ok) {
            showToast("#okToast");

            // Após login, obtenha detalhes adicionais do usuário
            const userResponse = await fetch('http://localhost:8081/prot/tipeUser', {
                method: 'GET',
                credentials: 'include'
            });

            if (userResponse.ok) {
                const userDetails = await userResponse.json();
                const userType = userDetails.userType;

                // Redirecionamento baseado no tipo de usuário
                if (userType === 1) {
                    handleMusicianRedirect();
                } else if (userType === 2) {
                    handleLoverRedirect();
                }else if (userType === 3) {
                    handleProductorRedirect();
                }
            } else {
                console.error('Erro ao obter detalhes do usuário');
                showToast("#errorToast");
            }
        } else {
            showToast("#errorToast");
        }
    } catch (error) {
        console.error('Erro durante o login:', error);
        showToast("#errorToast");
    }
}

function handleMusicianRedirect() {
    // Adapte o URL para o redirecionamento desejado
    window.setTimeout(() => {
        window.location.href = '/attMusico';
    }, 2000);
}

function handleLoverRedirect() {
    // Adapte o URL para o redirecionamento desejado
    window.setTimeout(() => {
        window.location.href = '/attAm';
    }, 2000);
}


function handleProductorRedirect() {
    // Adapte o URL para o redirecionamento desejado
    window.setTimeout(() => {
        window.location.href = '/attProdutor';
    }, 2000);
}

function showToast(id) {
    var toastElList = [].slice.call(document.querySelectorAll(id));
    var toastList = toastElList.map(function (toastEl) {
        return new bootstrap.Toast(toastEl);
    });
    toastList.forEach((toast) => toast.show());
}
