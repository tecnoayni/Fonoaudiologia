import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      alert("Completa todos los campos");
      return;
    }

    try {
      const q = query(
        collection(db, "Usuarios"),
        where("nombreUsuario", "==", email),
        where("password", "==", password)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        alert("Inicio de sesión correcto");
        window.location.href = "menu.html"; // Redirige al menú
      } else {
        alert("Usuario o contraseña incorrectos");
      }

    } catch (error) {
      console.error(error);
      alert("Error al iniciar sesión");
    }
  });
});
