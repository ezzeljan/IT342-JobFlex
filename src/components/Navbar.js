import React, { useState } from "react";
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
            <button className="primary-button">Login</button>
        </RouterLink>
        <RouterLink to ="/register" style={{textDecoration: 'none'}}>
            <button className="primary-button">Register</button>
        </RouterLink>
      </div>
    </nav>
  );
};

export default Navbar;