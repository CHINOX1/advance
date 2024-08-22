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
                <td>${data.apellidos}</td>
                <td>${data.rut}</td>
                <td>${data.edad}</td>
                <td>${data.fecha}</td>
                <td>${data.fechaingreso}</td>
                <td>${data.prevision}</td>
                <td>${data.medicotratante}</td>
                <td>${data.antecedentes_morbidos}</td>
                <td>${data.motivo_consulta}</td>
                <td>${data.anamnesis_actual}</td>
                <td>${data.cirugia}</td>
                <td>${data.examen_fisico}</td>
                <td>${data.diagnostico_medico}</td>
                <td>${data.indicaciones_medicas}</td>
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
                    informeData.apellidos,
                    informeData.rut,
                    informeData.edad,
                    informeData.fecha,
                    informeData.fechaingreso,
                    informeData.prevision,
                    informeData.medicotratante,
                    informeData.antecedentes_morbidos,
                    informeData.motivo_consulta,
                    informeData.anamnesis_actual,
                    informeData.cirugia,
                    informeData.examen_fisico,
                    informeData.diagnostico_medico,
                    informeData.indicaciones_medicas
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

export function crearInformePDF(
    nombre,
    apellidos,
    rut,
    edad,
    fecha,
    fechaingreso,
    prevision,
    medicotratante,
    antecedentes_morbidos,
    motivo_consulta,
    anamnesis_actual,
    cirugia,
    examen_fisico,
    diagnostico_medico,
    indicaciones_medicas
) {
    const { jsPDF } = window.jspdf;

    // Crear documento PDF
    const doc = new jsPDF();

    // Configurar el tamaño de fuente
    const fontSize = 10;
    doc.setFontSize(fontSize);

    // Ajustar márgenes y altura máxima de página
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let y = margin;

    // Función para manejar el salto de página
    const checkPageHeight = (increment) => {
        if (y + increment > pageHeight - margin) {
            doc.addPage();
            y = margin;
        }
    };

    // Agregar encabezado con la fecha actual
    const fecha_actual = new Date().toLocaleDateString();
    doc.text(`Fecha: ${fecha_actual}`, margin, y);
    y += 10;

    // Agregar información del paciente
    const patientInfo = [
        `Nombre: ${nombre || ''} ${apellidos || ''}`,
        `RUT: ${rut || ''}`,
        `Edad: ${edad || ''}`,
        `Fecha: ${fecha || ''}`,
        `Fecha de Ingreso: ${fechaingreso || ''}`,
        `Previsión: ${prevision || ''}`,
        `Médico Tratante: ${medicotratante || ''}`,
        `Antecedentes Mórbidos: ${antecedentes_morbidos || ''}`
    ];

    patientInfo.forEach((line) => {
        checkPageHeight(10);
        doc.text(line, margin, y);
        y += 10;
    });

    y += 10;

    // Agregar título "Informe Médico"
    doc.setFontSize(14);
    doc.text('INFORME MÉDICO', pageWidth / 2, y, { align: 'center' });
    y += 15;
    doc.setFontSize(fontSize);

    // Función para agregar secciones con texto dividido
    const addSection = (title, text) => {
        checkPageHeight(15);
        doc.text(title, margin, y);
        y += 10;
        const splitText = doc.splitTextToSize(text || '', pageWidth - margin * 2);
        splitText.forEach((line) => {
            checkPageHeight(10);
            doc.text(line, margin, y);
            y += 10;
        });
        y += 10;
    };

    // Agregar secciones al informe
    addSection('Motivo de Consulta', motivo_consulta);
    addSection('Anamnesis Actual', anamnesis_actual);
    addSection('Cirugía', cirugia);
    addSection('Examen Físico', examen_fisico);
    addSection('Diagnóstico Médico', diagnostico_medico);
    addSection('Indicaciones Médicas', indicaciones_medicas);

    // Agregar firma del médico centrada
    checkPageHeight(20);
    doc.text('Dr. [ZAUL CUELLO CAMPILLAY]', pageWidth / 2, y, { align: 'center' });
    y += 10;
    doc.text('Traumatología y Ortopedia', pageWidth / 2, y, { align: 'center' });

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
