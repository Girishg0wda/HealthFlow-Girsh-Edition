import { useState, useEffect } from "react";
import axios from "axios";
import TimePicker from "react-time-picker";
import BaseUrl from "../../BaseUrl";
import "./AppointmentPage.css";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";

const AppointmentPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const [form, setForm] = useState({
    patientName: "",
    date: "",
    time: "09:00",
    duration: 60,
    doctorId: "",
    status: "booked",
  });

  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const parseDateTime = (dateStr, timeStr) => {
    return new Date(`${dateStr}T${timeStr}`);
  };

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get(`${BaseUrl}/doctors/doctorsget`);
      setDoctors(response.data.data || []);
    } catch (error) {
      console.error("Error fetching doctors", error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(
        `${BaseUrl}/appointments/appointmentsget`
      );
      setAppointments(response.data.data || []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.patientName || !form.date || !form.time || !form.doctorId) {
      alert("Please fill in all fields before submitting!");
      return;
    }

    try {
      if (editingId) {
        const response = await axios.put(
          `${BaseUrl}/appointments/appointmentsedit/${editingId}`,
          form
        );
        if (response.data.message === "Appointment updated successfully") {
          alert("Appointment rescheduled successfully");
        }
      } else {
        const response = await axios.post(
          `${BaseUrl}/appointments/appointmentspost`,
          form
        );
        if (response.data.message === "Appointment created successfully") {
          alert("Appointment booked successfully");
        }
      }

      setForm({
        patientName: "",
        date: "",
        time: "",
        duration: 60,
        doctorId: "",
        status: "booked",
      });
      setEditingId(null);
      fetchAppointments();
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Error booking appointment: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `${BaseUrl}/appointments/appointmentsdelete/${id}`
      );
      if (response.status === 200) {
        alert("Appointment deleted successfully");
        fetchAppointments();
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${BaseUrl}/appointments/appointmentsedit/${id}`, {
        status,
      });
      alert(`Appointment marked as ${status}`);
      fetchAppointments();
    } catch (error) {
      console.error("Error updating status", error);
      alert("Failed to update status");
    }
  };

  const handleEdit = (appointment) => {
    setForm({
      patientName: appointment.patientName,
      date: new Date(appointment.date).toISOString().split("T")[0],
      time: appointment.time || "",
      duration: appointment.duration || 60,
      doctorId: appointment.doctorId || "",
      status: appointment.status || "booked",
    });
    setEditingId(appointment._id);
    setShowForm(true);
  };

  return (
    <div className="appointment-page">
      <h1 className="page-title">Appointment Management</h1>

      

      {showForm && (
        <form className="appointment-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Patient Name"
            value={form.patientName}
            onChange={(e) => setForm({ ...form, patientName: e.target.value })}
          />
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <div className="time-wrapper">
            <TimePicker
              onChange={(value) => setForm({ ...form, time: value })}
              value={form.time}
              format="hh:mm a"
              disableClock={true}
              clearIcon={null}
              clockIcon={null}
            />
          </div>
          <input
            type="number"
            min="5"
            max="120"
            placeholder="Duration (minutes)"
            value={form.duration}
            onChange={(e) =>
              setForm({ ...form, duration: Number(e.target.value) })
            }
          />
          <select
            value={form.doctorId}
            onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
          >
            <option value="">Select Doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor._id} value={doctor._id}>
                {doctor.name} ({doctor.specialization})
              </option>
            ))}
          </select>
          <button type="submit">
            {editingId ? "Update Appointment" : "Schedule Appointment"}
          </button>
        </form>
      )}

      <div className="appointments-list">
        <h2>Upcoming Appointments</h2>
        {appointments && appointments.length === 0 ? (
          <p>No appointments available</p>
        ) : (
          [...appointments]
            .filter((appointment) => appointment.status !== "completed")
            .sort((a, b) => {
              const dateTimeA = parseDateTime(a.date, a.time);
              const dateTimeB = parseDateTime(b.date, b.time);
              return dateTimeA - dateTimeB;
            })
            .map((appointment) => (
              <div className="appointment-card" key={appointment._id}>
                {/* <h3>Appointment Details</h3> */}

                <p>
                  <strong>Patient Name:</strong> {appointment.patientName}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(appointment.date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Time:</strong> {appointment.time}
                </p>
                <p>
                  <strong>Doctor:</strong> {appointment.doctorId?.name || "N/A"}
                </p>
                <p>
                  <strong>Status:</strong> {appointment.status}
                </p>

                <div className="dropdown-wrapper">
                  <button onClick={() => toggleDropdown(appointment._id)}>
                    Actions
                  </button>

                  {activeDropdown === appointment._id && (
                    <div className="appointment-actions">
                      {appointment.status === "booked" && (
                        <>
                          <button
                            onClick={() =>
                              updateStatus(appointment._id, "completed")
                            }
                          >
                            Mark as Completed
                          </button>
                          <button
                            onClick={() =>
                              updateStatus(appointment._id, "canceled")
                            }
                          >
                            Cancel Appointment
                          </button>
                        </>
                      )}
                      <button onClick={() => handleEdit(appointment)}>
                        Reschedule
                      </button>
                      <button
                        onClick={() => handleDelete(appointment._id)}
                        className="delete-button"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
        )}
      </div>
      <br/>
      <div className="form-toggle">
        <button onClick={() => setShowForm((prev) => !prev)}>
          {showForm ? "X" : "Book Appointment"}
        </button>
      </div>
    </div>
  );
};

export default AppointmentPage;
