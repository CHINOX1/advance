document.addEventListener("DOMContentLoaded", function() {
    const slides = document.querySelectorAll(".slide");
    let currentSlide = 0;
    const slideInterval = 2000; // Intervalo de cambio de imagen en milisegundos

    function nextSlide() {
        slides[currentSlide].classList.remove("active");
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add("active");
    }

    // Función para avanzar las diapositivas automáticamente
    setInterval(nextSlide, slideInterval);
});
