import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB2XMWciNurV8oawf9EAQbCDySDPcNnr5g",
  authDomain: "fonoaudiologia-2bf21.firebaseapp.com",
  projectId: "fonoaudiologia-2bf21",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const form = document.getElementById("registroForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const nombrePaciente = nombrePaciente.value.trim();
    const fechaRegistro = fechaRegistroInput.value;
    const especialista = especialistaInput.value;
    const diagnostico = diagnosticoInput.value;
    const terapia = terapiaInput.value;
    const observaciones = observacionesInput.value;

    // 📸 Imagen (Cloudinary)
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

    // 🎧 Audio (ya grabado o subido)
    const audioUrl = window.audioCloudinaryUrl || "";

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

  } catch (err) {
    console.error(err);
    alert("Error al guardar");
  }
});
