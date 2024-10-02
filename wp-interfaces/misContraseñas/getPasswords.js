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
        button.className = "passBtn btn btn-primary mb-2 w-100 text-white"; // cambiar el color con primary/info/secondary
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
        cardBody.className = "card card-body text-dark"; // todo el texto negro

        const titleElement = document.createElement("h2");
        titleElement.textContent = password.title;
        titleElement.id = `title-${password.id}`;

        const ul = document.createElement("ul");
        ul.className = "p-0";

        const usernameLi = document.createElement("li");
        usernameLi.innerHTML = `<span>Usuario:</span> <strong>${password.username}</strong>`;
        usernameLi.id = `username-${password.id}-user`;
        usernameLi.className = "text-start";

        const passwordLi = document.createElement("li");
        passwordLi.innerHTML = `<span>Contraseña:</span> <strong>${password.password}</strong>`;
        passwordLi.id = `password-${password.id}-pass`;
        passwordLi.className = "text-start";

        ul.appendChild(usernameLi);
        ul.appendChild(passwordLi);

        const editButton = document.createElement("button");
        editButton.className = "btn btn-outline-dark edit-btn mb-3"; // boton gris
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
