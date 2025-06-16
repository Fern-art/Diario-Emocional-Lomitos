let registros = [];

flatpickr("#fecha", {
  dateFormat: "Y-m-d",
  defaultDate: new Date()
});

function registrar(emocion) {
  document.getElementById("nota").value = emocion + " - " + document.getElementById("nota").value;
}

function responderPaseo(salio) {
  const respuesta = salio
    ? "¡Qué bien! 🐾 ¡Tu lomito te agradece ese momento juntos!"
    : "Está bien tomarse un respiro. Mañana será otro día. 🌥️";
  document.getElementById("respuestaPaseo").innerText = respuesta;
}

function guardarNota() {
  const fecha = document.getElementById("fecha").value;
  const texto = document.getElementById("nota").value.toLowerCase();
  const palabrasClave = texto.match(/\b(feliz|amado|tranquilo|tranquila|ansioso|ansiosa|acompañado|motivado|en paz|relajado|seguro|protegido)\b/g) || [];
  registros.push({ fecha, texto, palabrasClave });
  document.getElementById("nota").value = "";
  actualizarGrafica();
  mostrarRegistro();
}

function mostrarRegistro() {
  const registroDiv = document.getElementById("registro");
  registroDiv.innerHTML = registros.map(r => `<p><strong>${r.fecha}</strong>: ${r.texto}</p>`).join("");
}

function actualizarGrafica() {
  const conteo = {};
  registros.forEach(r => r.palabrasClave.forEach(p => {
    conteo[p] = (conteo[p] || 0) + 1;
  }));

  const ctx = document.getElementById("graficaPalabras").getContext("2d");
  if (window.grafica) window.grafica.destroy();
  window.grafica = new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(conteo),
      datasets: [{
        label: "Palabras clave",
        data: Object.values(conteo),
        backgroundColor: "#ffbb9e"
      }]
    }
  });
}

function exportarPalabrasClave() {
  const texto = registros.map(r => r.palabrasClave.join(", ")).join("\n");
  const blob = new Blob([texto], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "palabras_clave.txt";
  a.click();
}

function exportarResumenSemanal() {
  const resumen = {};
  registros.forEach(r => {
    const semana = r.fecha.slice(0, 7);
    resumen[semana] = resumen[semana] || [];
    resumen[semana].push(...r.palabrasClave);
  });

  let salida = "";
  for (let semana in resumen) {
    const claves = resumen[semana];
    const conteo = {};
    claves.forEach(p => conteo[p] = (conteo[p] || 0) + 1);
    salida += `Semana ${semana}:
`;
    for (let palabra in conteo) {
      salida += `  ${palabra}: ${conteo[palabra]} veces
`;
    }
    salida += "\n";
  }

  const blob = new Blob([salida], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "resumen_semanal.txt";
  a.click();
}