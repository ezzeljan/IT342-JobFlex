/*import React, { useState } from "react";
import Logo from "../assets/TRBHNP.png";
import { Link as RouterLink } from 'react-router-dom';
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav>
      <div className="nav-logo-container">
        <img src={Logo} alt="" />
        <div className="navlinks">
        <a href="">About</a>
        <a href="">Contact</a>
        <a href="">Services</a>
        </div>
        
      </div>
      <div className="navbar-links-container">
        <RouterLink to ="/login" style={{textDecoration: 'none'}}>
            <button className="primary-button1">Login</button>
        </RouterLink>
        <RouterLink to ="/register" style={{textDecoration: 'none'}}>
            <button className="primary-button2">Register</button>
        </RouterLink>
      </div>
    </nav>
  );
};

export default Navbar;*/
import React from 'react';
import './Navbar.css';
import { Link as RouterLink } from 'react-router-dom';

function Navbar() {
    return (
        <nav className="navbar">
          <RouterLink to="/" style={{textDecoration: 'none'}}>
            <div className="nav-title">TrabaHanap</div>
          </RouterLink>
            <ul className="nav-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
                <li><a href="#services">Services</a></li>
            </ul>
            <div className="nav-actions">
              <RouterLink to="/login" style={{textDecoration: 'none'}} className='nav-button'>
                Login
              </RouterLink>
              
              <RouterLink to="/register" style={{textDecoration: 'none'}} className='nav-button'>
                Register
              </RouterLink>
            </div>
        </nav>
    );
}

export default Navbar;
