// script: trans.js

// Función para mostrar la transición
function showTransition() {
    const overlay = document.querySelector('.fade-overlay');
    overlay.classList.add('active');
    setTimeout(() => {
        overlay.classList.remove('active');
    }, 3000); // El tiempo que dura la transición en milisegundos
}

// Llamar a la función cuando sea necesario
document.addEventListener('DOMContentLoaded', () => {
    showTransition();
});
