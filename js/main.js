
import { db } from './firebase.js';
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', async () => {
    const tbodyDatos = document.getElementById('tbodyDatos');
    const tbodySesiones = document.getElementById('tbodySesiones');

    try {
        // Obtener rut de la URL
        const urlParams = new URLSearchParams(window.location.search);
        const rut = urlParams.get('rut');

        // Buscar informes médicos por el rut
        const informesQuery = query(collection(db, 'informes_medicos'), where('rut', '==', rut));
        const informesSnapshot = await getDocs(informesQuery);
        informesSnapshot.forEach(doc => {
            const data = doc.data();
            const filaDato = document.createElement('tr');
            filaDato.innerHTML = `
                <td>${data.nombre}</td>
                <td>${data.rut}</td>
                <td>${data.edad}</td>
                <td>${data.fecha}</td>
                <td>${data.motivo_consulta}</td>
                <td>${data.enfermedad_actual}</td>
                <td>${data.examen_fisico}</td>
                <td>${data.diagnostico}</td>
                <td>${data.indicaciones}</td>
            `;
            tbodyDatos.appendChild(filaDato);
        });

        // Buscar sesiones médicas por el rut
        const sesionesQuery = query(collection(db, 'sesiones'), where('rut', '==', rut));
        const sesionesSnapshot = await getDocs(sesionesQuery);

        // Limpiar tabla antes de agregar nuevas sesiones
        tbodySesiones.innerHTML = '';

        sesionesSnapshot.forEach(doc => {
            const data = doc.data(); // Datos de la sesión

            // Crear una nueva fila para la tabla
            const filaSesion = document.createElement('tr');
            filaSesion.innerHTML = `
                <td>${data.fecha}</td>
                <td>${data.sesion}</td>
                <td>${data.rut}</td>
                <td>${data.medico}</td>
                <td>${data.evolucion}</td>
                <td>${data.examen_fisico}</td>
                <td>${data.actitud_funcional}</td>
                <td>${data.dolor_movimiento}</td>
                <td>${data.dolor_reposo}</td>
                <td>${data.evaluacion_muscular}</td>
                <td>${data.medicion_articular}</td>
                <td>${data.fuerza_muscular}</td>
                <td>${data.observaciones}</td>
            `;
            // Agregar la fila a la tabla
            tbodySesiones.appendChild(filaSesion);
        });

    } catch (error) {
        console.error('Error al obtener los datos desde Firebase:', error);
    }
});

export function descargarInformePDF() {
    const doc = new jsPDF();
    doc.text(20, 20, 'Informe Médico');

    const element = document.getElementById('tablaDatos');
    doc.autoTable({ html: element });

    doc.save('InformeMedico.pdf');
}

export function descargarSesionesPDF() {
    const doc = new jsPDF();
    doc.text(20, 20, 'Sesiones Médicas');

    const element = document.getElementById('tablaSesiones');
    doc.autoTable({ html: element });

    doc.save('SesionesMedicas.pdf');
}

// Asignar los eventos de clic a los botones
