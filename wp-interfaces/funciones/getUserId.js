// Función para verificar el token y redirigir si no está presente
function getUserId() {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No encontre el token:", error);
    return;
  }

  // Si hay token, decodificarlo para obtener el user_id (opcional)
  try {
    const payload = JSON.parse(atob(token.split(".")[1])); // Decodificar el payload del JWT
    const user_id = payload.user_id; // Aquí obtienes el user_id del token

    console.log("Usuario logueado con ID: ", user_id);
    // Aquí puedes cargar contenido específico del usuario si lo deseas
  } catch (error) {
    console.error("Token inválido:", error);
    localStorage.removeItem("token");
  }
}
