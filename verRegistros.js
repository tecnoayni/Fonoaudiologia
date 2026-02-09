import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* 🔹 Firebase */
const firebaseConfig = {
  apiKey: "AIzaSyB2XMWciNurV8oawf9EAQbCDySDPcNnr5g",
  authDomain: "fonoaudiologia-2bf21.firebaseapp.com",
  projectId: "fonoaudiologia-2bf21",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* 🔹 Esperar DOM */
document.addEventListener("DOMContentLoaded", () => {
  const tabla = document.getElementById("tablaRegistros");

  if (!tabla) {
    console.error("❌ No existe #tablaRegistros");
    return;
  }

  cargarRegistros(tabla);
});

/* 🔹 Cargar registros */
async function cargarRegistros(tabla) {
  tabla.innerHTML = "";

  const snapshot = await getDocs(collection(db, "PacientesRegistro"));

  snapshot.forEach((docu) => {
    const d = docu.data();

    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${d.nombrePaciente || ""}</td>
      <td>${d.fechaRegistro || ""}</td>
      <td>${d.especialista || ""}</td>
      <td>
        <button class="verBtn">Ver</button>
        <button class="borrarBtn">Borrar</button>
      </td>
    `;

    /* 🔍 BOTÓN VER */
    const btnVer = fila.querySelector(".verBtn");
    if (btnVer) {
      btnVer.addEventListener("click", async () => {
        const ref = doc(db, "PacientesRegistro", docu.id);
        const snap = await getDoc(ref);

        if (!snap.exists()) return;

        const r = snap.data();

        document.getElementById("detalleImagen").src = r.imagenUrl || "";

        const audio = document.getElementById("detalleAudio");
        if (r.audioUrl) {
          audio.src = r.audioUrl;
          audio.load();
          audio.style.display = "block";
        } else {
          audio.style.display = "none";
        }

        document.getElementById("detalleNombre").value = r.nombrePaciente || "";
        document.getElementById("detalleFecha").value = r.fechaRegistro || "";
        document.getElementById("detalleEspecialista").value = r.especialista || "";
        document.getElementById("detalleDiagnostico").value = r.diagnostico || "";
        document.getElementById("detalleTerapia").value = r.terapia || "";
        document.getElementById("detalleObservaciones").value = r.observaciones || "";
      });
    }

    /* 🗑️ BOTÓN BORRAR */
    const btnBorrar = fila.querySelector(".borrarBtn");
    if (btnBorrar) {
      btnBorrar.addEventListener("click", async () => {
        if (confirm("¿Eliminar este registro?")) {
          await deleteDoc(doc(db, "PacientesRegistro", docu.id));
          cargarRegistros(tabla);
        }
      });
    }

    tabla.appendChild(fila);
  });
}
