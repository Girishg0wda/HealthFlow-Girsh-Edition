const express = require ("express");
const bodyParser = require("body-parser");
const cors = require ("cors")
const LoginRouter = require("./src/Router/LoginRouter");
const appointmentRouter = require("./src/Router/AppointmentRouter");
const doctorsRouter = require("./src/Router/DoctorRouter");

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use("/login", LoginRouter);
app.use("/appointments", appointmentRouter);
app.use("/doctors", doctorsRouter);

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

module.exports = app;