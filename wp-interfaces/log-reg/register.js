async function addUser() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const email = document.getElementById("email").value;

  if (!username || !password || !email) {
    showAlert("Todos los campos son obligatorios.", "warning");
    return;
  }

  if (password.length < 8) {
    showAlert("La contraseña debe tener al menos 5 caracteres.", "warning");
    return;
  }
  try {
    const response = await fetch("https://seguramente.vercel.app/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
        email: email,
      }),
    });

    if (response.ok) {
      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("token", result.token);
        showAlert("Usuario agregado correctamente", "success");
        window.location.href = "https://seguramente.net.ar/dashboard/";
      } else {
        showAlert("Registro exitoso, pero no se recibió el token", "warning");
      }
    } else {
      showAlert("Fallo al registrar usuario: " + response.statusText, "danger");
    }
  } catch (error) {
    showAlert("Error de red: " + error.message, "danger");
  }
}
