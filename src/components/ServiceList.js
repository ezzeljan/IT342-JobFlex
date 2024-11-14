import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ServiceList = () => {
    const [services, setServices] = useState([]);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/services');
            setServices(response.data);
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    return (
        <div>
            <h2>Service List</h2>
            <ul>
                {services.map((service) => (
                    <li key={service.id}>
                        {service.title} - ${service.price}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ServiceList;