const mongoose = require("mongoose");

const DoctorsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  availability: { 
    days: [String], 
    startTime: String, 
    endTime: String },
  gender: { type: String, required: true },
  location: { type: String, required: true },
});

const DoctorsModel = mongoose.model("Doctors", DoctorsSchema);

module.exports = DoctorsModel;
