document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loginForm');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Obtener el valor de la clave ingresada
        const clave = document.getElementById('clave').value;

        // Verificar si la clave es correcta ( "KINE0001")
        if (clave === 'KINE0001') {
            // Redirigir a la página deseada
            window.location.href = 'kineHora.html';
        } else {
            alert('Clave incorrecta. Por favor, intenta de nuevo.');
        }
    });
});
