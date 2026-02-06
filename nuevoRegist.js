import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ================= FIREBASE CONFIG ================= */
const firebaseConfig = {
  apiKey: "AIzaSyB2XMWciNurV8oawf9EAQbCDySDPcNnr5g",
  authDomain: "fonoaudiologia-2bf21.firebaseapp.com",
  projectId: "fonoaudiologia-2bf21",
  storageBucket: "fonoaudiologia-2bf21.appspot.com", // NO SE USA
  messagingSenderId: "645482975012",
  appId: "1:645482975012:web:3e3bed80ac3239f99aedb1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ================= VARIABLES AUDIO ================= */
let mediaRecorder;
let audioChunks = [];
let audioGrabadoBlob = null;

/* ================= DOM READY ================= */
document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("registroForm");
  const btnGrabar = document.getElementById("btnGrabar");
  const btnDetener = document.getElementById("btnDetener");
  const audioInput = document.getElementById("audio");

  /* ======== GRABAR AUDIO ======== */
  if (btnGrabar) {
    btnGrabar.addEventListener("click", async () => {
      audioChunks = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = e => audioChunks.push(e.data);

      mediaRecorder.onstop = () => {
        audioGrabadoBlob = new Blob(audioChunks, { type: "audio/webm" });
        alert("Audio grabado correctamente");
      };

      mediaRecorder.start();
      btnGrabar.disabled = true;
      btnDetener.disabled = false;
    });
  }

  /* ======== DETENER GRABACIÓN ======== */
  if (btnDetener) {
    btnDetener.addEventListener("click", () => {
      mediaRecorder.stop();
      btnGrabar.disabled = false;
      btnDetener.disabled = true;
    });
  }

  /* ======== SUBMIT FORM ======== */
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      /* ===== CAMPOS ===== */
      const nombrePaciente = document.getElementById("nombrePaciente").value.trim();
      const fechaRegistro = document.getElementById("fechaRegistro").value;
      const especialista = document.getElementById("especialista").value;
      const diagnostico = document.getElementById("diagnostico").value;
      const terapia = document.getElementById("terapia").value;
      const observaciones = document.getElementById("observaciones").value.trim();
      const imagenFile = document.getElementById("imagen").files[0];

      if (!nombrePaciente || !fechaRegistro || !especialista || !imagenFile) {
        alert("Completa los campos obligatorios");
        return;
      }

      /* ===== AUDIO: grabado o archivo ===== */
      let audioFile = audioGrabadoBlob || audioInput.files[0];

      if (!audioFile) {
        alert("Debes grabar o subir un audio");
        return;
      }

      /* ===== CONVERTIR A BASE64 ===== */
      const audioBase64 = await fileToBase64(audioFile);
      const imagenBase64 = await fileToBase64(imagenFile);

      /* ===== GUARDAR EN FIRESTORE ===== */
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

    } catch (error) {
      console.error(error);
      alert("Error al guardar el registro ❌");
    }
  });
});

/* ================= UTIL BASE64 ================= */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
