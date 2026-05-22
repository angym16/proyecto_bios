console.log("ADMIN ACTIVADO");

localStorage.setItem("isAdmin", "true");



let cmsData = null;

// cargar datos
fetch("../data/cms.json")
  .then(r => r.json())
  .then(data => {
    cmsData = data;

    document.getElementById("tituloBoletin").value = data.boletin.titulo;
    document.getElementById("descBoletin").value = data.boletin.descripcion;
  });

// guardar cambios
function guardarCMS() {

  cmsData.boletin.titulo =
    document.getElementById("tituloBoletin").value;

  cmsData.boletin.descripcion =
    document.getElementById("descBoletin").value;

  // aquí viene lo importante:
  // el PDF se sube y reemplaza el anterior

  const file = document.getElementById("pdfFile").files[0];

  if (file) {
    const formData = new FormData();
    formData.append("pdf", file);

    fetch("../data/upload.php", {
      method: "POST",
      body: formData
    })
    .then(r => r.text())
    .then(path => {
      cmsData.boletin.pdf = path;

      guardarJSONFinal();
    });

  } else {
    guardarJSONFinal();
  }
}

