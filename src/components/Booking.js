import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Booking = () => {
    const { id } = useParams(); // Get the service ID from URL
    const navigate = useNavigate();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchServiceDetail = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/services/${id}`);
                setService(response.data);
            } catch (error) {
                setError('Failed to fetch service details.');
                console.error('Error fetching service:', error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchServiceDetail();
    }, [id]);

    const handleBooking = () => {
        navigate(`/confirm-booking/${id}`);
    };

    const handleBack = () => {
        navigate('/services'); // Navigate back to the service list
    };

    const styles = {
        container: {
            padding: '20px',
            maxWidth: '600px',
            margin: '0 auto',
            textAlign: 'center',
        },
        title: {
            fontSize: '2rem',
            fontWeight: '600',
            marginBottom: '10px',
        },
        description: {
            fontSize: '1.1rem',
            marginBottom: '20px',
        },
        price: {
            fontSize: '1.2rem',
            fontWeight: 'bold',
            color: '#007BFF',
            marginBottom: '10px',
        },
        availability: {
            fontSize: '1rem',
            marginBottom: '20px',
        },
        button: {
            backgroundColor: '#007BFF',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            margin: '10px',
            fontWeight: '500',
            transition: 'background-color 0.3s ease',
        },
        buttonHover: {
            backgroundColor: '#0056b3',
        },
        error: {
            color: 'red',
            fontWeight: 'bold',
            marginBottom: '20px',
        },
    };

    if (loading) {
        return <div style={styles.container}>Loading...</div>;
    }

    if (error) {
        return (
            <div style={styles.container}>
                <p style={styles.error}>{error}</p>
                <button
                    style={styles.button}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor)}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = styles.button.backgroundColor)}
                    onClick={handleBack}
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>{service.title}</h2>
            <p style={styles.description}>{service.description}</p>
            <p style={styles.price}>Price: ${service.price}</p>
            <p style={styles.availability}>
                <strong>Availability:</strong> {service.availability ? 'Available' : 'Not Available'}
            </p>
            <button
                style={styles.button}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor)}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = styles.button.backgroundColor)}
                onClick={handleBooking}
            >
                Confirm Booking
            </button>
            <button
                style={styles.button}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor)}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = styles.button.backgroundColor)}
                onClick={handleBack}
            >
                Go Back
            </button>
        </div>
    );
};

export default Booking;
