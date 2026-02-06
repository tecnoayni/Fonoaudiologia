import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

/* ================== FIREBASE CONFIG ================== */
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
const storage = getStorage(app);

/* ================== AUDIO GRABACIÓN ================== */
let mediaRecorder;
let audioChunks = [];
let audioBlob = null;

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("registroForm");
  if (!form) return;

  const audioInput = document.getElementById("audio");
  const imagenInput = document.getElementById("imagen");

  const btnGrabar = document.getElementById("btnGrabar");
  const btnDetener = document.getElementById("btnDetener");
  const audioPreview = document.getElementById("audioPreview");

  /* ---------- GRABAR AUDIO ---------- */
  if (btnGrabar && btnDetener) {
    btnGrabar.addEventListener("click", async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();
      audioChunks = [];

      mediaRecorder.ondataavailable = e => audioChunks.push(e.data);

      mediaRecorder.onstop = () => {
        audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        audioPreview.src = URL.createObjectURL(audioBlob);

        // Si grabó audio, limpiar archivo subido
        audioInput.value = "";
      };

      btnGrabar.disabled = true;
      btnDetener.disabled = false;
    });

    btnDetener.addEventListener("click", () => {
      mediaRecorder.stop();
      btnGrabar.disabled = false;
      btnDetener.disabled = true;
    });
  }

  /* ================== GUARDAR REGISTRO ================== */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      const nombrePaciente = document.getElementById("nombrePaciente").value.trim();
      const fechaRegistro = document.getElementById("fechaRegistro").value;
      const especialista = document.getElementById("especialista").value;
      const diagnostico = document.getElementById("diagnostico").value;
      const terapia = document.getElementById("terapia").value;
      const observaciones = document.getElementById("observaciones").value.trim();

      const audioFile = audioInput.files[0];
      const imagenFile = imagenInput.files[0];

      if (!imagenFile) {
        alert("Debes subir una imagen");
        return;
      }

      if (!audioFile && !audioBlob) {
        alert("Debes subir un audio o grabar uno");
        return;
      }

      /* ---------- SUBIR IMAGEN ---------- */
      const imagenRef = ref(
        storage,
        `imagenes/${Date.now()}_${imagenFile.name}`
      );
      await uploadBytes(imagenRef, imagenFile);
      const imagenURL = await getDownloadURL(imagenRef);

      /* ---------- SUBIR AUDIO ---------- */
      let audioURL = "";

      if (audioBlob) {
        const audioRef = ref(
          storage,
          `audios/grabado_${Date.now()}.webm`
        );
        await uploadBytes(audioRef, audioBlob);
        audioURL = await getDownloadURL(audioRef);
      } else {
        const audioRef = ref(
          storage,
          `audios/${Date.now()}_${audioFile.name}`
        );
        await uploadBytes(audioRef, audioFile);
        audioURL = await getDownloadURL(audioRef);
      }

      /* ---------- GUARDAR EN FIRESTORE ---------- */
      await addDoc(collection(db, "PacientesRegistro"), {
        nombrePaciente,
        fechaRegistro,
        especialista,
        diagnostico,
        terapia,
        observaciones,
        audioURL,
        imagenURL,
        creadoEn: serverTimestamp()
      });

      alert("Registro guardado correctamente");
      form.reset();
      audioBlob = null;
      audioPreview.src = "";

    } catch (error) {
      console.error(error);
      alert("Error al guardar el registro");
    }
  });
});
