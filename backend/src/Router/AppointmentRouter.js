const express = require ("express");

const { Appointments, AppointmentsGet, AppointmentUpdate, AppointmentDelete } = require ("../Controller/AppointmentController");

const appointmentRouter = express.Router();

appointmentRouter.post("/appointmentspost", Appointments);
appointmentRouter.get("/appointmentsget", AppointmentsGet);
appointmentRouter.put("/appointmentsedit/:id",AppointmentUpdate);
appointmentRouter.delete("/appointmentsdelete/:id",AppointmentDelete)

module.exports = appointmentRouter;
