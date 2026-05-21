// ======= CARGA CMS ==========
fetch("data/cms.json")
  .then(res => res.json())
  .then(data => {

    // BOLETÍN
    document.querySelector(".bol-eyebrow").innerText = data.boletin.titulo;
    document.querySelector(".bol-card p").innerText = data.boletin.descripcion;
    document.querySelector(".bol-card a").href = data.boletin.pdf;

    // CÁNCER CARDS
    const container = document.querySelector(".cancer-links");
    container.innerHTML = "";

    Object.keys(data.cancer).forEach(key => {
      const c = data.cancer[key];

      container.innerHTML += `
        <a href="${c.link}" class="card-btn">
          <h4>${c.titulo}</h4>
          <span class="mini-stat">${c.stat}</span>
        </a>
      `;
    });

  });


// ======== FILE SYSTEM API (CARPETA) =============
let carpetaSeleccionada = null;
async function guardarHandle(handle) {

    return new Promise((resolve) => {

        const request = indexedDB.open("pdfDB", 1);

        request.onupgradeneeded = () => {
            request.result.createObjectStore("handles");
        };

        request.onsuccess = () => {
            const db = request.result;
            const tx = db.transaction("handles", "readwrite");
            tx.objectStore("handles").put(handle, "carpeta");
            tx.oncomplete = () => resolve(true);
        };

        request.onerror = () => resolve(false);
    });
}


// Cargar carpeta guardada
async function cargarHandle() {

    return new Promise((resolve) => {

        const request = indexedDB.open("pdfDB", 1);

        request.onupgradeneeded = () => {
            request.result.createObjectStore("handles");
        };

        request.onsuccess = () => {
            const db = request.result;
            const tx = db.transaction("handles", "readonly");
            const store = tx.objectStore("handles");

            const getReq = store.get("carpeta");

            getReq.onsuccess = () => {
                resolve(getReq.result || null);
            };

            getReq.onerror = () => resolve(null);
        };

        request.onerror = () => resolve(null);
    });
}


// ============ SUBIR Y GUARDAR PDF ============
async function guardarPDF() {

    try {

        const input = document.getElementById("pdfFile");

        if (!input.files.length) {
            alert("Selecciona un PDF");
            return;
        }

        const archivo = input.files[0];

        if (archivo.type !== "application/pdf") {
            alert("Solo se permiten archivos PDF");
            return;
        }

        
        carpetaSeleccionada = await cargarHandle();

        if (!carpetaSeleccionada) {

            carpetaSeleccionada = await window.showDirectoryPicker({
                mode: "readwrite"
            });

            await guardarHandle(carpetaSeleccionada);
        }

        const fileHandle = await carpetaSeleccionada.getFileHandle("boletin.pdf", {
            create: true
        });

        const writable = await fileHandle.createWritable();
        await writable.write(archivo);
        await writable.close();

        alert("PDF actualizado correctamente");

        console.log("✔ Guardado como boletin.pdf");

    } catch (error) {

        console.error(error);
        alert("Error guardando PDF");

    }
}

function guardarStats() {

  const stats = {
    mama: document.getElementById("stat-mama").value,
    colorrectal: document.getElementById("stat-colorrectal").value,
    cervix: document.getElementById("stat-cervix").value,
    prostata: document.getElementById("stat-prostata").value
  };

  localStorage.setItem("cancerStats", JSON.stringify(stats));

  actualizarCards(stats);

  // LIMPIAR FORMULARIO DESPUÉS DE GUARDAR
  document.getElementById("stat-mama").value = "";
  document.getElementById("stat-colorrectal").value = "";
  document.getElementById("stat-cervix").value = "";
  document.getElementById("stat-prostata").value = "";

  alert("Estadísticas actualizadas");
}

function actualizarCards(stats) {

  document.querySelector('[data-cancer="mama"]').innerText = stats.mama;
  document.querySelector('[data-cancer="colorrectal"]').innerText = stats.colorrectal;
  document.querySelector('[data-cancer="cervix"]').innerText = stats.cervix;
  document.querySelector('[data-cancer="prostata"]').innerText = stats.prostata;

}
const saved = localStorage.getItem("cancerStats");

if (saved) {
  actualizarCards(JSON.parse(saved));
}