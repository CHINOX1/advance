import { db } from './firebase.js';
import { collection, doc, setDoc, getDocs, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Obtener referencia al formulario y elementos del DOM
const disponibilidadForm = document.getElementById('disponibilidadForm');
const semanaInput = document.getElementById('semana');
const diasDisponiblesContainer = document.getElementById('diasDisponibles');
const horasDisponiblesContainer = document.getElementById('horasDisponibles');
const verReservasButton = document.getElementById('verReservas');
const reservasContainer = document.getElementById('reservasContainer');

// Manejo del formulario de disponibilidad
disponibilidadForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const semana = semanaInput.value;
    const diasSeleccionados = obtenerDiasSeleccionados();
    const horasSeleccionadas = obtenerHorasSeleccionadas();

    if (diasSeleccionados.length === 0 || horasSeleccionadas.length === 0) {
        alert("Por favor, selecciona al menos un día y una hora disponible.");
        return;
    }

    const fechasSemana = obtenerFechasSemana(semana);
    try {
        for (const dia of diasSeleccionados) {
            const fecha = fechasSemana[dia];
            if (!fecha) {
                console.error(`Fecha no encontrada para el día: ${dia}`);
                continue;
            }
            await setDoc(doc(db, 'disponibilidad', fecha), {
                fecha: fecha,
                horas: horasSeleccionadas
            });
            console.log("Disponibilidad guardada con éxito para " + fecha);
        }
        alert("Disponibilidad guardada con éxito para la semana.");
        limpiarFormulario();
    } catch (error) {
        console.error("Error al guardar la disponibilidad:", error);
        alert("Ocurrió un error al guardar la disponibilidad. Por favor, intenta de nuevo.");
    }
});

function obtenerDiasSeleccionados() {
    const diasSeleccionados = [];
    const checkboxes = document.querySelectorAll('#diasDisponibles input[type="checkbox"]:checked');
    checkboxes.forEach(checkbox => {
        diasSeleccionados.push(checkbox.value);
    });
    return diasSeleccionados;
}

function obtenerHorasSeleccionadas() {
    const horasSeleccionadas = [];
    const checkboxes = document.querySelectorAll('#horasDisponibles input[type="checkbox"]:checked');
    checkboxes.forEach(checkbox => {
        horasSeleccionadas.push(checkbox.value);
    });
    return horasSeleccionadas;
}

function obtenerFechasSemana(semana) {
    const [año, numSemana] = semana.split('-W');
    const primerDiaDelAño = new Date(parseInt(año), 0, 1);
    const primerDiaSemana = new Date(primerDiaDelAño.setDate(primerDiaDelAño.getDate() + (numSemana - 1) * 7));
    const dayOfWeek = primerDiaSemana.getDay();
    const firstDayOfWeek = new Date(primerDiaSemana.setDate(primerDiaSemana.getDate() - dayOfWeek + 1));
    const fechas = {};
    const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

    for (let i = 0; i < 7; i++) {
        const fecha = new Date(firstDayOfWeek);
        fecha.setDate(fecha.getDate() + i);
        fechas[dias[i]] = fecha.toISOString().split('T')[0];
    }
    return fechas;
}

function limpiarFormulario() {
    semanaInput.value = '';
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const semanaInput = document.getElementById('semana');
    const checkboxesContainer = document.getElementById('horasDisponibles');

    semanaInput.style.fontSize = '16px'; 
    semanaInput.style.padding = '10px'; 

    checkboxesContainer.classList.add('horizontal-checkboxes');
});

verReservasButton.addEventListener('click', async function() {
    try {
        const reservasSnapshot = await getDocs(collection(db, 'reservado'));
        let tableHtml = '<table><tr><th>Fecha</th><th>Hora</th><th>Correo</th><th>Confirmar</th></tr>';
        reservasSnapshot.forEach(doc => {
            const reserva = doc.data();
            tableHtml += `
                <tr>
                    <td>${reserva.fecha}</td>
                    <td>${reserva.hora}</td>
                    <td>${reserva.correo}</td>
                    <td><button onclick="confirmarCita('${doc.id}')">Confirmar</button></td>
                </tr>
            `;
        });
        tableHtml += '</table>';
        reservasContainer.innerHTML = tableHtml;
    } catch (error) {
        console.error("Error al cargar las reservas:", error);
        alert("Ocurrió un error al cargar las reservas. Por favor, intenta de nuevo.");
    }
});

async function confirmarCita(reservaId) {
    try {
        const reservaRef = doc(db, 'reservado', reservaId);
        await updateDoc(reservaRef, { confirmada: true });
        alert("Cita confirmada con éxito.");
        verReservasButton.click(); 
    } catch (error) {
        console.error("Error al confirmar la cita:", error);
        alert("Ocurrió un error al confirmar la cita. Por favor, intenta de nuevo.");
    }
}
