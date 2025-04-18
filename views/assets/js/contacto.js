// js de la pagina de contacto
// Validación del formulario de contacto
document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    let isValid = true;

    // validacion de nombre
    let name = document.getElementById('name').value.trim();
    if (name === "") {
        document.getElementById('nameError').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('nameError').style.display = 'none';
    }

    // validacion de correo
    let email = document.getElementById('email').value.trim();
    let emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,6}$/;
    if (!email.match(emailPattern)) {
        document.getElementById('emailError').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('emailError').style.display = 'none';
    }

    // validacion de telefono
    let phone = document.getElementById('phone').value.trim();
    if (phone === "") {
        document.getElementById('phoneError').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('phoneError').style.display = 'none';
    }

    // validacion de mensaje
    let message = document.getElementById('message').value.trim();
    if (message === "") {
        document.getElementById('messageError').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('messageError').style.display = 'none';
    }

    if (isValid) {
        alert('Mensaje enviado con éxito.');
        document.getElementById('contactForm').reset();
    }
});
