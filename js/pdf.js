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
