function updatePassword() {
  const passwordId = document
    .getElementById("submitEditPassword")
    .getAttribute("data-password-id");

  const title = document.getElementById("modal-title").value;
  const username = document.getElementById("modal-username").value;
  const password = document.getElementById("modal-password").value;

  // Creo un objeto para almacenar los datos
  const updatedData = {
    title: title || "", // Asignar el valor o una cadena vacía si no hay valor
    username: username || "",
    password: password || "",
  };

  fetch(`https://seguramente.vercel.app/passwords/${passwordId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Contraseña actualizada:", data);
      // Cerrar el modal
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("editPasswordModal")
      );
      modal.hide();

      // Recargar la página después de cerrar el modal
      modal._element.addEventListener("hidden.bs.modal", () => {
        location.reload(); // Recargar la página
      });
    })
    .catch((error) => {
      console.error("Error al actualizar la contraseña:", error);
    });
}
