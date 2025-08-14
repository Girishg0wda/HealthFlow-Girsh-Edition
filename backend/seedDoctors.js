// seedDoctors.js
const mongoose = require("mongoose");
const DoctorsModel = require("./src/Model/DoctorModel"); // adjust path if needed

const doctorData = [

  {
    "name": "Dr. Shivaraj",
    "specialization": "General Physician",
    "availability": {
      "days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "startTime": "09:00",
      "endTime": "13:00"
    },
    "gender": "Male",
    "location": "Hassan, Karnataka"
  },
  {
    "name": "Dr. Anitha",
    "specialization": "Gynecologist",
    "availability": {
      "days": ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "startTime": "11:00",
      "endTime": "16:00"
    },
    "gender": "Female",
    "location": "Mysuru, Karnataka"
  },
  {
    "name": "Dr. Raghavendra",
    "specialization": "Urologist",
    "availability": {
      "days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "startTime": "10:00",
      "endTime": "14:00"
    },
    "gender": "Male",
    "location": "Mandya, Karnataka"
  },
  {
    "name": "Dr. Manjula Gowda",
    "specialization": "Pediatrician",
    "availability": {
      "days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "startTime": "10:00",
      "endTime": "13:30"
    },
    "gender": "Female",
    "location": "Tumakuru, Karnataka"
  },
  {
    "name": "Dr. Harish Gowda",
    "specialization": "Neurologist",
    "availability": {
      "days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "startTime": "14:00",
      "endTime": "18:00"
    },
    "gender": "Male",
    "location": "Bengaluru, Karnataka"
  },
  {
    "name": "Dr. Sahana Ramesh",
    "specialization": "Dermatologist",
    "availability": {
      "days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "startTime": "10:00",
      "endTime": "14:00"
    },
    "gender": "Female",
    "location": "Bengaluru, Karnataka"
  },
  {
    "name": "Dr. Vinay Hegde",
    "specialization": "Cardiologist",
    "availability": {
      "days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "startTime": "09:00",
      "endTime": "13:00"
    },
    "gender": "Male",
    "location": "Mangaluru, Karnataka"
  },
  {
    "name": "Dr. Pradeep Kulkarni",
    "specialization": "Orthopedic Surgeon",
    "availability": {
      "days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "startTime": "08:30",
      "endTime": "12:30"
    },
    "gender": "Male",
    "location": "Hubballi, Karnataka"
  },
  {
    "name": "Dr. Deepa Patil",
    "specialization": "ENT Specialist",
    "availability": {
      "days": ["Monday", "Wednesday", "Friday"],
      "startTime": "10:00",
      "endTime": "15:00"
    },
    "gender": "Female",
    "location": "Belagavi, Karnataka"
  }

];

mongoose.connect("mongodb://localhost:27017/clinic-system", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    await DoctorsModel.deleteMany({});
    await DoctorsModel.insertMany(doctorData);
    console.log("Doctor data seeded successfully!");
    process.exit();
  })
  .catch((err) => {
    console.error("Error seeding data:", err);
    process.exit(1);
  });
