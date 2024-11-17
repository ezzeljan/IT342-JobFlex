import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="nav-bar">
      <RouterLink to="/" style={{ textDecoration: 'none' }}>
        <div className="navbar-title">TrabaHanap</div>
      </RouterLink>
      <ul className="navbar-links">
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About us</a></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
      <div className="navbar-buttons">
        <RouterLink to='/login' className="login-btn">Login</RouterLink>
        <RouterLink to='/register' className="register-btn">Register</RouterLink>
      </div>
    </nav>
  );
}

export default Navbar;
