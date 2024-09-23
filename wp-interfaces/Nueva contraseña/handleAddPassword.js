function handleAddPassword() {
  verifyToken()
    .then((user_id) => {
      addPassword(user_id);
    })
    .catch((error) => {
      console.error(error);
    });
}
