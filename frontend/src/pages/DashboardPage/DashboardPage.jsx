import React from "react";
import { Link } from "react-router-dom";
import AppointmentPage from "../Appointment/AppointmentPage";
import DoctorManagementPage from "../DoctorManagement/DoctorManagementPage";
import QueueManagementPage from "../Queue/QueueManagementPage";
import Navbar from "../../components/Navbar/Navbar";
import "./DashboardPage.css"

const DashboardPage = () => {
  return (
    <div>
      <Navbar />
      <div className="Dashboard">
      <h2>Clinic Front Desk</h2>
      </div>
      <QueueManagementPage />
      <AppointmentPage />
      <DoctorManagementPage />
    </div>
  );
};

export default DashboardPage;
