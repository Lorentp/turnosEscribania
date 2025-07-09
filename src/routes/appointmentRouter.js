const express = require("express");
const router = express.Router();
const AppointmentManager = require("../managers/AppoinmentManager");
const NotesManager = require("../managers/NotesManager");


// Obtener la fecha de inicio de la semana actual
const getStartOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

// Mostrar calendario de turnos
router.get("/", async (req, res) => {
  const weekOffset = parseInt(req.query.weekOffset) || 0;
  const today = new Date();
  const startOfWeek = new Date(today.setDate(today.getDate() + weekOffset * 7));
  const weekStart = getStartOfWeek(startOfWeek);

  const appointments = await AppointmentManager.getAppointmentsByWeek(
    weekStart
  );

  const notes = await NotesManager.getNotes()

  res.render("appointments", {
    appointments,
    notes,
    weekStart,
    prevWeek: weekOffset - 1,
    nextWeek: weekOffset + 1,
  });
});

// Crear turno
router.post("/create", async (req, res) => {
  const { date, time, description } = req.body;
  try {
    await AppointmentManager.createAppointment(date, time, description);
    res.redirect("/appointments");
  } catch (error) {
    res.render("appointments", {
      error: error.message,
      appointments: await AppointmentManager.getAppointmentsByWeek(
        getStartOfWeek(new Date())
      ),
      weekStart: getStartOfWeek(new Date()),
      prevWeek: 0,
      nextWeek: 0,
    });
  }
});
//Crear Nota

router.post("/create-note", async (req,res) => {
  const {note} = req.body

  try {
    await NotesManager.createNote(note)
    res.redirect("/appointments")
  } catch (error) {
    res.send(error)
  }
})

// Eliminar turno
router.post("/delete/:id", async (req, res) => {
  await AppointmentManager.deleteAppointment(req.params.id);
  res.redirect("/appointments");
});

router.post("/delete-note/:id", async (req,res) => {
  await NotesManager.deleteNote(req.params.id)
  res.redirect("/appointments")
})

module.exports = router;
