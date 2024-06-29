import { db, collection, addDoc, getDocs } from './firebase.js';

$(document).ready(async function() {
    const commentForm = $('#comment-form');
    const commentsContainer = $('#comments-container');
    const prevCommentBtn = $('#prev-comment');
    const nextCommentBtn = $('#next-comment');
    let comments = [];
    let currentIndex = 0;

    // Función para obtener comentarios
    async function fetchComments() {
        commentsContainer.empty(); // Limpiar contenedor de comentarios
        const querySnapshot = await getDocs(collection(db, 'comentarios'));
        querySnapshot.forEach((doc) => {
            const comment = doc.data();
            comments.push(comment);
            displayComment(comment.nombre, comment.apellido, comment.comentario);
        });
        showCurrentComment();
    }

    // Función para mostrar un comentario en el HTML
    function displayComment(nombre, apellido, comentario) {
        const commentElement = $('<div>').addClass('comment').html(`
            <h3>${nombre} ${apellido}</h3>
            <p>${comentario}</p>
        `);
        commentsContainer.append(commentElement);
    }

    // Función para mostrar el comentario actual
    function showCurrentComment() {
        const angle = currentIndex * -90;
        commentsContainer.children().each((index, element) => {
            const offsetAngle = angle + index * 90;
            $(element).css('transform', `rotateY(${offsetAngle}deg) translateZ(250px)`);
        });
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
            comments.push({ nombre, apellido, comentario }); // Añadir comentario a la lista
            commentForm[0].reset(); // Limpiar el formulario
            showCurrentComment();
        } catch (error) {
            console.error('Error adding document: ', error);
        }
    });

    // Eventos para manejar las flechas de navegación
    prevCommentBtn.on('click', function() {
        if (currentIndex > 0) {
            currentIndex--;
            showCurrentComment();
        }
    });

    nextCommentBtn.on('click', function() {
        if (currentIndex < comments.length - 1) {
            currentIndex++;
            showCurrentComment();
        }
    });

    // Obtener y mostrar los comentarios al cargar la página
    await fetchComments();
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
