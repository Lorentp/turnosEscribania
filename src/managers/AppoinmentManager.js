const Appointment = require("../models/Appoinment");

class AppointmentManager {
  async createAppointment(date, time, description) {
    // Validar día laborable (lunes a viernes)
    const inputDate = new Date(date);
    const day = inputDate.getDay();
    if (day === 0 || day === 6) {
      throw new Error("Los turnos solo se pueden crear de lunes a viernes");
    }

    // Validar horario (8:00 a 14:00)
    const [hours, minutes] = time.split(":").map(Number);
    if (
      hours < 8 ||
      hours > 14 ||
      (hours === 14 && minutes > 0) ||
      (minutes !== 0 && minutes !== 30)
    ) {
      throw new Error(
        "Los turnos deben ser entre 8:00 y 14:00, cada media hora"
      );
    }

    // Sumar un día a la fecha
    const adjustedDate = new Date(inputDate);
    // adjustedDate.setDate(inputDate.getDate() + 1);
    const formattedDate = adjustedDate.toISOString().split("T")[0]; // Formato YYYY-MM-DD

    // Validar máximo 2 turnos por slot
    const slotAppointments = await Appointment.countDocuments({
      date: formattedDate,
      time,
    });
    if (slotAppointments >= 2) {
      throw new Error("Ya hay 2 turnos en este horario");
    }

    const appointment = new Appointment({
      date: formattedDate,
      time,
      description,
    });
    return await appointment.save();
  }

  async deleteAppointment(id) {
    await Appointment.findByIdAndDelete(id);
  }

  async getAppointmentsByWeek(startOfWeek) {
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);

    const appointments = await Appointment.find({
      date: {
        $gte: startOfWeek.toISOString().split("T")[0],
        $lte: endOfWeek.toISOString().split("T")[0],
      },
    }).sort({ date: 1, time: 1 });

    // Convertir documentos a objetos simples
    return appointments.map((apt) => ({
      _id: apt._id.toString(),
      date: apt.date,
      time: apt.time,
      description: apt.description,
      createdAt: apt.createdAt,
    }));
  }
}
module.exports = new AppointmentManager();
