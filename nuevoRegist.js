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

/* 🔹 FORM */
const form = document.getElementById("registroForm");

/* 🔹 INPUTS */
const nombrePacienteInput = document.getElementById("nombrePaciente");
const fechaRegistroInput = document.getElementById("fechaRegistro");
const especialistaInput = document.getElementById("especialista");
const diagnosticoInput = document.getElementById("diagnostico");
const terapiaInput = document.getElementById("terapia");
const observacionesInput = document.getElementById("observaciones");
const imagenInput = document.getElementById("imagen");

/* 🔹 AUDIO */
const btnGrabar = document.getElementById("btnGrabar");
const btnDetener = document.getElementById("btnDetener");
const audioPreview = document.getElementById("audioPreview");

let mediaRecorder;
let audioChunks = [];
let audioBlob = null;

/* 🎙️ GRABAR AUDIO */
btnGrabar.addEventListener("click", async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
  audioChunks = [];

  mediaRecorder.ondataavailable = e => {
    if (e.data.size > 0) audioChunks.push(e.data);
  };

  mediaRecorder.onstop = () => {
    audioBlob = new Blob(audioChunks, { type: "audio/webm" });

    const audioURL = URL.createObjectURL(audioBlob);
    audioPreview.src = audioURL;
    audioPreview.load();

    console.log("🎧 Audio listo:", audioBlob);
  };

  mediaRecorder.start();
  btnGrabar.disabled = true;
  btnDetener.disabled = false;
});

btnDetener.addEventListener("click", () => {
  mediaRecorder.stop();
  btnGrabar.disabled = false;
  btnDetener.disabled = true;
});

/* 💾 SUBMIT */
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const nombrePaciente = nombrePacienteInput.value.trim();
    const fechaRegistro = fechaRegistroInput.value;
    const especialista = especialistaInput.value;
    const diagnostico = diagnosticoInput.value;
    const terapia = terapiaInput.value;
    const observaciones = observacionesInput.value;

    if (!nombrePaciente || !fechaRegistro) {
      alert("Completa los campos obligatorios");
      return;
    }

    /* 📸 IMAGEN → CLOUDINARY */
    const imagenFile = imagenInput.files[0];
    if (!imagenFile) {
      alert("Debes subir una imagen");
      return;
    }

    const imgForm = new FormData();
    imgForm.append("file", imagenFile);
    imgForm.append("upload_preset", "Fono-Audio");

    const imgRes = await fetch(
      "https://api.cloudinary.com/v1_1/disjesee5/image/upload",
      { method: "POST", body: imgForm }
    );

    const imgData = await imgRes.json();
    const imagenUrl = imgData.secure_url;

    /* 🎧 AUDIO → CLOUDINARY */
    let audioUrl = "";

    if (audioBlob) {
      const audioForm = new FormData();
      audioForm.append("file", audioBlob);
      audioForm.append("upload_preset", "Fono-Audio");

      const audioRes = await fetch(
        "https://api.cloudinary.com/v1_1/disjesee5/video/upload",
        { method: "POST", body: audioForm }
      );

      const audioData = await audioRes.json();
      audioUrl = audioData.secure_url;
    }

    /* 🧾 FIRESTORE */
    await addDoc(collection(db, "PacientesRegistro"), {
      nombrePaciente,
      fechaRegistro,
      especialista,
      diagnostico,
      terapia,
      observaciones,
      imagenUrl,
      audioUrl,
      creadoEn: serverTimestamp()
    });

    alert("✅ Registro guardado correctamente");

    form.reset();
    audioPreview.src = "";
    audioBlob = null;

  } catch (error) {
    console.error(error);
    alert("❌ Error al guardar el registro");
  }
});
