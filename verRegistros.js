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

/* 🔹 TABLA */
const tabla = document.getElementById("tablaRegistros");

/* 🔹 Cargar registros */
async function cargarRegistros() {
  tabla.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "PacientesRegistro"));

  querySnapshot.forEach((docu) => {
    const data = docu.data();

    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${data.nombrePaciente || ""}</td>
      <td>${data.fechaRegistro || ""}</td>
      <td>${data.especialista || ""}</td>
      <td>
        <button class="verBtn">Ver</button>
        <button class="borrarBtn">Borrar</button>
      </td>
    `;

    /* 👁️ VER DETALLE */
    fila.querySelector(".verBtn").addEventListener("click", async () => {
      try {
        const ref = doc(db, "PacientesRegistro", docu.id);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          alert("Registro no encontrado");
          return;
        }

        const d = snap.data();

        /* 📸 Imagen */
        document.getElementById("detalleImagen").src = d.imagenUrl || "";

        /* 🎧 Audio */
        const audio = document.getElementById("detalleAudio");
        if (d.audioUrl) {
          audio.src = d.audioUrl;
          audio.load();
          audio.style.display = "block";
        } else {
          audio.style.display = "none";
        }

        /* 🧾 Inputs */
        document.getElementById("detalleNombre").value = d.nombrePaciente || "";
        document.getElementById("detalleFecha").value = d.fechaRegistro || "";
        document.getElementById("detalleEspecialista").value = d.especialista || "";
        document.getElementById("detalleDiagnostico").value = d.diagnostico || "";
        document.getElementById("detalleTerapia").value = d.terapia || "";
        document.getElementById("detalleObservaciones").value = d.observaciones || "";

        /* Guardar ID para editar */
        localStorage.setItem("registroId", docu.id);

      } catch (err) {
        console.error(err);
        alert("Error al cargar detalle");
      }
    });

    /* 🗑️ BORRAR */
    fila.querySelector(".borrarBtn").addEventListener("click", async () => {
      if (confirm("¿Seguro que deseas borrar este registro?")) {
        await deleteDoc(doc(db, "PacientesRegistro", docu.id));
        cargarRegistros();
      }
    });

    tabla.appendChild(fila);
  });
}

/* 🔹 Inicial */
cargarRegistros();
