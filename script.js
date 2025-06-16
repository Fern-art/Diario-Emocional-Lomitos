
let emociones = [];
let actividades = [];
let notas = [];

function registrar(estado) {
  emociones.push({ estado, fecha: new Date().toLocaleString() });
  mostrarRegistro();
}

function registrarActividad(actividad) {
  actividades.push({ actividad, fecha: new Date().toLocaleString() });
  mostrarRegistro();
}

function guardarNota() {
  const texto = document.getElementById("nota").value;
  if (texto) {
    notas.push({ texto, fecha: new Date().toLocaleString() });
    document.getElementById("nota").value = "";
    mostrarRegistro();
  }
}

function mostrarRegistro() {
  const registro = document.getElementById("registro");
  registro.innerHTML = "";
  emociones.slice().reverse().forEach(e => {
    const act = actividades.find(a => a.fecha === e.fecha);
    const nota = notas.find(n => n.fecha === e.fecha);
    registro.innerHTML += `<p><strong>${e.fecha}</strong> - Me sentí: ${e.estado} ${act ? " | Actividad: " + act.actividad : ""} ${nota ? "<br>Nota: " + nota.texto : ""}</p>`;
  });
}

function exportarPDF() {
  const contenido = document.getElementById("registro").innerText;
  const blob = new Blob([contenido], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "diario_emocional.pdf";
  link.click();
}

function mostrarGrafica() {
  const ctx = document.getElementById('grafica').getContext('2d');
  const etiquetas = [...new Set(emociones.map(e => e.estado))];
  const datos = etiquetas.map(e => emociones.filter(x => x.estado === e).length);

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: etiquetas,
      datasets: [{
        label: 'Frecuencia emocional',
        data: datos,
        backgroundColor: '#ffbb9e'
      }]
    }
  });
}
