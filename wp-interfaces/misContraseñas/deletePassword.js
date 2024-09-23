function deletePassword(password_id) {
  const token = localStorage.getItem("token");

  if (!token) {
    showAlert(
      "No se encontró token, no se puede eliminar la contraseña.",
      "danger"
    );
    return;
  }

  fetch(`http://localhost:8000/passwords/${password_id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        showAlert(
          "Contraseña eliminada con éxito, refresque el sitio para ver los cambios!",
          "success"
        );
        // Volver a obtener las contraseñas después de eliminar una
        const user_id = getUserId();
        getPasswords(user_id);
      } else {
        showAlert("Error al eliminar la contraseña", "danger");
      }
    })
    .catch((error) => {
      showAlert("Error al realizar la solicitud de eliminación:", "danger");
    });
}
