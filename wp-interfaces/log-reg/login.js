async function loginUser() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (!username || !password) {
    showAlert("Todos los campos son obligatorios.", "warning");
    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:8000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const token = data.access_token;

      if (token) {
        localStorage.setItem("token", token);

        showAlert("Estás dentro!", "success");
        window.location.href =
          "http://localhost/wordpress/index.php/dashboard/";
      } else {
        showAlert("Logueo exitoso, pero no se recibió el token", "warning");
      }
    } else {
      showAlert("Fallo al loguear usuario: " + response.statusText, "danger");
    }
  } catch (error) {
    showAlert("Error de red: " + error.message, "danger");
  }
}
