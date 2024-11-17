import React, { useEffect, useState } from 'react';
import './ProviderHomepage.css';
import { useNavigate } from 'react-router-dom';
import HomeNavbar from './HomeNavbar';
import beagleImage from '../assets/beagle.png';

function ProviderHomePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState({});

    // Load user info from localStorage when the component mounts
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        setUser(storedUser || {});
    }, []);

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
                    {/* Always display the user's name, but tailor the message */}
                    <div className="greeting">Welcome, {user.name || "User"}!</div>
                </div>
                <h2>My services</h2>
                <div className="image-container" style={{ textAlign: 'center' }}>
                    <img src={beagleImage} alt="Beagle sitting" />
                </div>
                {/* Show personalized message for providers */}
                {user.role === "provider" ? (
                    <p>Hi {user.name || "User"}! You haven't posted any services yet.</p>
                ) : (
                    <p>Hi {user.name || "User"}! Browse through our provider services.</p>
                )}
                <button className="add-service" style={{ display: 'block', margin: '0 auto' }}>Add a Service</button>
            </main>
        </div>
    );
}

export default ProviderHomePage;
