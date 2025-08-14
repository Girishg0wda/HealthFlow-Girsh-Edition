import { useState, useEffect } from "react";
import axios from "axios";
import BaseUrl from "../../BaseUrl";
import "./DoctorManagementPage.css"; 

const DoctorManagementPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [openScheduleId, setOpenScheduleId] = useState(null);
  const [doctors, setDoctors] = useState([]);

  const [form, setForm] = useState({
    name: "",
    specialization: "",
    gender: "",
    location: "",
  });

  const [availability, setAvailability] = useState({
    days: [],
    startTime: "",
    endTime: "",
  });

  const [searchSpecialization, setSearchSpecialization] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [searchStatus, setSearchStatus] = useState("");

  const fetchDoctors = async () => {
    try {
      const response = await axios.get(`${BaseUrl}/doctors/doctorsstatus`);
      setDoctors(response.data.data || []);
    } catch (error) {
      console.log("Error fetching doctors:", error);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.name ||
      !form.specialization ||
      !form.gender ||
      !form.location ||
      availability.days.length === 0 ||
      !availability.startTime ||
      !availability.endTime
    ) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    try {
      const response = await axios.post(`${BaseUrl}/doctors/doctorspost`, {
        ...form,
        availability,
      });

      if (response.data.message === "Doctor added successfully") {
        alert("Doctor added successfully");
        setForm({
          name: "",
          specialization: "",
          gender: "",
          location: "",
        });
        setAvailability({
          days: [],
          startTime: "",
          endTime: "",
        });
        fetchDoctors();
      }
    } catch (error) {
      console.error("Error adding doctor:", error);
      alert("Failed to add doctor.");
    }
  };

  // const handleDelete = async (id) => {
  //   try {
  //     const response = await axios.delete(
  //       `${BaseUrl}/doctors/doctorsdelete/${id}`
  //     );
  //     if (response.status === 200) {
  //       alert("Doctor data deleted successfully");
  //       fetchDoctors();
  //     }
  //   } catch (error) {
  //     console.error("Error deleting doctor data:", error);
  //   }
  // };

  const getFilteredDoctors = () => {
    return doctors.filter((doctor) => {
      const matchesSpecialization =
        searchSpecialization === "" ||
        doctor.specialization
          .toLowerCase()
          .includes(searchSpecialization.toLowerCase());

      const matchesLocation = doctor.location
        .toLowerCase()
        .includes(searchLocation.toLowerCase());

      const matchesStatus =
        searchStatus === "" || doctor.status === searchStatus;

      return matchesSpecialization && matchesLocation && matchesStatus;
    });
  };

  const toggleSchedule = (id) => {
    setOpenScheduleId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div className="doctor-page">
      <h1 className="page-title">Doctor Management</h1>

      <div className="form-toggle">
        <button onClick={() => setShowForm((prev) => !prev)}>
          {showForm ? "Hide Add Doctor" : "Add Doctor"}
        </button>
      </div>

      {showForm && (
        <form className="doctor-form" onSubmit={handleSubmit}>
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            placeholder="Specialization"
            value={form.specialization}
            onChange={(e) =>
              setForm({ ...form, specialization: e.target.value })
            }
          />
          <label>Available Days:</label>
          <div className="day-toggle-group">
            {[
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ].map((day) => (
              <button
                type="button"
                key={day}
                className={`day-toggle ${
                  availability.days.includes(day) ? "active" : ""
                }`}
                onClick={() => {
                  const isSelected = availability.days.includes(day);
                  setAvailability({
                    ...availability,
                    days: isSelected
                      ? availability.days.filter((d) => d !== day)
                      : [...availability.days, day],
                  });
                }}
              >
                {day}
              </button>
            ))}
          </div>

          <label>Start Time:</label>
          <input
            type="time"
            value={availability.startTime}
            onChange={(e) =>
              setAvailability({ ...availability, startTime: e.target.value })
            }
          />

          <label>End Time:</label>
          <input
            type="time"
            value={availability.endTime}
            onChange={(e) =>
              setAvailability({ ...availability, endTime: e.target.value })
            }
          />

          <input
            placeholder="Gender"
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
          />
          <input
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />

          <button type="submit">Add Doctor</button>
        </form>
      )}
      <div className="doctor-page">
      <div className="section-filter">
        <h3>Search / Filter Doctors</h3>
        <div className="filter-toggle">
          <button onClick={() => setShowFilter((prev) => !prev)}>
            {showFilter ? "Hide Filter" : "Search / Filter"}
          </button>
        </div>

        {showFilter && (
          <div className="filter-form">
            <select
              value={searchSpecialization}
              onChange={(e) => setSearchSpecialization(e.target.value)}
            >
              <option value="">All Specializations</option>
              <option value="General Physician">General Physician</option>
              <option value="Gynecologist">Gynecologist</option>
              <option value="Urologist">Urologist</option>
              <option value="Neurologist">Neurologist</option>
              <option value="Pediatrician">Pediatrician</option>
              <option value="Dermatologist">Dermatologist</option>
            </select>

            <select
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
            >
              <option value="">All Locations</option>
              <option value="Bengaluru, Karnataka">Bengaluru, Karnataka</option>
              <option value="Hassan, Karnataka">Hassan, Karnataka</option>
              <option value="Belagavi, Karnataka">Belagavi, Karnataka</option>
              <option value="Mangaluru, Karnataka">Mangaluru, Karnataka</option>
              <option value="Tumakuru, Karnataka">Tumakuru, Karnataka</option>
            </select>

            <select
              value={searchStatus}
              onChange={(e) => setSearchStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Busy">Busy</option>
              <option value="Off Duty">Off Duty</option>
            </select>
          </div>
        )}
      </div>
      </div>
        
      <div className="doctor-list">
        <h2>Doctors List</h2>
        <br/>

        {doctors.length === 0 ? (
          <p>No doctors available.</p>
        ) : (
          getFilteredDoctors().map((doctor) => (
            <div className="doctor-card" key={doctor._id}>
              <p>
                <strong>Name:</strong> {doctor.name}
              </p>
              <p>
                <strong>Specialization:</strong> {doctor.specialization}
              </p>
              <p>
                <strong>Gender:</strong> {doctor.gender}
              </p>
              <p>
                <strong>Location:</strong> {doctor.location}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`status ${
                    doctor.status === "Available"
                      ? "green"
                      : doctor.status === "Busy"
                      ? "orange"
                      : "red"
                  }`}
                >
                  {doctor.status}
                </span>
              </p>
              <p>
                <strong>Next Available:</strong> {doctor.nextAvailable || "N/A"}
              </p>

              <button onClick={() => toggleSchedule(doctor._id)}>
                {openScheduleId === doctor._id
                  ? "Hide Schedule"
                  : "View Schedule"}
              </button>

              {openScheduleId === doctor._id && doctor.availability && (
                <div className="schedule">
                  <p>
                    <strong>Available Days:</strong>{" "}
                    {doctor.availability.days?.join(", ") || "N/A"}
                  </p>
                  <p>
                    <strong>Start Time:</strong> {doctor.availability.startTime}
                  </p>
                  <p>
                    <strong>End Time:</strong> {doctor.availability.endTime}
                  </p>
                </div>
              )}

              {/* <button
                onClick={() => handleDelete(doctor._id)}
                style={{ marginTop: "10px", color: "red" }}
              >
                Remove
              </button> */}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DoctorManagementPage;
