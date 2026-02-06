import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
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

/* ================= AUDIO ================= */
let mediaRecorder;
let audioChunks = [];
let audioGrabadoBlob = null;

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("registroForm");
  const btnGrabar = document.getElementById("btnGrabar");
  const btnDetener = document.getElementById("btnDetener");

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

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      const nombrePaciente = val("nombrePaciente");
      const fechaRegistro = val("fechaRegistro");
      const especialista = val("especialista");
      const diagnostico = val("diagnostico");
      const terapia = val("terapia");
      const observaciones = val("observaciones");

      const imagenFile = file("imagen");
      const audioFile = audioGrabadoBlob || file("audio");

      if (!nombrePaciente || !fechaRegistro || !imagenFile || !audioFile) {
        alert("Faltan datos obligatorios");
        return;
      }

      const audioBase64 = await fileToBase64(audioFile);
      const imagenBase64 = await ultraCompressImage(imagenFile);

      // 1️⃣ Crear registro principal
      const docRef = await addDoc(collection(db, "PacientesRegistro"), {
        nombrePaciente,
        fechaRegistro,
        especialista,
        diagnostico,
        terapia,
        observaciones,
        audioBase64,
        creadoEn: serverTimestamp()
      });

      // 2️⃣ Guardar imagen en OTRA colección
      await setDoc(doc(db, "PacientesImagenes", docRef.id), {
        imagenBase64,
        creadoEn: serverTimestamp()
      });

      alert("Registro guardado correctamente ✅");
      form.reset();
      audioGrabadoBlob = null;

    } catch (err) {
      console.error(err);
      alert("Error: archivo demasiado grande ❌");
    }
  });
});

/* ================= HELPERS ================= */

const val = id => document.getElementById(id)?.value.trim();
const file = id => document.getElementById(id)?.files[0];

function fileToBase64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

/* ===== COMPRESIÓN EXTREMA ===== */
function ultraCompressImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = e => img.src = e.target.result;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const MAX = 400; // 🔥 más pequeño

      const scale = MAX / img.width;
      canvas.width = MAX;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      resolve(canvas.toDataURL("image/jpeg", 0.45)); // 🔥 calidad baja
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
