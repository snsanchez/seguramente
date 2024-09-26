function verifyToken() {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");

    // Si no hay token, redirigir al login
    if (!token) {
      window.location.href = "https://seguramente.net.ar/loguearme/";
      return reject("No se encontró token.");
    }

    // Si hay token, decodificarlo para obtener el user_id
    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // Decodificar el payload del JWT
      const user_id = payload.user_id; // Aquí obtienes el user_id del token
      console.log("Usuario logueado con ID: ", user_id);
      resolve(user_id); // Resolvemos la promesa con el user_id
    } catch (error) {
      console.error("Token inválido:", error);
      localStorage.removeItem("token");
      window.location.href = "https://seguramente.net.ar/loguearme/";
      reject("Token inválido.");
    }
  });
}

window.onload = function () {
  setTimeout(function () {
    verifyToken()
      .then((user_id) => {
        getPasswords(user_id); // Obtener las contraseñas si el token es válido y se obtiene el user_id
      })
      .catch((error) => {
        console.error(error);
      });
  }, 1500);
};
