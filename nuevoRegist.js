import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ================= FIREBASE ================= */
const firebaseConfig = {
  apiKey: "AIzaSyB2XMWciNurV8oawf9EAQbCDySDPcNnr5g",
  authDomain: "fonoaudiologia-2bf21.firebaseapp.com",
  projectId: "fonoaudiologia-2bf21",
  appId: "1:645482975012:web:3e3bed80ac3239f99aedb1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ================= CLOUDINARY ================= */
const CLOUD_NAME = "disjesee5";
const UPLOAD_PRESET = "Fono-Audio";

/* ================= AUDIO ================= */
let mediaRecorder;
let audioChunks = [];
let audioGrabadoBlob = null;

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("registroForm");
  const btnGrabar = document.getElementById("btnGrabar");
  const btnDetener = document.getElementById("btnDetener");

  /* ===== GRABAR AUDIO ===== */
  btnGrabar?.addEventListener("click", async () => {
    audioChunks = [];

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = e => audioChunks.push(e.data);

    mediaRecorder.onstop = () => {
      audioGrabadoBlob = new Blob(audioChunks, { type: "audio/webm" });
      alert("Audio grabado correctamente 🎤");
    };

    mediaRecorder.start();
    btnGrabar.disabled = true;
    btnDetener.disabled = false;
  });

  btnDetener?.addEventListener("click", () => {
    mediaRecorder.stop();
    btnGrabar.disabled = false;
    btnDetener.disabled = true;
  });

  /* ===== GUARDAR REGISTRO ===== */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      const nombrePaciente = val("nombrePaciente");
      const fechaRegistro = val("fechaRegistro");
      const especialista = val("especialista");
      const diagnostico = val("diagnostico");
      const terapia = val("terapia");
      const observaciones = val("observaciones");

      // Puede venir de grabación o archivo
      const audioFile = audioGrabadoBlob || file("audio");

      if (!nombrePaciente || !fechaRegistro || !especialista || !audioFile) {
        alert("Completa los campos obligatorios");
        return;
      }

      /* ===== SUBIR AUDIO A CLOUDINARY ===== */
      const audioUrl = await uploadAudioCloudinary(audioFile);

      /* ===== GUARDAR EN FIRESTORE ===== */
      await addDoc(collection(db, "PacientesRegistro"), {
        nombrePaciente,
        fechaRegistro,
        especialista,
        diagnostico,
        terapia,
        observaciones,
        audioUrl,
        creadoEn: serverTimestamp()
      });

      alert("Registro guardado correctamente ✅");
      form.reset();
      audioGrabadoBlob = null;

    } catch (error) {
      console.error(error);
      alert("Error al guardar el registro ❌");
    }
  });
});

/* ================= FUNCIONES AUXILIARES ================= */

const val = id => document.getElementById(id)?.value.trim();
const file = id => document.getElementById(id)?.files[0];

/* ===== SUBIR AUDIO A CLOUDINARY ===== */
async function uploadAudioCloudinary(audioFile) {
  const formData = new FormData();
  formData.append("file", audioFile);
  formData.append("upload_preset", UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
    {
      method: "POST",
      body: formData
    }
  );

  if (!response.ok) {
    throw new Error("Error al subir el audio a Cloudinary");
  }

  const data = await response.json();
  return data.secure_url; // 🔥 URL pública
}
