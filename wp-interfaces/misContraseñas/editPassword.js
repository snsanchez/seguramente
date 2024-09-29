function editPassword(passwordId) {
  const titleElement = document.getElementById(
    `title-${passwordId}`
  ).textContent;
  const usernameElement = document
    .getElementById(`username-${passwordId}`)
    .textContent.split(": ")[1]; // Solo el valor después de ": "
  const passwordElement = document
    .getElementById(`password-${passwordId}`)
    .textContent.split(": ")[1]; // Solo el valor después de ": "

  // Prellenar los campos del modal
  document.getElementById("modal-title").value = titleElement;
  document.getElementById("modal-username").value = usernameElement;
  document.getElementById("modal-password").value = passwordElement;

  // Guardar el ID de la contraseña para usarlo en la actualización
  document
    .getElementById("submitEditPassword")
    .setAttribute("data-password-id", passwordId);

  // Mostrar el modal
  const modal = new bootstrap.Modal(
    document.getElementById("editPasswordModal")
  );
  modal.show();
}
