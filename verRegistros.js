import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB2XMWciNurV8oawf9EAQbCDySDPcNnr5g",
  authDomain: "fonoaudiologia-2bf21.firebaseapp.com",
  projectId: "fonoaudiologia-2bf21",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* =====================================================
   ELEMENTOS DETALLE
===================================================== */
const detalleImagen = document.getElementById("detalleImagen");
const detalleAudio = document.getElementById("detalleAudio");
const detalleNombre = document.getElementById("detalleNombre");
const detalleFecha = document.getElementById("detalleFecha");
const detalleEspecialista = document.getElementById("detalleEspecialista");
const detalleDiagnostico = document.getElementById("detalleDiagnostico");
const detalleTerapia = document.getElementById("detalleTerapia");
const detalleObservaciones = document.getElementById("detalleObservaciones");
const guardarCambiosBtn = document.getElementById("guardarCambiosBtn");

/* =====================================================
   CARGAR DETALLE
===================================================== */
async function cargarDetalle() {
  const registroId = localStorage.getItem("registroId");
  if (!registroId) return;

  const ref = doc(db, "PacientesRegistro", registroId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    alert("Registro no encontrado");
    return;
  }

  const data = snap.data();

  // Imagen
  detalleImagen.src = data.imagenUrl || "";

  // Audio
  if (data.audioUrl) {
    detalleAudio.src = data.audioUrl;
    detalleAudio.style.display = "block";
  } else {
    detalleAudio.style.display = "none";
  }

  // Inputs
  detalleNombre.value = data.nombrePaciente || "";
  detalleFecha.value = data.fechaRegistro || "";
  detalleEspecialista.value = data.especialista || "";
  detalleDiagnostico.value = data.diagnostico || "";
  detalleTerapia.value = data.terapia || "";
  detalleObservaciones.value = data.observaciones || "";
}

cargarDetalle();

/* =====================================================
   GUARDAR CAMBIOS
===================================================== */
guardarCambiosBtn.addEventListener("click", async () => {
  const registroId = localStorage.getItem("registroId");
  if (!registroId) return;

  try {
    await updateDoc(doc(db, "PacientesRegistro", registroId), {
      nombrePaciente: detalleNombre.value,
      fechaRegistro: detalleFecha.value,
      especialista: detalleEspecialista.value,
      diagnostico: detalleDiagnostico.value,
      terapia: detalleTerapia.value,
      observaciones: detalleObservaciones.value
    });

    alert("Cambios guardados correctamente");
  } catch (error) {
    console.error(error);
    alert("Error al guardar cambios");
  }
});

/* =====================================================
   LISTA DE REGISTROS (VER / BORRAR)
===================================================== */
const tabla = document.getElementById("tablaRegistros");

async function cargarRegistros() {
  tabla.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "PacientesRegistro"));

  querySnapshot.forEach((docu) => {
    const d = docu.data();

    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${d.nombrePaciente}</td>
      <td>${d.fechaRegistro}</td>
      <td>${d.especialista}</td>
      <td>
        <button class="verBtn">Ver</button>
        <button class="borrarBtn">Borrar</button>
      </td>
    `;

    // VER
    fila.querySelector(".verBtn").addEventListener("click", () => {
      localStorage.setItem("registroId", docu.id);
      cargarDetalle();
    });

    // BORRAR
    fila.querySelector(".borrarBtn").addEventListener("click", async () => {
      if (confirm("¿Eliminar este registro?")) {
        await deleteDoc(doc(db, "PacientesRegistro", docu.id));
        cargarRegistros();
      }
    });

    tabla.appendChild(fila);
  });
}

cargarRegistros();
