import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="nav-bar">
      <RouterLink to="/" style={{textDecoration: 'none'}}>
      <div className="navbar-title">TrabaHanap</div>
      </RouterLink>
      <ul className="navbar-links">
        <li><RouterLink to="/">Home</RouterLink></li>
        <li><RouterLink to="#home">About us</RouterLink></li>
        <li><RouterLink to="#home">Services</RouterLink></li>
        <li><RouterLink to="#home">Contacts</RouterLink></li>
      </ul>
      <div className="navbar-buttons">
        <RouterLink to='/login' className="login-btn">Login</RouterLink>
        <RouterLink to='/register' className="register-btn">Register</RouterLink>
      </div>
    </nav>
  );
}

export default Navbar;
