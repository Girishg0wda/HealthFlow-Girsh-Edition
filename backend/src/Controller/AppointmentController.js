const express = require("express");
const AppointmentModel = require("../Model/AppointmentModel");

const Appointments = async(req,res) => {

    const { patientName, date, time, doctorId,  status = "booked" } = req.body;
    
    if (!patientName || !date || !time || !doctorId) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    try {
        const newAppointment = new AppointmentModel({ patientName, date, time, doctorId, status });
        await newAppointment.save();
        res.status(201).json({ message: "Appointment created successfully", data: newAppointment });
    } catch (error) {
        res.status(500).json({ message: "Error creating appointment", error });
    }
}

const AppointmentsGet = async(req,res) => {
    try {
        const appointments = await AppointmentModel.find().populate("doctorId");
        res.status(200).json({ message: "Appointments retrieved successfully", data: appointments });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving appointments", error });
    }
}

const AppointmentUpdate = async (req, res) => {
    try{
        const { id } = req.params;
        const { patientName, date, time, doctorId, status } = req.body;

        const  updatedAppointment = await AppointmentModel.findByIdAndUpdate(
            id,
            {patientName, date, time, doctorId, status},
            {new: true}
        )

        if (!updatedAppointment) {
            return res.status(404).json({message: "Appointment not found"});
        }

        res.status(200).json({
            updatedAppointment,
            message: "Appointment updated successfully",
        })
    } catch (error) {
        console.log("Error updating:",error);
        res.status(500).json({message: "Error updating"});
    }
}

const AppointmentDelete = async (req, res) => {
    try{
        const { id } = req.params;
        await AppointmentModel.findByIdAndDelete(id);
        res.status(200).json({message:"Appointment deleted successfully"});
    } catch (err) {
        console.log("Error deleting Appointment", err);
        res.status(500).json({message:"Error deleting data"});
    }
}

module.exports = {
    Appointments,
    AppointmentsGet,
    AppointmentUpdate,
    AppointmentDelete
};