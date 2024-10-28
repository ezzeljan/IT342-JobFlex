import React, { useState } from "react";
import Logo from "../assets/TRBHNP.png";
import { Link as RouterLink } from 'react-router-dom';
import "./Navbar.css";

const Homenav = () => {
  return (
    <nav>
      <div className="nav-logo-container">
        <img src={Logo} alt="" />
        <div className="navlinks">
        
        </div>
        
      </div>
      <div className="navbar-links-container">
        
      </div>
    </nav>
  );
};

export default Homenav;