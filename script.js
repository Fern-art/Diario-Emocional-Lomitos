let registros = [];

function registrar(emocion) {
  document.body.dataset.emocion = emocion;
}

function mostrarComentarioPaseo() {
  const paseo = document.getElementById("paseo").value;
  const cont = document.getElementById("comentarioPaseoContainer");
  cont.style.display = paseo === "Sí" ? "block" : "none";
}

function guardarNota() {
  const emocion = document.body.dataset.emocion || "Sin seleccionar";
  const nota = document.getElementById("nota").value.trim();
  const paseo = document.getElementById("paseo").value;
  const comentario = paseo === "Sí" ? document.getElementById("comentarioPaseo").value.trim() : "";
  const fecha = new Date().toLocaleString();

  registros.push({ fecha, emocion, nota, paseo, comentario });
  actualizarRegistro();
  limpiarCampos();
}

function actualizarRegistro() {
  const registroDiv = document.getElementById("registro");
  registroDiv.innerHTML = registros.map(r =>
    `<p><strong>${r.fecha}</strong><br>Emoción: ${r.emocion}<br>Paseo: ${r.paseo}<br>${r.comentario ? "Comentario: " + r.comentario + "<br>" : ""}Nota: ${r.nota}</p><hr>`
  ).join("");
}

function limpiarCampos() {
  document.getElementById("nota").value = "";
  document.getElementById("paseo").value = "";
  document.getElementById("comentarioPaseo").value = "";
  document.getElementById("comentarioPaseoContainer").style.display = "none";
  document.body.dataset.emocion = "";
}

function exportarPDF() {
  const contenido = registros.map(r => 
    `${r.fecha}\nEmoción: ${r.emocion}\nPaseo: ${r.paseo}\n${r.comentario ? "Comentario: " + r.comentario + "\n" : ""}Nota: ${r.nota}\n\n`
  ).join("");
  const blob = new Blob([contenido], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "diario_lomito.txt";
  link.click();
}

function mostrarGrafica() {
  const emociones = {};
  registros.forEach(r => {
    emociones[r.emocion] = (emociones[r.emocion] || 0) + 1;
  });

  const ctx = document.getElementById("grafica").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(emociones),
      datasets: [{
        label: "Emociones registradas",
        data: Object.values(emociones),
        backgroundColor: "#ffa07a",
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: "Gráfica Emocional" }
      }
    }
  });
}

function exportarPalabrasClave() {
  const claves = {};
  registros.forEach(r => {
    if (r.comentario) {
      const palabras = r.comentario.toLowerCase().split(/[\s,;.]+/);
      palabras.forEach(p => {
        if (p.length > 3) {
          claves[p] = (claves[p] || 0) + 1;
        }
      });
    }
  });

  // Mostrar en gráfica
  const ctx = document.getElementById("graficaClaves").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(claves),
      datasets: [{
        label: "Palabras Clave del Paseo",
        data: Object.values(claves),
        backgroundColor: "#9acccd",
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: "Cómo me hace sentir mi lomito 🐶" }
      }
    }
  });

  // Exportar archivo
  const resumen = Object.entries(claves).map(([palabra, cuenta]) => `${palabra}: ${cuenta}`).join("\n");
  const blob = new Blob([resumen], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "palabras_clave_lomito.txt";
  link.click();
}
