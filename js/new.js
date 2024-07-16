
document.addEventListener('DOMContentLoaded', () => {
    const carousels = document.querySelectorAll('.carousel');

    carousels.forEach(carousel => {
        const slides = carousel.querySelectorAll('.slide');
        let activeIndex = 0;

        function showNextSlide() {
            slides[activeIndex].classList.remove('active');
            activeIndex = (activeIndex + 1) % slides.length;
            slides[activeIndex].classList.add('active');
        }

        setInterval(showNextSlide, 3000); // Cambiar de imagen cada 3 segundos
    });
});
