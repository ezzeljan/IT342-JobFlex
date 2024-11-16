import React, { useEffect, useState } from 'react';
import './ProviderHomepage.css';
import { useNavigate } from 'react-router-dom';
import HomeNavbar from './HomeNavbar';
import beagleImage from '../assets/beagle.png';

function ProviderHomePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState({});

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser({});
        navigate('/login');
    };
    

    return (
        <div className="homepage">
            <HomeNavbar handleLogout={handleLogout} />
            <main className="content">
                <div className="info-display-container">
                <div className="greeting">Welcome, {user.name || "User"}!</div>
                </div>
                <h2>My services</h2>
                <div className="image-container" style={{ textAlign: 'center' }}>
                    <img src={beagleImage} alt="Beagle sitting" />
                </div>
                <p>Hi {user.name || "User"}! you haven’t posted any service yet.</p>
                <button className="add-service" style={{ display: 'block', margin: '0 auto' }}>Add a Service</button>

            </main>
        </div>
    );
}

export default ProviderHomePage;
