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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const usuario = localStorage.getItem("usuarioLogueado");
if (!usuario) {
  window.location.href = "Index.html";
}

const tabla = document.getElementById("tablaRegistros");
const detalleBox = document.getElementById("detalleContainer");

let registroId = null;

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

    tr.querySelector(".btn-ver").onclick = () => mostrarDetalle(docSnap.id, d);
    tr.querySelector(".btn-borrar").onclick = () => borrarRegistro(docSnap.id);

    tabla.appendChild(tr);
  });
}

function mostrarDetalle(id, d) {
  registroId = id;
  detalleBox.style.display = "block";

  document.getElementById("verImagen").src = d.imagenBase64;
  document.getElementById("verAudio").src = d.audioBase64;

  document.getElementById("editNombre").value = d.nombrePaciente;
  document.getElementById("editFecha").value = d.fechaRegistro;
  document.getElementById("editEspecialista").value = d.especialista;
  document.getElementById("editDiagnostico").value = d.diagnostico;
  document.getElementById("editTerapia").value = d.terapia;
  document.getElementById("editObservaciones").value = d.observaciones;
}

document.getElementById("guardarCambios").onclick = async () => {
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
};

async function borrarRegistro(id) {
  if (!confirm("¿Seguro que deseas eliminar este registro?")) return;

  await deleteDoc(doc(db, "PacientesRegistro", id));
  alert("Registro eliminado");
  cargarRegistros();
}

cargarRegistros();

