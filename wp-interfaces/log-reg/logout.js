async function logoutUser() {
  // Función de logout
  document
    .getElementById("logoutButton")
    .addEventListener("click", function () {
      // Borrar el token del localStorage
      localStorage.removeItem("token");

      // Redirigir a la página de inicio o login
      window.location.href = "http://localhost/wordpress/index.php/";
    });
}
