import React from "react";
import { Link as RouterLink } from 'react-router-dom';
import Navbar from "./Navbar";
import Logo from "../assets/B6_5.png.png"
import "./LandingPage.css";
/*push test*/
function LandingPage () {
    return (
        <div className="home-container">
          <Navbar />
            <div className="home-banner-container">
              <div className="home-text-section">
                <h1 className="primary-heading">
                  Your Go-To Platform for Job Hunting
                </h1>
                <p className="primary-text">
                  Whether you're looking for your first job, a career change, Trabahanap makes it 
                  easy to connect with employers
               </p>

                <RouterLink to="/login" style={{ textDecoration: 'none' }}>
                  <button className="secondary-button">
                     Get started
                  </button>
               </RouterLink>
              </div>
            <div className="home-image-section">
              <img src={Logo} alt="Dog smiling" />
            </div>
        </div>
    </div>
    );
};

export default LandingPage;