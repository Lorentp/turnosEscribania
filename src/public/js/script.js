// Validar la fecha mínima en el input de fecha
document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.getElementById("date");
  if (dateInput) {
    const today = new Date();
    dateInput.min = today.toISOString().split("T")[0];
  }
});
