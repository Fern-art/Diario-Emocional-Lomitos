let registros = [];
let emociones = [];
let fechas = [];

function registrar(emocion) {
  const fecha = new Date().toLocaleDateString();
  emociones.push(emocion);
  fechas.push(fecha);

  const entrada = {
    fecha: fecha,
    emocion: emocion,
    actividadLomito: '',
    nota: ''
  };

  registros.push(entrada);
  mostrarRegistro();
  guardarEnLocalStorage();
}

function registrarLomito(actividad) {
  const ultima = registros[registros.length - 1];
  if (ultima) {
    ultima.actividadLomito = actividad;
    mostrarRegistro();
    guardarEnLocalStorage();
  } else {
    alert("Primero registra cómo te sientes hoy 🧡");
  }
}

function guardarNota() {
  const nota = document.getElementById("nota").value;
  if (nota.trim() === "") return;

  const ultima = registros[registros.length - 1];
  if (ultima) {
    ultima.nota = nota;
    mostrarRegistro();
    guardarEnLocalStorage();
    document.getElementById("nota").value = "";
  } else {
    alert("Primero registra tu emoción del día.");
  }
}

function mostrarRegistro() {
  const div = document.getElementById("registro");
  div.innerHTML = "";

  registros.slice().reverse().forEach((item, i) => {
    const entrada = document.createElement("div");
    entrada.innerHTML = `
      <p><strong>${item.fecha}</strong> - Emoción: ${item.emocion} 
      ${item.actividadLomito ? " | 🐾 Lomito: " + item.actividadLomito : ""}
      ${item.nota ? "<br>📝 Nota: " + item.nota : ""}</p><hr>`;
    div.appendChild(entrada);
  });
}

function exportarPDF() {
  const contenido = registros.map(r => {
    return `${r.fecha}\nEmoción: ${r.emocion}\nLomito: ${r.actividadLomito || '---'}\nNota: ${r.nota || '---'}\n`;
  }).join("\n----------------------\n");

  const blob = new Blob([contenido], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "diario_emocional_lomito.pdf";
  link.click();
  URL.revokeObjectURL(url);
}

function mostrarGrafica() {
  const ctx = document.getElementById("grafica").getContext("2d");

  const conteo = {};
  emociones.forEach(e => {
    conteo[e] = (conteo[e] || 0) + 1;
  });

  const data = {
    labels: Object.keys(conteo),
    datasets: [{
      label: 'Frecuencia Emocional',
      data: Object.values(conteo),
      backgroundColor: ['#f4a261', '#e76f51', '#2a9d8f', '#e9c46a', '#264653', '#ffb4a2'],
      borderWidth: 1
    }]
  };

  new Chart(ctx, {
    type: 'bar',
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: 'Gráfica de emociones' }
      }
    }
  });
}

function guardarEnLocalStorage() {
  localStorage.setItem("registrosLomito", JSON.stringify(registros));
}

function cargarDesdeLocalStorage() {
  const data = JSON.parse(localStorage.getItem("registrosLomito"));
  if (data) {
    registros = data;
    emociones = data.map(e => e.emocion);
    fechas = data.map(e => e.fecha);
    mostrarRegistro();
  }
}

window.onload = cargarDesdeLocalStorage;