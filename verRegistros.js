import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* 🔹 Firebase */
const firebaseConfig = {
  apiKey: "AIzaSyB2XMWciNurV8oawf9EAQbCDySDPcNnr5g",
  authDomain: "fonoaudiologia-2bf21.firebaseapp.com",
  projectId: "fonoaudiologia-2bf21"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* 🔹 ELEMENTOS */
const tabla = document.getElementById("tablaRegistros");
const detalle = document.getElementById("detalleContainer");

const verImagen = document.getElementById("verImagen");
const verAudio = document.getElementById("verAudio");

/* 🔹 CARGAR REGISTROS */
async function cargarRegistros() {
  if (!tabla) return;

  tabla.innerHTML = "";
  const snap = await getDocs(collection(db, "PacientesRegistro"));

  snap.forEach(docSnap => {
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

    tr.querySelector(".btn-ver").onclick = () => mostrarDetalle(d);
    tr.querySelector(".btn-borrar").onclick = () => borrarRegistro(docSnap.id);

    tabla.appendChild(tr);
  });
}

/* 🔹 DETALLE */
function mostrarDetalle(d) {
  if (!detalle) return;

  detalle.style.display = "block";

  if (d.imagenUrl && verImagen) {
    verImagen.src = d.imagenUrl;
    verImagen.style.display = "block";
  }

  if (d.audioUrl && verAudio) {
    verAudio.src = d.audioUrl;
    verAudio.load();
    verAudio.style.display = "block";
  }
}

/* 🔹 BORRAR */
async function borrarRegistro(id) {
  if (!confirm("¿Eliminar este registro?")) return;
  await deleteDoc(doc(db, "PacientesRegistro", id));
  cargarRegistros();
}

cargarRegistros();
