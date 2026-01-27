import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("registroForm");
  if (!form) return;

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

      if (!audioFile || !imagenFile) {
        alert("Debes subir un archivo de audio y una imagen");
        return;
      }

      const audioBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(audioFile);
      });

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
        audioBase64,
        imagenBase64,
        creadoEn: serverTimestamp()
      });

      alert("Registro guardado correctamente");
      form.reset();

    } catch (error) {
      alert("Error al guardar el registro");
    }
  });
});
