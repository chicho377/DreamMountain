// js de la pagina de servicios
// Función para mostrar el modal de accesibilidad
document.getElementById('accesibilidadBtn').addEventListener('click', function() {
    document.getElementById('accesibilidadModal').style.display = 'flex';
});

document.querySelector('.close-modal').addEventListener('click', function() {
    document.getElementById('accesibilidadModal').style.display = 'none';
});

window.addEventListener('click', function(event) {
    let modal = document.getElementById('accesibilidadModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});
