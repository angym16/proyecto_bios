// ======= CARGA CMS ==========
// ======= CARGA CMS ==========
fetch("../data/cms.json")
  .then(res => res.json())
  .then(data => {

    // BOLETÍN
    document.querySelector(".bol-eyebrow").innerText =
      data.boletin.titulo;

    document.querySelector(".bol-card p").innerText =
      data.boletin.descripcion;

    document.querySelector(".bol-card a").href =
      data.boletin.pdf;
      
    // ESTADÍSTICAS
    document.querySelector('[data-cancer="mama"]').innerText =
      data.cancer.mama.stat;

    document.querySelector('[data-cancer="colorrectal"]').innerText =
      data.cancer.colorrectal.stat;

    document.querySelector('[data-cancer="cervix"]').innerText =
      data.cancer.cervix.stat;

    document.querySelector('[data-cancer="prostata"]').innerText =
      data.cancer.prostata.stat;

  });



// ======== FILE SYSTEM API =========

let carpetaSeleccionada = null;


// ===== GUARDAR HANDLE =====
async function guardarHandle(handle) {

    return new Promise((resolve, reject) => {

        const request =
            indexedDB.open("biosCMS", 1);

        request.onupgradeneeded = () => {

            request.result
                .createObjectStore("handles");
        };

        request.onsuccess = () => {

            const db = request.result;

            const tx =
                db.transaction(
                    "handles",
                    "readwrite"
                );

            tx.objectStore("handles")
              .put(handle, "pdfFolder");

            tx.oncomplete = () => resolve();

            tx.onerror = () => reject();
        };

        request.onerror = () => reject();
    });
}



// ===== CARGAR HANDLE =====
async function cargarHandle() {

    return new Promise((resolve) => {

        const request =
            indexedDB.open("biosCMS", 1);

        request.onupgradeneeded = () => {

            request.result
                .createObjectStore("handles");
        };

        request.onsuccess = () => {

            const db = request.result;

            const tx =
                db.transaction(
                    "handles",
                    "readonly"
                );

            const store =
                tx.objectStore("handles");

            const getReq =
                store.get("pdfFolder");

            getReq.onsuccess = () => {

                resolve(getReq.result || null);
            };

            getReq.onerror = () => {

                resolve(null);
            };
        };

        request.onerror = () => resolve(null);
    });
}



// ===== VERIFICAR PERMISOS =====
async function verificarPermisos(handle) {

    const options = {
        mode: "readwrite"
    };

    // ya tiene permiso
    if (
        await handle.queryPermission(options)
        === "granted"
    ) {
        return true;
    }

    // pedir permiso otra vez
    if (
        await handle.requestPermission(options)
        === "granted"
    ) {
        return true;
    }

    return false;
}



// ===== GUARDAR PDF =====
async function guardarPDF() {

    try {

        const input =
            document.getElementById("pdfFile");

        if (!input.files.length) {

            alert("Selecciona un PDF");
            return;
        }

        const archivo = input.files[0];

        if (
            archivo.type !== "application/pdf"
        ) {

            alert("Solo archivos PDF");
            return;
        }

        // intentar cargar carpeta guardada
        carpetaSeleccionada =
            await cargarHandle();

        // si no existe -> pedir carpeta
        if (!carpetaSeleccionada) {

            carpetaSeleccionada =
                await window.showDirectoryPicker({
                    mode: "readwrite"
                });

            await guardarHandle(
                carpetaSeleccionada
            );
        }

        // verificar permisos
        const permitido =
            await verificarPermisos(
                carpetaSeleccionada
            );

        if (!permitido) {

            alert("Permiso denegado");
            return;
        }

        // crear o reemplazar PDF
        const fileHandle =
            await carpetaSeleccionada
                .getFileHandle(
                    "boletin.pdf",
                    { create: true }
                );

        const writable =
            await fileHandle
                .createWritable();

        await writable.write(archivo);

        await writable.close();

        alert(
          "PDF actualizado correctamente"
        );

        console.log(
          "✔ boletin.pdf reemplazado"
        );

    } catch(error) {

        console.error(error);

        alert("Error guardando PDF");
    }
}



// ===== GUARDAR STATS =====
function guardarStats() {

    const stats = {

        mama:
            document.getElementById(
                "stat-mama"
            ).value,

        colorrectal:
            document.getElementById(
                "stat-colorrectal"
            ).value,

        cervix:
            document.getElementById(
                "stat-cervix"
            ).value,

        prostata:
            document.getElementById(
                "stat-prostata"
            ).value
    };

    localStorage.setItem(
        "cancerStats",
        JSON.stringify(stats)
    );

    actualizarCards(stats);

    // limpiar formulario
    document.getElementById(
        "stat-mama"
    ).value = "";

    document.getElementById(
        "stat-colorrectal"
    ).value = "";

    document.getElementById(
        "stat-cervix"
    ).value = "";

    document.getElementById(
        "stat-prostata"
    ).value = "";

    alert(
      "Estadísticas actualizadas"
    );
}



// ===== ACTUALIZAR CARDS =====
function actualizarCards(stats) {

    document.querySelector(
        '[data-cancer="mama"]'
    ).innerText = stats.mama;

    document.querySelector(
        '[data-cancer="colorrectal"]'
    ).innerText =
      stats.colorrectal;

    document.querySelector(
        '[data-cancer="cervix"]'
    ).innerText =
      stats.cervix;

    document.querySelector(
        '[data-cancer="prostata"]'
    ).innerText =
      stats.prostata;
}



// ===== CARGAR STATS GUARDADAS =====
const saved =
    localStorage.getItem(
        "cancerStats"
    );

if (saved) {

    actualizarCards(
        JSON.parse(saved)
    );
}