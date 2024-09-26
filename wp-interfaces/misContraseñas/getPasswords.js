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

function getPasswords(user_id) {
  if (!user_id) {
    console.log("no se pudo obtener el userid");
    return;
  }

  // paso el userid en la url
  fetch(`https://seguramente.vercel.app/passwords?user_id=${user_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
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

        // Aquí agregamos los botones de Editar y Eliminar
        const editButton = document.createElement("button");
        editButton.className = "btn btn-warning edit-btn";
        editButton.textContent = "Editar";
        editButton.setAttribute("onclick", `editPassword(${password.id})`); // Se llamará la función editPassword

        const deleteButton = document.createElement("button");
        deleteButton.className = "btn btn-danger delete-btn";
        deleteButton.textContent = "Eliminar";
        deleteButton.setAttribute("onclick", `deletePassword(${password.id})`); // Se llamará la función deletePassword

        cardBody.appendChild(titleElement);
        cardBody.appendChild(ul);
        cardBody.appendChild(editButton);
        cardBody.appendChild(deleteButton);

        collapseDiv.appendChild(cardBody);

        accordion.appendChild(collapseDiv);
        passwordButtons.appendChild(button);
      });
    })
    .catch((error) => {
      console.error("Error al obtener las contraseñas:", error);
    });
}
