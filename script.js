let registros = [];
let palabrasClaves = {};

function registrar(emocion) {
  const fecha = new Date().toLocaleString();
  registros.push({ emocion, fecha });
  mostrarRegistro();
}

function mostrarComentarioPaseo() {
  const paseo = document.getElementById("paseo").value;
  const extra = document.getElementById("extraComentario");
  extra.style.display = paseo === "sí" ? "block" : "none";
}

function guardarNota() {
  const nota = document.getElementById("nota").value;
  const paseo = document.getElementById("paseo").value;
  const comentarioLomito = document.getElementById("comentarioLomito").value;
  const fecha = new Date().toLocaleString();
  if (comentarioLomito) {
    extraerPalabrasClave(comentarioLomito);
  }
  registros.push({ nota, paseo, comentarioLomito, fecha });
  mostrarRegistro();
}

function mostrarRegistro() {
  const div = document.getElementById("registro");
  div.innerHTML = "";
  registros.forEach((reg, i) => {
    div.innerHTML += `<p><strong>[${reg.fecha}]</strong><br>Emoción: ${reg.emocion || '-'}<br>Nota: ${reg.nota || '-'}<br>Paseo: ${reg.paseo || '-'}<br>Comentario: ${reg.comentarioLomito || '-'}</p>`;
  });
}

function mostrarGrafica() {
  const emociones = registros.map(r => r.emocion).filter(Boolean);
  const conteo = {};
  emociones.forEach(e => conteo[e] = (conteo[e] || 0) + 1);

  const ctx = document.getElementById("grafica").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(conteo),
      datasets: [{
        label: "Frecuencia emocional",
        data: Object.values(conteo),
        backgroundColor: "#d65a31"
      }]
    }
  });
}

function extraerPalabrasClave(texto) {
  const claves = ["feliz", "amada", "tranquila", "agradecido", "menos ansioso", "acompañado", "relajada", "animado", "en paz", "mejor", "cuidado", "contento", "menos sola", "conectada", "ayudó", "sonreí", "mi día cambió"];
  claves.forEach(palabra => {
    if (texto.toLowerCase().includes(palabra)) {
      palabrasClaves[palabra] = (palabrasClaves[palabra] || 0) + 1;
    }
  });
}

function exportarPalabrasClave() {
  const ctx = document.getElementById("graficaClaves").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(palabrasClaves),
      datasets: [{
        label: "Palabras Clave Emocionales",
        data: Object.values(palabrasClaves),
        backgroundColor: "#a3c9a8"
      }]
    }
  });

  const blob = new Blob([JSON.stringify(palabrasClaves, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "palabras_clave.json";
  link.click();
}

function exportarPDF() {
  alert("Funcionalidad de exportación PDF aún no implementada aquí.");
}
