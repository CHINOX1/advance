import { db, collection, addDoc, getDocs } from './firebase.js';
$(document).ready(async function() {
    const commentForm = $('#comment-form');
    const commentsWrapper = $('#comments-wrapper');
    const addCommentBtn = $('#add-comment-btn');
    const commentSidebar = $('#comment-sidebar');
    const gifSelector = $('#gif-selector');
    let comments = [];
    let currentIndex = 0;
    const commentWidth = 340; 
    const intervalTime = 3000; 
    let isFirstLoad = true; 

    // Función para obtener comentarios
    async function fetchComments() {
        commentsWrapper.empty(); // Limpiar contenedor de comentarios
        comments = [];
        const querySnapshot = await getDocs(collection(db, 'comentarios'));
        querySnapshot.forEach((doc) => {
            const comment = doc.data();
            comments.push(comment);
            displayComment(comment.nombre, comment.apellido, comment.comentario, comment.gif);
        });
        
        if (isFirstLoad) {
            // Clonar los comentarios solo en la primera carga
            cloneComments();
            isFirstLoad = false;
        }

        startCarousel(); // Inicia el carrusel después de obtener los comentarios
    }

    // Función para mostrar un comentario en el HTML
    function displayComment(nombre, apellido, comentario, gif) {
        const commentElement = $('<div>').addClass('comment').html(`
            <div class="comment-inner">
                <div class="comment-front">
                    <img src="${gif}" alt="GIF">
                </div>
                <div class="comment-back">
                    <h3>${nombre} ${apellido}</h3>
                    <p>${comentario}</p>
                </div>
            </div>
        `);
        commentsWrapper.append(commentElement);
    }

    // Clonar los comentarios para hacer el carrusel cíclico
    function cloneComments() {
        comments.forEach((comment) => {
            const commentElement = $('<div>').addClass('comment').html(`
                <div class="comment-inner">
                    <div class="comment-front">
                        <img src="${comment.gif}" alt="GIF">
                    </div>
                    <div class="comment-back">
                        <h3>${comment.nombre} ${comment.apellido}</h3>
                        <p>${comment.comentario}</p>
                    </div>
                </div>
            `);
            commentsWrapper.append(commentElement.clone()); // Clona el comentario
        });
    }

    // Inicia el carrusel
    function startCarousel() {
        setInterval(() => {
            currentIndex = (currentIndex + 1) % comments.length;
            const offset = -currentIndex * commentWidth;
            commentsWrapper.css('transform', `translateX(${offset}px)`);
        }, intervalTime);
    }


    // Manejar el envío del formulario
    commentForm.on('submit', async (event) => {
        event.preventDefault();
        const nombre = $('#nombre').val();
        const apellido = $('#apellido').val();
        const comentario = $('#comentario').val();
        const gif = $('#gif-selector').val(); // Asume que gif-selector es un <select> con opciones de GIFs
        
        await addDoc(collection(db, 'comentarios'), {
            nombre: nombre,
            apellido: apellido,
            comentario: comentario,
            gif: gif
        });

        commentForm[0].reset(); // Limpiar formulario
        commentSidebar.hide(); // Ocultar el formulario
        fetchComments(); // Refrescar comentarios
    });

    // Manejar el clic en los comentarios para voltear la carta
    commentsWrapper.on('click', '.comment', function() {
        $(this).toggleClass('flip');
    });

    // Cargar comentarios al iniciar
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
            event.preventDefault(); // Evita el comportamiento por defecto del enlace
            const href = this.getAttribute("href");

            // Añadir la clase active para mostrar la transición
            const overlay = document.querySelector(".fade-overlay");
            if (overlay) {
                console.log("Overlay encontrado. Agregando clase active.");
                overlay.classList.add("active");

                // Forzar un reflujo para asegurarse de que el navegador procese el cambio
                requestAnimationFrame(() => {
                    // Esperar un tiempo para mostrar la animación antes de redirigir
                    setTimeout(() => {
                        console.log("Redirigiendo a la nueva página:", href);
                        window.location.href = href; // Redirige a la nueva página
                    }, 1000); // Ajusta este tiempo según la duración de tu animación
                });
            } else {
                console.error("Overlay no encontrado.");
            }
        });
    });
});


$(document).ready(function() {
    $('.card').on('click', function() {
        $(this).find('.card-inner').toggleClass('flipped');
    });

    $('#add-comment-btn').on('click', function() {
        $('#comment-sidebar').fadeIn();
    });

    $('#comment-form').on('submit', function(e) {
        e.preventDefault();
        // Aquí va la lógica para enviar el comentario
        $('#comment-sidebar').fadeOut();
    });

    $('.fade-overlay').fadeIn(1000).delay(2000).fadeOut(1000);
});



$(document).ready(function() {
    const gifSelector = $('#gif-selector');
    const gifPreviewImg = $('#gif-preview-img');

    // Actualiza la vista previa del GIF cuando se cambia la selección
    gifSelector.on('change', function() {
        const selectedGif = $(this).val();
        gifPreviewImg.attr('src', selectedGif);
    });

    // Inicializar vista previa con el GIF predeterminado
    gifPreviewImg.attr('src', gifSelector.val());
});
document.addEventListener("DOMContentLoaded", function() {
    const addCommentBtn = document.getElementById("add-comment-btn");
    const commentSidebar = document.getElementById("comment-sidebar");

    addCommentBtn.addEventListener("click", function() {
        if (commentSidebar.classList.contains("open")) {
            // Si el sidebar está abierto, ciérralo
            commentSidebar.classList.remove("open");
            setTimeout(() => {
                commentSidebar.style.display = "none"; // Oculta el sidebar después de la animación
            }, 300); // Tiempo de la transición
        } else {
            // Si el sidebar está cerrado, ábrelo
            commentSidebar.style.display = "block"; // Muestra el sidebar
            setTimeout(() => {
                commentSidebar.classList.add("open");
            }, 10); // Pequeño retraso para asegurarse de que la transición se aplique
        }
    });
});
