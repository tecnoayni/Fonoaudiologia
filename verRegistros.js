import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {

  // 🔹 Firebase config
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

  // 🔹 Elementos
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

  // 🧪 Verificación crítica
  if (!verAudio) {
    console.error("❌ No se encontró el elemento <audio id='verAudio'>");
    return;
  }

  // 🔹 Cargar registros
  const snapshot = await getDocs(collection(db, "registros"));
  tabla.innerHTML = "";

  snapshot.forEach(doc => {
    const data = doc.data();

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${data.nombrePaciente}</td>
      <td>${data.fechaRegistro}</td>
      <td>${data.especialista}</td>
      <td><button>Ver</button></td>
    `;

    tr.querySelector("button").addEventListener("click", () => {
      mostrarDetalle(data);
    });

    tabla.appendChild(tr);
  });

  // 🔹 Mostrar detalle
  function mostrarDetalle(data) {
    console.log("▶ Registro seleccionado:", data);

    detalle.style.display = "block";

    // 📸 Imagen
    if (data.imagenUrl) {
      verImagen.src = data.imagenUrl;
      verImagen.style.display = "block";
    } else {
      verImagen.style.display = "none";
    }

    // 🎧 Audio (CLAVE)
    if (data.audioUrl) {
      verAudio.src = data.audioUrl;
      verAudio.style.display = "block";
      verAudio.load(); // 🔥 ESTO ES CLAVE
    } else {
      verAudio.style.display = "none";
    }

    // 📝 Inputs
    editNombre.value = data.nombrePaciente || "";
    editFecha.value = data.fechaRegistro || "";
    editEspecialista.value = data.especialista || "";
    editDiagnostico.value = data.diagnostico || "";
    editTerapia.value = data.terapia || "";
    editObservaciones.value = data.observaciones || "";
  }

});

