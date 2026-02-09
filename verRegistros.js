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

/* 🔹 DOM listo */
document.addEventListener("DOMContentLoaded", () => {
  cargarRegistros();
});

/* 🔹 Cargar lista */
async function cargarRegistros() {
  const tabla = document.getElementById("tablaRegistros");
  tabla.innerHTML = "";

  const snapshot = await getDocs(collection(db, "PacientesRegistro"));

  snapshot.forEach((docSnap) => {
    const d = docSnap.data();

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${d.nombrePaciente || ""}</td>
      <td>${d.fechaRegistro || ""}</td>
      <td>${d.especialista || ""}</td>
      <td>
        <button class="verBtn">Ver</button>
        <button class="borrarBtn">Borrar</button>
      </td>
    `;

    /* 🔍 VER */
    tr.querySelector(".verBtn").addEventListener("click", () => {
      mostrarDetalle(docSnap.id);
    });

    /* 🗑️ BORRAR */
    tr.querySelector(".borrarBtn").addEventListener("click", async () => {
      if (confirm("¿Eliminar este registro?")) {
        await deleteDoc(doc(db, "PacientesRegistro", docSnap.id));
        cargarRegistros();
      }
    });

    tabla.appendChild(tr);
  });
}

/* 🔹 MOSTRAR DETALLE */
async function mostrarDetalle(id) {
  const detalle = document.getElementById("detalleContainer");
  detalle.style.display = "block";

  const refDoc = doc(db, "PacientesRegistro", id);
  const snap = await getDoc(refDoc);

  if (!snap.exists()) return;

  const d = snap.data();

  /* 📸 Imagen */
  const img = document.getElementById("verImagen");
  img.src = d.imagenUrl || "";
  img.style.display = d.imagenUrl ? "block" : "none";

  /* 🎧 Audio */
  const audio = document.getElementById("verAudio");
  if (d.audioUrl) {
    audio.src = d.audioUrl;
    audio.load();
    audio.style.display = "block";
  } else {
    audio.style.display = "none";
  }

  /* 📝 Datos */
  document.getElementById("editNombre").value = d.nombrePaciente || "";
  document.getElementById("editFecha").value = d.fechaRegistro || "";
  document.getElementById("editEspecialista").value = d.especialista || "";
  document.getElementById("editDiagnostico").value = d.diagnostico || "";
  document.getElementById("editTerapia").value = d.terapia || "";
  document.getElementById("editObservaciones").value = d.observaciones || "";
}
