import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('username');
    toast.success('Logged out successfully');
    navigate('/');
  };


  return (
    <header className="bg-dark py-0" style={{ height: '70px' }}>
      <nav className="navbar navbar-dark bg-dark">
        <div className="container d-flex align-items-center">
          <Link to="/" className="navbar-brand">
            <div className="logo-container">
              <img src="https://i.ibb.co/KsHg88L/dealsdray-logo-only.png" alt="Logo" className="logo" />
            </div>
          </Link>
          <ul className="navbar-nav me-auto mb-2 mb-md-0 flex-row">
            <li className="nav-item me-3">
              <Link to="/Dashboard" className="nav-link">Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/EmployeeList" className="nav-link">Employee List</Link>
            </li>
          </ul>
          <div className="navbar-text">
            {username ? (
              <>
                <span className="text-light">Hello, {username}</span> | <button onClick={handleLogout} className="btn btn-link text-light">Logout</button>
              </>
            ) : (
              <Link to="/Login" className="text-light">Login</Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
