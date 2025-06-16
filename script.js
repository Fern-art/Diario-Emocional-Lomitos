
let registros = [];

function registrar(emocion) {
  const paseo = document.getElementById('paseo').value;
  const fecha = new Date().toLocaleString();
  registros.push({ fecha, emocion, paseo, nota: '' });
  actualizarRegistro();
}

function guardarNota() {
  const nota = document.getElementById('nota').value;
  if (registros.length > 0) {
    registros[registros.length - 1].nota = nota;
    document.getElementById('nota').value = '';
    actualizarRegistro();
  } else {
    alert('Primero selecciona una emoción.');
  }
}

function actualizarRegistro() {
  const contenedor = document.getElementById('registro');
  contenedor.innerHTML = registros.map(r =>
    `<p><strong>${r.fecha}</strong><br>Emoción: ${r.emocion}<br>Paseo con lomito: ${r.paseo}<br>Nota: ${r.nota}</p>`
  ).join('');
}

function exportarPDF() {
  const contenido = registros.map(r => `Fecha: ${r.fecha}\nEmoción: ${r.emocion}\nPaseo con lomito: ${r.paseo}\nNota: ${r.nota}\n\n`).join('');
  const blob = new Blob([contenido], { type: 'text/plain' });
  const enlace = document.createElement('a');
  enlace.href = URL.createObjectURL(blob);
  enlace.download = 'diario_emocional.txt';
  enlace.click();
}

function mostrarGrafica() {
  const ctx = document.getElementById('grafica').getContext('2d');
  const conteo = {};
  registros.forEach(r => {
    conteo[r.emocion] = (conteo[r.emocion] || 0) + 1;
  });

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(conteo),
      datasets: [{
        label: 'Frecuencia emocional',
        data: Object.values(conteo),
        backgroundColor: '#ffbb9e'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: 'Resumen Emocional' }
      }
    }
  });
}
