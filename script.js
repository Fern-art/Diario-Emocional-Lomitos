
const registros = {};

flatpickr("#fecha", {
  dateFormat: "Y-m-d",
  defaultDate: new Date()
});

function guardarNota() {
  const fecha = document.getElementById("fecha").value;
  const nota = document.getElementById("nota").value.trim();
  if (!fecha || !nota) {
    alert("Por favor selecciona una fecha y escribe una nota.");
    return;
  }
  if (!registros[fecha]) registros[fecha] = [];
  registros[fecha].push(nota);
  alert("¡Guardado!");
  document.getElementById("nota").value = "";
}

function exportarResumen() {
  const palabras = {};
  for (const fecha in registros) {
    registros[fecha].forEach(nota => {
      const palabrasNota = nota.toLowerCase().split(/\s+/);
      palabrasNota.forEach(p => {
        if (p.length > 3) palabras[p] = (palabras[p] || 0) + 1;
      });
    });
  }

  const etiquetas = Object.keys(palabras);
  const valores = Object.values(palabras);

  const ctx = document.getElementById("graficaPalabras").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: etiquetas,
      datasets: [{
        label: "Palabras clave más usadas",
        data: valores,
        backgroundColor: "#ffbb9e"
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      }
    }
  });

  const resumen = etiquetas.map((p, i) => `${p}: ${valores[i]}`).join("\n");
  const blob = new Blob([resumen], { type: "text/plain;charset=utf-8" });
  const enlace = document.createElement("a");
  enlace.href = URL.createObjectURL(blob);
  enlace.download = "resumen_palabras_clave.txt";
  enlace.click();
}
