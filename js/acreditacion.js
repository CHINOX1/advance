

function openModal(imageSrc) {
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modal-image');
    modal.style.display = 'block';
    modalImage.src = imageSrc;
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// Cierra el modal si se hace clic fuera de la imagen
window.onclick = function(event) {
    if (event.target == document.getElementById('modal')) {
        closeModal();
    }
}
