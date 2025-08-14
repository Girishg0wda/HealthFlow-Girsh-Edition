import { useState, useEffect } from "react";
import axios from "axios";
import BaseUrl from "../../BaseUrl";
import "./QueueManagement.css";

const QueueManagementPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [filterDoctor, setFilterDoctor] = useState("");
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
    const interval = setInterval(() => {
      fetchAppointments();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`${BaseUrl}/appointments/appointmentsget`);
      const sorted = (response.data.data || []).sort((a, b) => {
        const dateTimeA = new Date(`${a.date}T${a.time}`);
        const dateTimeB = new Date(`${b.date}T${b.time}`);
        return dateTimeA - dateTimeB;
      });
      setAppointments(sorted);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${BaseUrl}/doctors/doctorsget`);
      setDoctors(res.data.data || []);
    } catch (error) {
      console.error("Error fetching doctors", error);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`${BaseUrl}/appointments/appointmentsedit/${id}`, {
        status: newStatus,
      });
      fetchAppointments();
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  const statusOptions = ["booked", "waiting", "with doctor", "completed", "canceled"];

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case "waiting":
        return { color: "orange", fontWeight: "bold" };
      case "with doctor":
        return { color: "blue", fontWeight: "bold" };
      case "completed":
        return { color: "green", fontWeight: "bold" };
      case "canceled":
        return { color: "red", fontWeight: "bold" };
      default:
        return { color: "gray" };
    }
  };

  const filteredAppointments = appointments.filter((appt) => {
    const doctorId = typeof appt.doctorId === "object" ? appt.doctorId._id : appt.doctorId;
    return !filterDoctor || doctorId === filterDoctor;
  });

  const activeAppointments = filteredAppointments.filter(
    (appt) => appt.status !== "completed"
  );
  const completedAppointments = filteredAppointments.filter(
    (appt) => appt.status === "completed"
  );

  return (
    <div className="queue-page">
      <h1 className="title">Queue Management</h1>

      <div className="filter-section">
        <label>Filter by Doctor: </label>
        <select
          value={filterDoctor}
          onChange={(e) => setFilterDoctor(e.target.value)}
        >
          <option value="">All Doctors</option>
          {doctors.map((doc) => (
            <option key={doc._id} value={doc._id}>
              {doc.name} ({doc.specialization})
            </option>
          ))}
        </select>
      </div>

      <div className="table-section">
        <h2>Active Queue</h2>
        {activeAppointments.length === 0 ? (
          <p>No active appointments.</p>
        ) : (
          <table className="appointment-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Patient</th>
                <th>Date</th>
                <th>Time</th>
                <th>Doctor</th>
                <th>Status</th>
                <th>Change Status</th>
              </tr>
            </thead>
            <tbody>
              {activeAppointments.map((appt, index) => (
                <tr key={appt._id}>
                  <td>{index + 1}</td>
                  <td>{appt.patientName}</td>
                  <td>{new Date(appt.date).toLocaleDateString()}</td>
                  <td>{appt.time}</td>
                  <td>
                    {appt.doctorId?.name ||
                      doctors.find((doc) => doc._id === appt.doctorId)?.name ||
                      "N/A"}
                  </td>
                  <td style={getStatusStyle(appt.status)}>{appt.status}</td>
                  <td>
                    <select
                      value={appt.status}
                      onChange={(e) => updateStatus(appt._id, e.target.value)}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="completed-section">
        <button className="toggle-button" onClick={() => setShowCompleted((prev) => !prev)}>
          {showCompleted
            ? "Hide Completed Appointments"
            : "Show Completed Appointments"}
        </button>

        {showCompleted && (
          <div className="table-section">
            <h2>Completed Appointments</h2>
            {completedAppointments.length === 0 ? (
              <p>No completed appointments.</p>
            ) : (
              <table className="appointment-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Patient</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Doctor</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {completedAppointments.map((appt, index) => (
                    <tr key={appt._id}>
                      <td>{index + 1}</td>
                      <td>{appt.patientName}</td>
                      <td>{new Date(appt.date).toLocaleDateString()}</td>
                      <td>{appt.time}</td>
                      <td>
                    {appt.doctorId?.name ||
                      doctors.find((doc) => doc._id === appt.doctorId)?.name ||
                      "N/A"}
                  </td>
                      <td style={getStatusStyle(appt.status)}>{appt.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QueueManagementPage;
