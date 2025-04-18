// js del modal del login
document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const loginMessage = document.getElementById("loginMessage");

    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            // obtiene los valores del formulario
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            // valida las credenciales
            if (username === "admin" && password === "admin") {
                // Muestra un mensaje de éxito
                loginMessage.textContent = "¡Inicio de sesión exitoso!";
                loginMessage.style.color = "green";

                // redirige al dashboard despues de 1 segundo
                setTimeout(() => {
                    window.location.href = "dashBoard.php";
                }, 1000);
            } else {
                // muestra un mensaje de error
                loginMessage.textContent = "Usuario o contraseña incorrectos.";
                loginMessage.style.color = "red";
            }
        });
    }
});