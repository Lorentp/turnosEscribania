const hbs = require("express-handlebars");

module.exports = {
  generateTimeSlots: () => {
    const slots = [];
    for (let hour = 8; hour < 14; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
      slots.push(`${hour.toString().padStart(2, "0")}:30`);
    }
    if (!slots.includes("14:00")) {
      slots.push("14:00");
    }
    return slots;
  },
  generateWeekDays: (startDate) => {
    const days = [];
    const start = new Date(startDate);
    for (let i = 0; i < 5; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      if (day.getDay() !== 0 && day.getDay() !== 6) {
        days.push(day);
      }
    }
    return days;
  },
  formatDate: (date) => {
    return new Date(date).toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  },
  isSameDay: (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  },
};
