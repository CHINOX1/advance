import { db, collection, addDoc, getDocs } from './firebase.js';

$(document).ready(async function() {
    const commentForm = $('#comment-form');
    const commentsWrapper = $('#comments-wrapper');
    const addCommentBtn = $('#add-comment-btn');
    const commentSidebar = $('#comment-sidebar');
    let comments = [];
    let currentIndex = 0;
    const commentWidth = 250; // Ancho del comentario (sin incluir márgenes)
    const intervalTime = 3000; // Tiempo entre transiciones en milisegundos (3 segundos)

    // Función para obtener comentarios
    async function fetchComments() {
        commentsWrapper.empty(); // Limpiar contenedor de comentarios
        comments = [];
        const querySnapshot = await getDocs(collection(db, 'comentarios'));
        querySnapshot.forEach((doc) => {
            const comment = doc.data();
            comments.push(comment);
            displayComment(comment.nombre, comment.apellido, comment.comentario);
        });
        // Clonar los comentarios para que el carrusel sea cíclico
        cloneComments();
        startCarousel(); // Inicia el carrusel después de obtener los comentarios
    }

    // Función para mostrar un comentario en el HTML
    function displayComment(nombre, apellido, comentario) {
        const commentElement = $('<div>').addClass('comment').html(`
            <h3>${nombre} ${apellido}</h3>
            <p>${comentario}</p>
        `);
        commentsWrapper.append(commentElement);
    }

    // Clonar los comentarios para hacer el carrusel cíclico
    function cloneComments() {
        comments.forEach((comment) => {
            const commentElement = $('<div>').addClass('comment').html(`
                <h3>${comment.nombre} ${comment.apellido}</h3>
                <p>${comment.comentario}</p>
            `);
            commentsWrapper.append(commentElement);
        });
    }

    // Función para iniciar el carrusel
    function startCarousel() {
        const totalComments = comments.length;
        const totalWidth = commentWidth * totalComments * 2 + 10 * (totalComments * 2 - 1); // Ancho total del carrusel

        if (totalComments > 0) {
            setInterval(() => {
                currentIndex = (currentIndex + 1) % totalComments;
                const offset = currentIndex * (-commentWidth - 10); // Ancho del comentario más el espacio entre ellos
                commentsWrapper.css('transform', `translateX(${offset}px)`);
            }, intervalTime);
        }
    }

    // Evento para manejar el envío del formulario
    commentForm.on('submit', async function(e) {
        e.preventDefault();
        const nombre = $('#nombre').val();
        const apellido = $('#apellido').val();
        const comentario = $('#comentario').val();

        // Guardar comentario en Firebase
        try {
            await addDoc(collection(db, 'comentarios'), {
                nombre,
                apellido,
                comentario,
                timestamp: new Date()
            });
            displayComment(nombre, apellido, comentario); // Mostrar el comentario inmediatamente
            comments.push({ nombre, apellido, comentario }); // Añadir comentario al array
            cloneComments(); // Clonar los comentarios para mantener el carrusel cíclico
            $('#nombre').val('');
            $('#apellido').val('');
            $('#comentario').val('');
        } catch (error) {
            console.error('Error al agregar comentario: ', error);
        }
    });

    // Evento para mostrar el formulario de comentario
    addCommentBtn.on('click', function() {
        commentSidebar.toggleClass('open');
        if (commentSidebar.hasClass('open')) {
            commentSidebar.css('display', 'block');
        } else {
            commentSidebar.css('display', 'none');
        }
    });

    // Inicializar comentarios al cargar la página
    fetchComments();
});


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
document.addEventListener("DOMContentLoaded", function() {
    const links = document.querySelectorAll("a.nav-link");

    links.forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            const href = this.getAttribute("href");

            // Añadir la clase active para mostrar la transición
            const overlay = document.querySelector(".fade-overlay");
            overlay.classList.add("active");

            // Esperar 1 segundo antes de redirigir a la nueva página
            setTimeout(() => {
                window.location.href = href;
            }, 2000);
        });
    });
});
