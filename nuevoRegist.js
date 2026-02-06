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
  messagingSenderId: "645482975012",
  appId: "1:645482975012:web:3e3bed80ac3239f99aedb1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ================= AUDIO ================= */
let mediaRecorder;
let audioChunks = [];
let audioGrabadoBlob = null;

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("registroForm");
  const btnGrabar = document.getElementById("btnGrabar");
  const btnDetener = document.getElementById("btnDetener");
  const audioInput = document.getElementById("audio");

  /* ===== GRABAR AUDIO ===== */
  btnGrabar?.addEventListener("click", async () => {
    audioChunks = [];
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
    mediaRecorder.onstop = () => {
      audioGrabadoBlob = new Blob(audioChunks, { type: "audio/webm" });
      alert("Audio grabado ✔");
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

  /* ===== SUBMIT ===== */
  form?.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      const nombrePaciente = nombrePacienteInput("nombrePaciente");
      const fechaRegistro = value("fechaRegistro");
      const especialista = value("especialista");
      const diagnostico = value("diagnostico");
      const terapia = value("terapia");
      const observaciones = value("observaciones");
      const imagenFile = file("imagen");

      let audioFile = audioGrabadoBlob || file("audio");

      if (!nombrePaciente || !fechaRegistro || !especialista || !imagenFile || !audioFile) {
        alert("Completa todos los campos obligatorios");
        return;
      }

      /* ===== CONVERSIÓN ===== */
      const audioBase64 = await fileToBase64(audioFile);
      const imagenBase64 = await compressImage(imagenFile);

      await addDoc(collection(db, "PacientesRegistro"), {
        nombrePaciente,
        fechaRegistro,
        especialista,
        diagnostico,
        terapia,
        observaciones,
        audioBase64,
        imagenBase64,
        creadoEn: serverTimestamp()
      });

      alert("Registro guardado correctamente ✅");
      form.reset();
      audioGrabadoBlob = null;

    } catch (err) {
      console.error(err);
      alert("Error: el archivo es demasiado grande ❌");
    }
  });
});

/* ================= HELPERS ================= */

function value(id) {
  return document.getElementById(id)?.value.trim();
}

function file(id) {
  return document.getElementById(id)?.files[0];
}

function nombrePacienteInput(id) {
  return document.getElementById(id)?.value.trim();
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ===== COMPRESIÓN DE IMAGEN ===== */
function compressImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = e => img.src = e.target.result;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const MAX_WIDTH = 600;

      const scale = MAX_WIDTH / img.width;
      canvas.width = MAX_WIDTH;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      resolve(canvas.toDataURL("image/jpeg", 0.6)); // 🔥 clave
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
