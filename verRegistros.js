import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs
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

/* 🔹 CARGAR REGISTROS */
async function cargarRegistros() {
  tabla.innerHTML = "";

  const snapshot = await getDocs(collection(db, "PacientesRegistro"));

  snapshot.forEach(doc => {
    const d = doc.data();

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${d.nombrePaciente || ""}</td>
      <td>${d.fechaRegistro || ""}</td>
      <td>${d.especialista || ""}</td>
      <td><button class="btn-ver">Ver</button></td>
    `;

    tr.querySelector(".btn-ver").addEventListener("click", () => {
      mostrarDetalle(d);
    });

    tabla.appendChild(tr);
  });
}

/* 🔹 MOSTRAR DETALLE */
function mostrarDetalle(d) {
  console.log("▶ Detalle:", d);

  detalle.style.display = "block";

  /* 📸 IMAGEN */
  if (d.imagenUrl && d.imagenUrl !== "") {
    verImagen.src = d.imagenUrl;
    verImagen.style.display = "block";
  } else {
    verImagen.style.display = "none";
  }

  /* 🎧 AUDIO (CLAVE) */
  verAudio.pause();
  verAudio.removeAttribute("src");
  verAudio.load();

  if (d.audioUrl && d.audioUrl !== "") {
    verAudio.src = d.audioUrl;
    verAudio.controls = true;
    verAudio.style.display = "block";

    // 🔑 fuerza recarga real
    setTimeout(() => {
      verAudio.load();
    }, 100);
  } else {
    verAudio.style.display = "none";
  }

  /* 📝 DATOS */
  editNombre.value = d.nombrePaciente || "";
  editFecha.value = d.fechaRegistro || "";
  editEspecialista.value = d.especialista || "";
  editDiagnostico.value = d.diagnostico || "";
  editTerapia.value = d.terapia || "";
  editObservaciones.value = d.observaciones || "";
}

/* 🚀 INICIAR */
cargarRegistros();
