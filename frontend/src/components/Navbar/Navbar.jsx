
import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./Navbar.css"

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
        if (confirmLogout) {
            localStorage.removeItem('token');     
            navigate('/'); 
        }                       
    };

  return <button className='logout-button' onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
