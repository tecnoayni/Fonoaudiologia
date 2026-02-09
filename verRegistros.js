import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  deleteDoc
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

const editNombre = document.getElementById("editNombre");
const editFecha = document.getElementById("editFecha");
const editEspecialista = document.getElementById("editEspecialista");
const editDiagnostico = document.getElementById("editDiagnostico");
const editTerapia = document.getElementById("editTerapia");
const editObservaciones = document.getElementById("editObservaciones");

/* 🗑️ BOTÓN BORRAR */
const btnBorrar = document.createElement("button");
btnBorrar.textContent = "Borrar Registro";
btnBorrar.style.marginTop = "10px";

/* 🔹 CARGAR REGISTROS */
async function cargarRegistros() {
  tabla.innerHTML = "";

  const snapshot = await getDocs(collection(db, "PacientesRegistro"));

  snapshot.forEach(docSnap => {
    const d = docSnap.data();

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${d.nombrePaciente || ""}</td>
      <td>${d.fechaRegistro || ""}</td>
      <td>${d.especialista || ""}</td>
      <td>
        <button class="btn-ver">Ver</button>
      </td>
    `;

    tr.querySelector(".btn-ver").addEventListener("click", () => {
      mostrarDetalle(d, docSnap.id);
    });

    tabla.appendChild(tr);
  });
}

/* 🔹 MOSTRAR DETALLE */
function mostrarDetalle(d, idDoc) {
  detalle.style.display = "block";

  /* 📸 IMAGEN */
  verImagen.src = "";
  if (d.imagenUrl && d.imagenUrl !== "") {
    verImagen.src = d.imagenUrl;
  }

  /* 🎧 AUDIO */
  verAudio.pause();
  verAudio.src = "";
  if (d.audioUrl && d.audioUrl !== "") {
    verAudio.src = d.audioUrl;
    verAudio.load(); // 🔑 clave
  }

  /* 📝 DATOS */
  editNombre.value = d.nombrePaciente || "";
  editFecha.value = d.fechaRegistro || "";
  editEspecialista.value = d.especialista || "";
  editDiagnostico.value = d.diagnostico || "";
  editTerapia.value = d.terapia || "";
  editObservaciones.value = d.observaciones || "";

  /* 🗑️ BORRAR */
  if (!detalle.contains(btnBorrar)) {
    detalle.appendChild(btnBorrar);
  }

  btnBorrar.onclick = async () => {
    if (!confirm("¿Seguro que deseas eliminar este registro?")) return;

    await deleteDoc(doc(db, "PacientesRegistro", idDoc));
    alert("Registro eliminado");

    detalle.style.display = "none";
    cargarRegistros();
  };
}

/* 🔹 INICIAR */
cargarRegistros();
