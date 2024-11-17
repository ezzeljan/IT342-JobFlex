import React, { useEffect, useState } from 'react';
import './ProviderHomepage.css';
import { useNavigate } from 'react-router-dom';
import HomeNavbar from './HomeNavbar';
import beagleImage from '../assets/beagle.png';
import ServiceList from './ServiceList';
import axios from 'axios';

function ProviderHomePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [services, setServices] = useState([]);

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
    const fetchServices = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/services');
            setServices(response.data);
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    const handleAddServiceClick = () => {
        // Navigate to the ServiceForm route
        navigate('/serviceform');
    };



    return (
        <div className="homepage">
            <HomeNavbar handleLogout={handleLogout} />
            <main className="content">
                <div className="info-display-container">
                    {/* Always display the user's name, but tailor the message */}
                    <div className="greeting">Welcome, {user.name || "User"}!</div>
                </div>
                <div className="services-view-container">
                <h2>My services</h2>
                {services.length > 0 ? (
                    <ServiceList />
                ) : (
                    <div className="service-group" style={{ textAlign: 'center' }}>
                        <div className="image-container">
                            <img src={beagleImage} alt="Beagle sitting" />
                        </div>
                        <p>Hi {user.name || "User"}! you haven’t posted any service yet.</p>
                        <button 
                            className="add-service" 
                            style={{ display: 'block', margin: '0 auto' }} 
                            onClick={handleAddServiceClick}
                        >
                            Add a Service
                        </button>
                    </div>
                )}
                </div>
            </main>

        </div>
    );
}

export default ProviderHomePage;
