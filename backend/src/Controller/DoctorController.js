const express = require("express");
const DoctorsModel = require('../Model/DoctorModel');
const AppointmentModel = require("../Model/AppointmentModel");


const Doctors = async (req, res) => {
    
    const {name, specialization, availability, gender, location,} = req.body;

    if (!name || !specialization || !availability || !gender || !location) {
        return res.status(400).json({ success: false, message: "Missing fields" });
    }

    try{
        const newDoctor = new DoctorsModel(
            {name, 
            specialization, 
            availability, 
            gender, 
            location,});
        await newDoctor.save();
        res.status(201).json({message:"Doctor added successfully"})
    } catch (error) {
        res.status(500).json({message:"Error adding docter", error});
    }
}

const getDoctors = async (req, res) => {
    try{
        const Doctors = await DoctorsModel.find();
        res.status(200).json({message:"", data: Doctors});
    } catch (error) {
        res.status(500).json({message:"Error",error});
    }
}

const deleteDoctors = async (req, res) => {
    try{
        const { id } = req.params;
        await DoctorsModel.findByIdAndDelete(id);
        res.status(200).json({message:"Docter deleted successfully"});
    } catch (error) {
        res.status(500).json({message:"Error deleting doctor", error});
    }
}



// Convert "HH:mm" string to total minutes
const formatTime24to12 = (time24) => {
  const [hourStr, minute] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12; // convert 0 to 12
  return `${hour}:${minute} ${ampm}`;
};

const isCurrentTimeBusy = (appointments, currentTime) => {
  const [currHour, currMinute] = currentTime.split(":").map(Number);
  const currentMinutes = currHour * 60 + currMinute;

  return appointments.some((appointment) => {
    const [startHour, startMinute] = appointment.startTime.split(":").map(Number);
    const [endHour, endMinute] = appointment.endTime.split(":").map(Number);

    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  });
};


const getDoctorsWithStatus = async (req, res) => {
  const now = new Date();
  const currentDay = now.toLocaleString("en-US", { weekday: "long" });
  const currentTime = now.toTimeString().slice(0, 5); // "HH:mm"
  const todayDate = now.toISOString().split("T")[0]; // "YYYY-MM-DD"

  try {
    const doctors = await DoctorsModel.find();

    const enrichedDoctors = await Promise.all(
      doctors.map(async (doc) => {
        const { days = [], startTime, endTime } = doc.availability || {};
        let status = "Off Duty";
        let nextAvailable = "Check schedule";

        if (days.includes(currentDay)) {
          if (currentTime >= startTime && currentTime <= endTime) {
            const todaysAppointments = await AppointmentModel.find({
              doctorId: doc._id,
              date: todayDate,
              status: "booked",
            });

            const busy = isCurrentTimeBusy(todaysAppointments, currentTime);

            if (busy) {
              status = "Busy";
              nextAvailable = formatTime24to12(endTime);
            } else {
              status = "Available";
              nextAvailable = "Now";
            }
          } else {
            status = "Off Duty";
            nextAvailable = formatTime24to12(startTime);
          }
        }

        return {
          ...doc.toObject(),
          status,
          nextAvailable,
        };
      })
    );

    res.status(200).json({ data: enrichedDoctors });
  } catch (error) {
    console.error("Error in doctor status check:", error);
    res.status(500).json({ message: "Server error", error });
  }
};





module.exports = {
    Doctors,
    getDoctors,
    deleteDoctors,
    getDoctorsWithStatus
}