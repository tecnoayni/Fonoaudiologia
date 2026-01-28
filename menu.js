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
        btnCerrarSesion.addEventListener("click", () => {
            window.location.href = "Index.html"; 
        });
    }
});

