import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB2XMWciNurV8oawf9EAQbCDySDySDPcNnr5g",
  authDomain: "fonoaudiologia-2bf21.firebaseapp.com",
  projectId: "fonoaudiologia-2bf21",
  storageBucket: "fonoaudiologia-2bf21.appspot.com",
  messagingSenderId: "645482975012",
  appId: "1:645482975012:web:3e3bed80ac3239f99aedb1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let mediaRecorder;
let audioChunks = [];
let audioGrabadoBase64 = null;

document.addEventListener("DOMContentLoaded", () => {

  const btnGrabar = document.getElementById("btnGrabar");
  const btnDetener = document.getElementById("btnDetener");
  const audioPreview = document.getElementById("audioPreview");
  const form = document.getElementById("registroForm");

  /* =======================
     GRABACIÓN DE AUDIO
  ======================= */
  btnGrabar.addEventListener("click", async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];

    mediaRecorder.ondataavailable = e => audioChunks.push(e.data);

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });

      if (audioBlob.size > 1024 * 1024) {
        alert("El audio grabado supera 1 MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        audioGrabadoBase64 = reader.result;
        audioPreview.src = audioGrabadoBase64;
      };
      reader.readAsDataURL(audioBlob);
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

  /* =======================
     ENVÍO DEL FORMULARIO
  ======================= */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      const nombrePaciente = document.getElementById("nombrePaciente").value.trim();
      const fechaRegistro = document.getElementById("fechaRegistro").value;
      const especialista = document.getElementById("especialista").value;
      const diagnostico = document.getElementById("diagnostico").value;
      const terapia = document.getElementById("terapia").value;
      const observaciones = document.getElementById("observaciones").value.trim();

      const audioFile = document.getElementById("audio").files[0];
      const imagenFile = document.getElementById("imagen").files[0];

      if (!imagenFile) {
        alert("Debes subir una imagen");
        return;
      }

      /* AUDIO: grabado o archivo */
      let audioBase64Final = audioGrabadoBase64;

      if (!audioBase64Final && audioFile) {
        if (audioFile.size > 1024 * 1024) {
          alert("El audio supera 1 MB");
          return;
        }

        audioBase64Final = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(audioFile);
        });
      }

      if (!audioBase64Final) {
        alert("Debes grabar o subir un audio");
        return;
      }

      const imagenBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(imagenFile);
      });

      await addDoc(collection(db, "PacientesRegistro"), {
        nombrePaciente,
        fechaRegistro,
        especialista,
        diagnostico,
        terapia,
        observaciones,
        audioBase64: audioBase64Final,
        imagenBase64,
        creadoEn: serverTimestamp()
      });

      alert("Registro guardado correctamente");
      form.reset();
      audioPreview.src = "";
      audioGrabadoBase64 = null;

    } catch (error) {
      console.error(error);
      alert("Error al guardar el registro");
    }
  });

});
