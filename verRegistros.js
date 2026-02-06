import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ========================
   FIREBASE CONFIG
======================== */
const firebaseConfig = {
  apiKey: "AIzaSyB2XMWciNurV8oawf9EAQbCDySDPcNnr5g",
  authDomain: "fonoaudiologia-2bf21.firebaseapp.com",
  projectId: "fonoaudiologia-2bf21",
  storageBucket: "fonoaudiologia-2bf21.appspot.com",
  messagingSenderId: "645482975012",
  appId: "1:645482975012:web:3e3bed80ac3239f99aedb1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ========================
   SEGURIDAD
======================== */
const usuario = localStorage.getItem("usuarioLogueado");
if (!usuario) {
  window.location.href = "Index.html";
}

/* ========================
   ELEMENTOS
======================== */
const tabla = document.getElementById("tablaRegistros");
const detalleBox = document.getElementById("detalleContainer");

const imgVer = document.getElementById("verImagen");
const audioVer = document.getElementById("verAudio");
const btnDescargarAudio = document.getElementById("descargarAudio");

let registroId = null;

/* ========================
   CARGAR REGISTROS
======================== */
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
      <td class="acciones">
        <button class="btn-ver">Ver</button>
        <button class="btn-borrar">Borrar</button>
      </td>
    `;

    tr.querySelector(".btn-ver").onclick = () =>
      mostrarDetalle(docSnap.id, d);

    tr.querySelector(".btn-borrar").onclick = () =>
      borrarRegistro(docSnap.id);

    tabla.appendChild(tr);
  });
}

/* ========================
   MOSTRAR DETALLE
======================== */
function mostrarDetalle(id, d) {
  registroId = id;
  detalleBox.style.display = "block";

  /* Imagen */
  if (d.imagenBase64) {
    imgVer.src = d.imagenBase64;
    imgVer.style.display = "block";
  } else {
    imgVer.style.display = "none";
  }

  /* Audio (URL externa: Cloudinary) */
  if (d.audioURL) {
    audioVer.src = d.audioURL;
    audioVer.style.display = "block";

    btnDescargarAudio.href = d.audioURL;
    btnDescargarAudio.style.display = "inline-block";
  } else {
    audioVer.style.display = "none";
    btnDescargarAudio.style.display = "none";
  }

  /* Inputs */
  editNombre.value = d.nombrePaciente || "";
  editFecha.value = d.fechaRegistro || "";
  editEspecialista.value = d.especialista || "";
  editDiagnostico.value = d.diagnostico || "";
  editTerapia.value = d.terapia || "";
  editObservaciones.value = d.observaciones || "";
}

/* ========================
   GUARDAR CAMBIOS
======================== */
guardarCambios.onclick = async () => {
  if (!registroId) return;

  await updateDoc(doc(db, "PacientesRegistro", registroId), {
    nombrePaciente: editNombre.value,
    fechaRegistro: editFecha.value,
    especialista: editEspecialista.value,
    diagnostico: editDiagnostico.value,
    terapia: editTerapia.value,
    observaciones: editObservaciones.value
  });

  alert("✅ Registro actualizado");
  detalleBox.style.display = "none";
  cargarRegistros();
};

/* ========================
   BORRAR
======================== */
async function borrarRegistro(id) {
  if (!confirm("¿Seguro que deseas eliminar este registro?")) return;

  await deleteDoc(doc(db, "PacientesRegistro", id));
  alert("🗑 Registro eliminado");
  cargarRegistros();
}

cargarRegistros();
