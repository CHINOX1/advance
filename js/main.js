import { db } from './firebase.js';
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', async () => {
    const tbodyDatos = document.getElementById('tbodyDatos');
    const tbodySesiones = document.getElementById('tbodySesiones');

    try {
        // Obtener rut de la URL
        const urlParams = new URLSearchParams(window.location.search);
        const rut = urlParams.get('rut');

        if (!rut) {
            throw new Error("RUT no encontrado en la URL");
        }

        // Buscar informes médicos por el rut
        const informesQuery = query(collection(db, 'informes_medicos'), where('rut', '==', rut));
        const informesSnapshot = await getDocs(informesQuery);
        
        let informeData = null;
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

            // Almacenar los datos del informe para uso posterior
            informeData = data;
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
                <td>${data.rut}</td>
                <td>${data.sesion}</td>
                <td>${data.fecha}</td>
                <td>${data.evolucion}</td>
                <td>${data.dolor_reposo}</td>
                <td>${data.dolor_movimiento}</td>
                <td>${data.rango_articular}</td>
                <td>${data.evaluacion_muscular}</td>
                <td>${data.tratamiento_kinesico}</td>
            `;
            // Agregar la fila a la tabla
            tbodySesiones.appendChild(filaSesion);
        });

        // Asignar el evento de clic al botón de informe después de obtener los datos
        document.getElementById('btnDescargarInforme').addEventListener('click', () => {
            if (informeData) {
                crearInformePDF(
                    informeData.nombre,
                    informeData.rut,
                    informeData.edad,
                    informeData.motivo_consulta,
                    informeData.enfermedad_actual,
                    informeData.examen_fisico,
                    informeData.diagnostico,
                    informeData.indicaciones
                );
            } else {
                console.error('No se encontró ningún informe médico para el RUT proporcionado.');
            }
        });

        // Asignar el evento de clic al botón de sesiones después de obtener los datos
        document.getElementById('btnDescargarSesiones').addEventListener('click', () => {
            descargarSesionesPDF();
        });

    } catch (error) {
        console.error('Error al obtener los datos desde Firebase:', error);
    }
});

export function crearInformePDF(nombre, rut, edad, motivo_consulta, enfermedad_actual, examen_fisico, diagnostico, indicaciones) {
    const { jsPDF } = window.jspdf;

    // Crear documento PDF
    const doc = new jsPDF();

    // Agregar encabezado con la fecha actual
    const fecha_actual = new Date().toLocaleDateString();
    doc.text(`Fecha: ${fecha_actual}`, 20, 20);

    // Agregar información del paciente
    doc.text(`Nombre: ${nombre || ''}`, 20, 30);
    doc.text(`RUT: ${rut || ''}`, 20, 40);
    doc.text(`Edad: ${edad || ''}`, 20, 50);

    // Agregar título "Informe Médico"
    doc.setFontSize(18);
    doc.text('INFORME MÉDICO', 105, 65, { align: 'center' });

    // Agregar sección de motivo de consulta
    doc.setFontSize(12);
    doc.text('Motivo de Consulta', 20, 80);
    doc.text(motivo_consulta || '', 20, 90);

    // Agregar sección de enfermedad actual
    doc.text('Enfermedad Actual', 20, 120);
    doc.text(enfermedad_actual || '', 20, 130);

    // Agregar sección de examen físico
    doc.text('Examen Físico', 20, 160);
    doc.text(examen_fisico || '', 20, 170);

    // Agregar sección de diagnóstico
    doc.text('Diagnóstico', 20, 200);
    doc.text(diagnostico || '', 20, 210);

    // Agregar sección de indicaciones
    doc.text('Indicaciones', 20, 240);
    doc.text(indicaciones || '', 20, 250);

    // Agregar firma del médico centrada
    doc.text('Dr. [Nombre del Médico]', 105, doc.internal.pageSize.height - 30, { align: 'center' });
    doc.text('Traumatología y Ortopedia', 105, doc.internal.pageSize.height - 20, { align: 'center' });

    // Guardar el documento PDF
    doc.save('InformeMedico.pdf');
}

export function descargarSesionesPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('l', 'pt'); // 'l' para orientación de página horizontal

    doc.text(100, 20, 'Sesiones Médicas');

    const element = document.getElementById('tablaSesiones');
    doc.autoTable({
        html: element,
        margin: { top: 30 },
        startY: 40,
    });

    doc.save('SesionesMedicas.pdf');
}
