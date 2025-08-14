const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, 
    ref: "Doctors", required: true },
  status: {
    type: String,
    enum: ["booked", "completed", "canceled"],
    default: "booked",
  }
});

const AppointmentModel = mongoose.model("Appointment", AppointmentSchema);

module.exports = AppointmentModel;
