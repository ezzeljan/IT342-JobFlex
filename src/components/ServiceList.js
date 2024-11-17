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

    // Inline styles
    const styles = {
        container: {
            margin: '20px',
        },
        list: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
        },
        box: {
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '15px',
            backgroundColor: '#f9f9f9',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            textAlign: 'center', // Center align the text
        },
        boxHover: {
            transform: 'translateY(-5px)',
            boxShadow: '0 6px 10px rgba(0, 0, 0, 0.15)',
        },
        title: {
            marginTop: 0,
            fontSize: '1.5em',
            fontWeight: 'bold',
            textAlign: 'center', // Ensure the title is centered
        },
        paragraph: {
            margin: '5px 0',
            fontSize: '1em',
        },
    };

    return (
        <div style={styles.container}>
            <h2>Service List</h2>
            <div style={styles.list}>
                {services.map((service) => (
                    <div
                        key={service.id}
                        style={styles.box}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = styles.boxHover.transform;
                            e.currentTarget.style.boxShadow = styles.boxHover.boxShadow;
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'none';
                            e.currentTarget.style.boxShadow = styles.box.boxShadow;
                        }}
                    >
                        <h3 style={styles.title}>{service.title}</h3>
                        <p style={styles.paragraph}>Price: ${service.price}</p>
                        <p style={styles.paragraph}>Description: {service.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ServiceList;
