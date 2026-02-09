import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* 🔹 Firebase */
const firebaseConfig = {
  apiKey: "AIzaSyB2XMWciNurV8oawf9EAQbCDySDPcNnr5g",
  authDomain: "fonoaudiologia-2bf21.firebaseapp.com",
  projectId: "fonoaudiologia-2bf21"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* 🔹 Form */
const form = document.getElementById("registroForm");

/* 🔹 Inputs */
const nombrePacienteInput = document.getElementById("nombrePaciente");
const fechaRegistroInput = document.getElementById("fechaRegistro");
const especialistaInput = document.getElementById("especialista");
const diagnosticoInput = document.getElementById("diagnostico");
const terapiaInput = document.getElementById("terapia");
const observacionesInput = document.getElementById("observaciones");
const imagenInput = document.getElementById("imagen");
const audioInput = document.getElementById("audio"); // 🎧

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const nombrePaciente = nombrePacienteInput.value.trim();
    const fechaRegistro = fechaRegistroInput.value;

    if (!nombrePaciente || !fechaRegistro) {
      alert("Completa los campos obligatorios");
      return;
    }

    /* 📸 SUBIR IMAGEN A CLOUDINARY */
    const imagenFile = imagenInput.files[0];
    if (!imagenFile) {
      alert("Debes subir una imagen");
      return;
    }

    const formImg = new FormData();
    formImg.append("file", imagenFile);
    formImg.append("upload_preset", "Fono-Audio");

    const imgRes = await fetch(
      "https://api.cloudinary.com/v1_1/disjesee5/image/upload",
      { method: "POST", body: formImg }
    );

    const imgData = await imgRes.json();
    const imagenUrl = imgData.secure_url;

    /* 🎧 SUBIR AUDIO A CLOUDINARY */
    let audioUrl = "";

    const audioFile = audioInput.files[0];
    if (audioFile) {
      const formAudio = new FormData();
      formAudio.append("file", audioFile);
      formAudio.append("upload_preset", "Fono-Audio");

      const audioRes = await fetch(
        "https://api.cloudinary.com/v1_1/disjesee5/video/upload",
        { method: "POST", body: formAudio }
      );

      const audioData = await audioRes.json();
      audioUrl = audioData.secure_url;
    }

    /* 💾 GUARDAR EN FIRESTORE */
    await addDoc(collection(db, "PacientesRegistro"), {
      nombrePaciente,
      fechaRegistro,
      especialista: especialistaInput.value,
      diagnostico: diagnosticoInput.value,
      terapia: terapiaInput.value,
      observaciones: observacionesInput.value,
      imagenUrl,
      audioUrl, // 🔥 AHORA SÍ SE GUARDA
      creadoEn: serverTimestamp()
    });

    alert("Registro guardado correctamente");
    form.reset();

  } catch (error) {
    console.error(error);
    alert("Error al guardar el registro");
  }
});
