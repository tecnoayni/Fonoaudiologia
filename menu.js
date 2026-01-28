import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
    const auth = getAuth();

    const btnNuevoRegistro = document.getElementById("btnNuevoRegistro");
    const btnListaRegistros = document.getElementById("btnListaRegistros");
    const btnCerrarSesion = document.getElementById("btnCerrarSesion");

    btnNuevoRegistro?.addEventListener("click", () => {
        window.location.href = "NuevoRegistro.html";
    });

    btnListaRegistros?.addEventListener("click", () => {
        window.location.href = "Lista.html";
    });

    btnCerrarSesion?.addEventListener("click", () => {
        signOut(auth).then(() => {
            window.location.href = "Index.html";
        }).catch((error) => {
            alert("Error al cerrar sesión");
            console.error(error);
        });
    });
});

