import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* 🔹 Firebase config */
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

/* 🔹 Elementos */
const tabla = document.getElementById("tablaRegistros");
const detalle = document.getElementById("detalleContainer");

const verImagen = document.getElementById("verImagen");
const verAudio = document.getElementById("verAudio");

const editNombre = document.getElementById("editNombre");
const editFecha = document.getElementById("editFecha");
const editEspecialista = document.getElementById("editEspecialista");
const editDiagnostico = document.getElementById("editDiagnostico");
const editTerapia = document.getElementById("editTerapia");
const editObservaciones = document.getElementById("editObservaciones");

/* 🔹 Cargar registros */
async function cargarRegistros() {
  tabla.innerHTML = "";

  const snapshot = await getDocs(collection(db, "PacientesRegistro"));

  snapshot.forEach(docSnap => {
    const data = docSnap.data();

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <img src="${data.imagenUrl || ""}" 
             style="width:50px;height:50px;object-fit:cover;border-radius:6px;">
      </td>
      <td>${data.nombrePaciente}</td>
      <td>${data.fechaRegistro}</td>
      <td>${data.especialista}</td>
      <td class="acciones">
        <button class="btn-ver">Ver</button>
        <button class="btn-borrar">Borrar</button>
      </td>
    `;

    tr.querySelector(".btn-ver").onclick = () =>
      mostrarDetalle(docSnap.id, data);

    tr.querySelector(".btn-borrar").onclick = () =>
      borrarRegistro(docSnap.id);

    tabla.appendChild(tr);
  });
}

/* 🔹 Mostrar detalle */
function mostrarDetalle(id, data) {
  detalle.style.display = "block";

  /* 📸 Imagen */
  if (data.imagenUrl) {
    verImagen.src = data.imagenUrl;
    verImagen.style.display = "block";
  } else {
    verImagen.style.display = "none";
  }

  /* 🎧 Audio */
  if (data.audioUrl) {
    verAudio.src = data.audioUrl;
    verAudio.load();
    verAudio.style.display = "block";
  } else {
    verAudio.style.display = "none";
  }

  /* 📝 Datos */
  editNombre.value = data.nombrePaciente || "";
  editFecha.value = data.fechaRegistro || "";
  editEspecialista.value = data.especialista || "";
  editDiagnostico.value = data.diagnostico || "";
  editTerapia.value = data.terapia || "";
  editObservaciones.value = data.observaciones || "";
}

/* 🔹 Borrar registro */
async function borrarRegistro(id) {
  if (!confirm("¿Seguro que deseas eliminar este registro?")) return;

  await deleteDoc(doc(db, "PacientesRegistro", id));
  alert("Registro eliminado");
  detalle.style.display = "none";
  cargarRegistros();
}

/* 🔹 Inicial */
cargarRegistros();
