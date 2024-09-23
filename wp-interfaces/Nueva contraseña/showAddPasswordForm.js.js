function showAddPasswordForm() {
  document.getElementById("passwordForm").style.display = "block"; // mostrar los input para añadir una pwd
  document.getElementById("newPasswordBtn").style.display = "none";
}

// para mostrar una alerta al usuario sobre si se agrego la contraseña o no
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

function getPasswords() {
  document.getElementById("passwordForm").style.display = "none";
  fetch("http://127.0.0.1:8000/passwords/?user_id=1")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      const accordion = document.getElementById("accordion");
      const passwordButtons = document.getElementById("passwordButtons");
      accordion.innerHTML = "";
      passwordButtons.innerHTML = "";
      data.forEach((password) => {
        const button = document.createElement("button");
        button.className = "passBtn btn btn-info mb-2 w-100 "; // cambiar el color con primary/info/secondary
        button.type = "button";
        button.setAttribute("data-bs-toggle", "collapse");
        button.setAttribute("data-bs-target", `#password-${password.id}`);
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-controls", `password-${password.id}`);
        button.textContent = password.title;

        const collapseDiv = document.createElement("div");
        collapseDiv.className = "collapse";
        collapseDiv.id = `password-${password.id}`;
        collapseDiv.setAttribute("data-bs-parent", "#accordion");

        const cardBody = document.createElement("div");
        cardBody.className = "card card-body";

        const titleElement = document.createElement("h2");
        titleElement.textContent = password.title;

        const ul = document.createElement("ul");

        const usernameLi = document.createElement("li");
        usernameLi.innerHTML = `<span>Username:</span> <strong>${password.username}</strong>`;

        const passwordLi = document.createElement("li");
        passwordLi.innerHTML = `<span>Password:</span> <strong>${password.password}</strong>`;

        ul.appendChild(usernameLi);
        ul.appendChild(passwordLi);

        cardBody.appendChild(titleElement);
        cardBody.appendChild(ul);
        collapseDiv.appendChild(cardBody);

        accordion.appendChild(collapseDiv);
        passwordButtons.appendChild(button);
      });
    })
    .catch((error) => {
      console.error("Error al obtener las contraseñas:", error);
    });
}

document.getElementById("myPasswords").addEventListener("click", getPasswords);
