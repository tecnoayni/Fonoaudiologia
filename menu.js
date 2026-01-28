import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyB2XMWciNurV8oawf9EAQbCDySDPcNnr5g",
  authDomain: "fonoaudiologia-2bf21.firebaseapp.com",
  projectId: "fonoaudiologia-2bf21",
  storageBucket: "fonoaudiologia-2bf21.appspot.com",
  messagingSenderId: "645482975012",
  appId: "1:645482975012:web:3e3bed80ac3239f99aedb1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "Index.html";
  }
});

document.addEventListener("DOMContentLoaded", () => {
    const btnNuevoRegistro = document.getElementById("btnNuevoRegistro");
    const btnListaRegistros = document.getElementById("btnListaRegistros");
    const btnCerrarSesion = document.getElementById("btnCerrarSesion");

    if (btnNuevoRegistro) {
        btnNuevoRegistro.addEventListener("click", () => {
            window.location.href = "NuevoRegistro.html";
        });
    }

    if (btnListaRegistros) {
        btnListaRegistros.addEventListener("click", () => {
            window.location.href = "Lista.html";
        });
    }

    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener("click", async () => {
            await signOut(auth); // Cierra sesión
            window.location.href = "Index.html";
        });
    }
});
