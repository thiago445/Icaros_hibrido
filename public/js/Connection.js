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
                const NewUser = userDetails.newUser;
                // Redirecionamento baseado no tipo de usuário
                if (userType === 1) {
                    handleMusicianRedirect(NewUser);
                } else if (userType === 2) {
                    handleLoverRedirect(NewUser);
                } else if (userType === 3) {
                    handleProductorRedirect(NewUser);
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

function handleMusicianRedirect(NewUser) {
    if (NewUser) {
        window.setTimeout(() => {
            window.location.href = '/attMusico';
        }, 2000);
    } else {
        window.setTimeout(() => {
            window.location.href = '/portifolio-musico';
        }, 2000);
    }
    // Adapte o URL para o redirecionamento desejado

}

function handleLoverRedirect(NewUser) {
    if (NewUser) {
        window.setTimeout(() => {
            window.location.href = '/attAm';
        }, 2000);
    } else {
        window.setTimeout(() => {
            window.location.href = '/portifolio-am';
        }, 2000);
    }
}


function handleProductorRedirect(NewUser) {
    // Adapte o URL para o redirecionamento desejado
    if (NewUser === true) {
        window.setTimeout(() => {
            window.location.href = '/attProdutor';
        }, 2000);
    } else {
        window.setTimeout(() => {
            window.location.href = '/portifolio-produtor';
        }, 2000);
    }
}

function showToast(id) {
    var toastElList = [].slice.call(document.querySelectorAll(id));
    var toastList = toastElList.map(function (toastEl) {
        return new bootstrap.Toast(toastEl);
    });
    toastList.forEach((toast) => toast.show());
}
