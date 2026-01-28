document.addEventListener("DOMContentLoaded", () => {
  const usuario = localStorage.getItem("usuarioLogueado");
  if (!usuario) {
    window.location.href = "Index.html";
    return;
  }

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
      localStorage.removeItem("usuarioLogueado");
      window.location.href = "Index.html";
    });
  }
});


