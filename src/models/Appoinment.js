const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  date: { type: String, required: true }, // Formato: YYYY-MM-DD
  time: { type: String, required: true }, // Formato: HH:MM
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Appointment", appointmentSchema);
