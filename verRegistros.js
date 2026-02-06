import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB2XMWciNurV8oawf9EAQbCDySDPcNnr5g",
  authDomain: "fonoaudiologia-2bf21.firebaseapp.com",
  projectId: "fonoaudiologia-2bf21",
  storageBucket: "fonoaudiologia-2bf21.appspot.com",
  messagingSenderId: "645482975012",
  appId: "1:645482975012:web:3e3bed80ac3239f99aedb1"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Seguridad básica
const usuario = localStorage.getItem("usuarioLogueado");
if (!usuario) {
  window.location.href = "Index.html";
}

// Elementos DOM
const tabla = document.getElementById("tablaRegistros");
const detalleBox = document.getElementById("detalleContainer");
const imgPreview = document.getElementById("verImagen");
const audioPreview = document.getElementById("verAudio");

let registroId = null;

// =======================
// CARGAR REGISTROS
// =======================
async function cargarRegistros() {
  const snapshot = await getDocs(collection(db, "PacientesRegistro"));
  tabla.innerHTML = "";

  snapshot.forEach(docSnap => {
    const d = docSnap.data();

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${d.nombrePaciente}</td>
      <td>${d.fechaRegistro}</td>
      <td>${d.especialista}</td>
      <td>
        <button class="btn-ver">Ver</button>
        <button class="btn-borrar">Borrar</button>
      </td>
    `;

    tr.querySelector(".btn-ver").addEventListener("click", () => {
      mostrarDetalle(docSnap.id, d);
    });

    tr.querySelector(".btn-borrar").addEventListener("click", () => {
      borrarRegistro(docSnap.id);
    });

    tabla.appendChild(tr);
  });
}

// =======================
// MOSTRAR DETALLE
// =======================
function mostrarDetalle(id, d) {
  registroId = id;

  if (!detalleBox) return;
  detalleBox.style.display = "block";

  // Imagen
  if (d.imagenBase64 && imgPreview) {
    imgPreview.src = d.imagenBase64;
    imgPreview.style.display = "block";
  } else if (imgPreview) {
    imgPreview.style.display = "none";
  }

  // Audio
  if (d.audioURL && audioPreview) {
    audioPreview.src = d.audioURL;
    audioPreview.load();
    audioPreview.style.display = "block";
  } else if (audioPreview) {
    audioPreview.removeAttribute("src");
    audioPreview.style.display = "none";
  }

  editNombre.value = d.nombrePaciente || "";
  editFecha.value = d.fechaRegistro || "";
  editEspecialista.value = d.especialista || "";
  editDiagnostico.value = d.diagnostico || "";
  editTerapia.value = d.terapia || "";
  editObservaciones.value = d.observaciones || "";
}

// =======================
// GUARDAR CAMBIOS
// =======================
document.getElementById("guardarCambios").addEventListener("click", async () => {
  if (!registroId) return;

  await updateDoc(doc(db, "PacientesRegistro", registroId), {
    nombrePaciente: editNombre.value,
    fechaRegistro: editFecha.value,
    especialista: editEspecialista.value,
    diagnostico: editDiagnostico.value,
    terapia: editTerapia.value,
    observaciones: editObservaciones.value
  });

  alert("Registro actualizado");
  detalleBox.style.display = "none";
  cargarRegistros();
});

// =======================
// BORRAR REGISTRO
// =======================
async function borrarRegistro(id) {
  if (!confirm("¿Seguro que deseas eliminar este registro?")) return;

  await deleteDoc(doc(db, "PacientesRegistro", id));
  alert("Registro eliminado");
  cargarRegistros();
}

// =======================
// INICIALIZAR
// =======================
cargarRegistros();
