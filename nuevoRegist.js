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

document.getElementById("registroForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const nombrePaciente = nombrePacienteInput.value.trim();
    const fechaRegistro = fechaRegistroInput.value;
    const especialista = especialistaInput.value;
    const diagnostico = diagnosticoInput.value;
    const terapia = terapiaInput.value;
    const observaciones = observacionesInput.value;

    const imagenFile = document.getElementById("imagen").files[0];
    if (!imagenFile) {
      alert("Debe subir una imagen");
      return;
    }

    // 📸 SUBIR IMAGEN A FIREBASE STORAGE
    const imgRef = ref(
      storage,
      `imagenes/${Date.now()}_${imagenFile.name}`
    );

    await uploadBytes(imgRef, imagenFile);
    const imagenUrl = await getDownloadURL(imgRef);

    // 🧠 GUARDAR REGISTRO
    await addDoc(collection(db, "PacientesRegistro"), {
      nombrePaciente,
      fechaRegistro,
      especialista,
      diagnostico,
      terapia,
      observaciones,
      imagenUrl,      // ✅ URL NORMAL
      audioUrl,       // (Cloudinary)
      creadoEn: serverTimestamp()
    });

    alert("Registro guardado correctamente");
    e.target.reset();

  } catch (err) {
    console.error(err);
    alert("Error al guardar");
  }
});
