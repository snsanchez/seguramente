function editPassword(passwordId) {
  const titleElement = document.getElementById(
    `title-${passwordId}`
  ).textContent;
  const usernameElement = document
    .getElementById(`username-${passwordId}-user`)
    .querySelector("strong").textContent;

  const passwordElement = document
    .getElementById(`password-${passwordId}-pass`)
    .querySelector("strong").textContent;

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
