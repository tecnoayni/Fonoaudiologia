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

/* 🔹 Firebase config */
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

/* 🔹 Form */
const form = document.getElementById("registroForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    // 📝 Inputs
    const nombrePaciente = document.getElementById("nombrePaciente").value.trim();
    const fechaRegistro = document.getElementById("fechaRegistro").value;
    const especialista = document.getElementById("especialista").value;
    const diagnostico = document.getElementById("diagnostico").value;
    const terapia = document.getElementById("terapia").value;
    const observaciones = document.getElementById("observaciones").value;

    // 📸 Imagen
    const imagenFile = document.getElementById("imagen").files[0];
    if (!imagenFile) {
      alert("Debes subir una imagen");
      return;
    }

    // 🎧 Audio (Cloudinary ya guardado → solo URL)
    const audioUrl = document.getElementById("audioUrl")?.value || "";

    // 📸 Subir imagen a Firebase Storage
    const imgRef = ref(
      storage,
      `imagenes/${Date.now()}_${imagenFile.name}`
    );

    await uploadBytes(imgRef, imagenFile);
    const imagenUrl = await getDownloadURL(imgRef);

    // 💾 Guardar en Firestore
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

  } catch (error) {
    console.error(error);
    alert("Error al guardar el registro");
  }
});
