// ===============================
// IMPORTS FIREBASE
// ===============================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ===============================
// CONFIG FIREBASE
// ===============================
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_DOMINIO",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_BUCKET",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log("🔥 Firebase inicializado");

// ===============================
// ELEMENTOS DOM
// ===============================
const tabla = document.getElementById("tablaRegistros");
const detalleContainer = document.getElementById("detalleContainer");
const verImagen = document.getElementById("verImagen");
const verAudio = document.getElementById("verAudio");

console.log("📦 Elementos DOM:", {
  tabla,
  detalleContainer,
  verImagen,
  verAudio
});

// ===============================
// CARGAR REGISTROS
// ===============================
async function cargarRegistros() {
  console.log("📥 Cargando registros...");
  tabla.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "registros"));

  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    console.log("📄 Registro encontrado:", data);

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${data.nombrePaciente || "-"}</td>
      <td>${data.fechaRegistro || "-"}</td>
      <td class="acciones">
        <button class="btn-ver">Ver</button>
        <button class="btn-borrar">Borrar</button>
      </td>
    `;

    // ===============================
    // BOTÓN VER
    // ===============================
    tr.querySelector(".btn-ver").addEventListener("click", () => {
      console.log("👁️ Ver registro:", docSnap.id);
      mostrarDetalle(data);
    });

    // ===============================
    // BOTÓN BORRAR
    // ===============================
    tr.querySelector(".btn-borrar").addEventListener("click", async () => {
      const ok = confirm("¿Seguro que deseas borrar este registro?");
      if (!ok) return;

      console.log("🗑️ Borrando registro:", docSnap.id);
      await deleteDoc(doc(db, "registros", docSnap.id));
      cargarRegistros();
    });

    tabla.appendChild(tr);
  });
}

// ===============================
// MOSTRAR DETALLE
// ===============================
function mostrarDetalle(data) {
  console.log("📌 Mostrando detalle:", data);
  detalleContainer.style.display = "block";

  // -------- IMAGEN --------
  if (data.imagenUrl && data.imagenUrl !== "") {
    console.log("🖼️ Imagen encontrada:", data.imagenUrl);
    verImagen.src = data.imagenUrl;
    verImagen.style.display = "block";
  } else {
    console.warn("⚠️ No hay imagen");
    verImagen.style.display = "none";
  }

  // -------- AUDIO --------
  if (data.audioUrl && data.audioUrl !== "") {
    console.log("🔊 Audio encontrado:", data.audioUrl);
    verAudio.src = data.audioUrl;
    verAudio.load(); // MUY IMPORTANTE
    verAudio.style.display = "block";
  } else {
    console.warn("⚠️ No hay audio o audioUrl vacío");
    verAudio.pause();
    verAudio.removeAttribute("src");
    verAudio.style.display = "none";
  }
}

// ===============================
// INICIAR
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOM cargado");
  cargarRegistros();
});
