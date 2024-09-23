function showAlert(message, type) {
  const alertContainer = document.getElementById("alertContainer");
  const alert = document.createElement("div");
  alert.className = `alert alert-${type} alert-dismissible fade show`;
  alert.role = "alert";
  alert.innerHTML = `
  ${message}
  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
  alertContainer.appendChild(alert);

  if (type !== "warning") {
    // Sólo ocultar automáticamente si no es una advertencia
    setTimeout(() => {
      alert.classList.remove("show");
      alert.classList.add("hide");
      setTimeout(() => {
        alertContainer.removeChild(alert);
      }, 500);
    }, 3000);
  }
  // Agregar evento de clic manualmente al botón de cierre
  const closeButton = alert.querySelector(".btn-close");
  closeButton.addEventListener("click", () => {
    alertContainer.removeChild(alert);
  });
}
