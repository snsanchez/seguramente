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

async function addPassword(user_id) {
  if (!user_id) {
    console.log("no se pudo obtener el userid");
    return;
  }

  const title = document.getElementById("title").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (!title || !username || !password) {
    showAlert("Todos los campos son obligatorios.", "warning");
    return;
  }

  try {
    const response = await fetch("https://seguramente.vercel.app/passwords/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: user_id,
        title: title,
        username: username,
        password: password,
      }),
    });

    if (response.ok) {
      showAlert("Contraseña agregada correctamente", "success");
    } else {
      showAlert(
        "Fallo al agregar la contraseña: " + response.statusText,
        "danger"
      );
    }
  } catch (error) {
    showAlert("Error de red: " + error.message, "danger");
  }
}
