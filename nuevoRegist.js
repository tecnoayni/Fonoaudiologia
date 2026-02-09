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

/* 🔹 Firebase */
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

/* 🔹 FORM */
const form = document.getElementById("registroForm");

/* 🔹 AUDIO grabado */
let audioBlob = null;

/* 🎙️ Grabación */
let mediaRecorder;
let chunks = [];

const btnGrabar = document.getElementById("btnGrabar");
const btnDetener = document.getElementById("btnDetener");
const audioPreview = document.getElementById("audioPreview");

btnGrabar.onclick = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);
  chunks = [];

  mediaRecorder.ondataavailable = e => chunks.push(e.data);

  mediaRecorder.onstop = () => {
    audioBlob = new Blob(chunks, { type: "audio/webm" });
    audioPreview.src = URL.createObjectURL(audioBlob);
  };

  mediaRecorder.start();
  btnGrabar.disabled = true;
  btnDetener.disabled = false;
};

btnDetener.onclick = () => {
  mediaRecorder.stop();
  btnGrabar.disabled = false;
  btnDetener.disabled = true;
};

/* 🔹 SUBMIT */
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const nombrePaciente = document.getElementById("nombrePaciente").value.trim();
    const fechaRegistro = document.getElementById("fechaRegistro").value;
    const especialista = document.getElementById("especialista").value;
    const diagnostico = document.getElementById("diagnostico").value;
    const terapia = document.getElementById("terapia").value;
    const observaciones = document.getElementById("observaciones").value;

    /* 📸 IMAGEN */
    const imagenFile = document.getElementById("imagen").files[0];
    if (!imagenFile) {
      alert("Debes subir una imagen");
      return;
    }

    /* 📸 SUBIR IMAGEN → FIREBASE */
    const imgRef = ref(storage, `imagenes/${Date.now()}_${imagenFile.name}`);
    await uploadBytes(imgRef, imagenFile);
    const imagenUrl = await getDownloadURL(imgRef);

    /* 🎧 AUDIO → CLOUDINARY */
    let audioUrl = "";

    const audioInputFile = document.getElementById("audio").files[0];
    const audioFinal = audioBlob || audioInputFile;

    if (audioFinal) {
      const formData = new FormData();
      formData.append("file", audioFinal);
      formData.append("upload_preset", "disjesee5");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/disjesee5/video/upload",
        { method: "POST", body: formData }
      );

      const data = await res.json();
      audioUrl = data.secure_url;
    }

    /* 💾 FIRESTORE */
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

    alert("Registro guardado correctamente");
    form.reset();
    audioPreview.src = "";
    audioBlob = null;

  } catch (err) {
    console.error(err);
    alert("Error al guardar el registro");
  }
});
