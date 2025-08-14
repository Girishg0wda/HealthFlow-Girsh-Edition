const express = require("express");
const { Doctors, getDoctors, deleteDoctors, getDoctorsWithStatus} = require("../Controller/DoctorController");

const doctorsRouter = express.Router();

doctorsRouter.post("/doctorspost", Doctors);
doctorsRouter.get("/doctorsget", getDoctors);
doctorsRouter.delete("/doctorsdelete/:id", deleteDoctors);
doctorsRouter.get("/doctorsstatus", getDoctorsWithStatus);

module.exports = doctorsRouter;