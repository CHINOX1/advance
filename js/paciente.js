import { db } from './firebase.js';
import { collection, getDocs, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async function() {
    const fechaSelect = document.getElementById('fecha');
    const horaSelect = document.getElementById('hora');

    async function cargarFechasDisponibles() {
        try {
            const disponibilidadCollection = collection(db, 'disponibilidad');
            const disponibilidadSnapshot = await getDocs(disponibilidadCollection);
            const fechasDisponibles = [];

            disponibilidadSnapshot.forEach(doc => {
                fechasDisponibles.push(doc.id);
            });

            fechasDisponibles.forEach(fecha => {
                const option = document.createElement('option');
                option.value = fecha;
                option.textContent = fecha;
                fechaSelect.appendChild(option);
            });
        } catch (error) {
            console.error("Error al cargar las fechas disponibles:", error);
            alert("Ocurrió un error al cargar las fechas disponibles. Por favor, intenta de nuevo.");
        }
    }

    async function cargarHorasDisponibles(fecha) {
        try {
            const disponibilidadDocRef = doc(db, 'disponibilidad', fecha);
            const disponibilidadDoc = await getDoc(disponibilidadDocRef);

            if (disponibilidadDoc.exists()) {
                const horasDisponibles = disponibilidadDoc.data().horas;
                horaSelect.innerHTML = ''; 

                horasDisponibles.forEach(hora => {
                    const option = document.createElement('option');
                    option.value = hora;
                    option.textContent = hora;
                    horaSelect.appendChild(option);
                });
            } else {
                console.log("No se encontró disponibilidad para la fecha:", fecha);
                horaSelect.innerHTML = '<option value="">No hay horas disponibles</option>';
            }
        } catch (error) {
            console.error("Error al cargar las horas disponibles:", error);
            alert("Ocurrió un error al cargar las horas disponibles. Por favor, intenta de nuevo.");
        }
    }

    fechaSelect.addEventListener('change', function() {
        const fechaSeleccionada = fechaSelect.value;
        if (fechaSeleccionada) {
            cargarHorasDisponibles(fechaSeleccionada);
        } else {
            horaSelect.innerHTML = '<option value="">Selecciona una fecha primero</option>';
        }
    });

    cargarFechasDisponibles();

    document.getElementById('reservaForm').addEventListener('submit', async function(event) {
        event.preventDefault();

        const correo = document.getElementById('correo').value;
        const fecha = fechaSelect.value;
        const hora = horaSelect.value;

        if (!fecha || !hora) {
            alert("Por favor, selecciona una fecha y una hora disponibles.");
            return;
        }

        try {
            await setDoc(doc(collection(db, 'reservado'), `${fecha}_${hora}`), {
                correo,
                fecha,
                hora,
                confirmada: false
            });

            console.log(`Correo: ${correo}, Fecha: ${fecha}, Hora: ${hora}`);
            alert("Cita reservada con éxito. Se ha enviado un correo de confirmación.");

            this.reset();
        } catch (error) {
            console.error("Error al reservar la cita:", error);
            alert("Ocurrió un error al reservar la cita. Por favor, intenta de nuevo.");
        }
    });
});
