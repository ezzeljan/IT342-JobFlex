import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import HomeNavbar from './HomeNavbar';

const Booking = () => {
    const { serviceID } = useParams();
    const navigate = useNavigate();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [bookingDetails, setBookingDetails] = useState({
        date: '',
        time: '',
    });

    useEffect(() => {
        const fetchServiceDetail = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/services/${serviceID}`);
                setService(response.data);
            } catch (error) {
                setError('Failed to fetch service details.');
                console.error('Error fetching service:', error);
            } finally {
                setLoading(false);
            }
        };

        if (serviceID) {
            fetchServiceDetail();
        } else {
            setError('Service ID is missing.');
            setLoading(false);
        }
    }, [serviceID]);

    const handleBooking = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBookingDetails((prev) => ({ ...prev, [name]: value }));
    };

    const handleConfirmBooking = async () => {
        try {
            const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage
    
            if (!userId || userId <= 0) {
                console.error("Invalid or missing user ID");
                alert("User is not logged in or user ID is invalid.");
                return; // Prevent booking if userId is invalid
            }

            // Construct booking payload with service and user info
            const bookingPayload = {
                serviceEntity: { serviceID: serviceID }, // Send the serviceID correctly
                userEntity: { userId: userId },  // Add userId to the payload
                date: bookingDetails.date,
                time: bookingDetails.time,
                status: 'Pending',  // Default status
            };

            // Make POST request to backend to store the booking
            const response = await axios.post('http://localhost:8080/booking/add', bookingPayload);

            if (response.status === 200) {
                alert('Booking confirmed successfully!');
                navigate('/mybooking'); // Navigate to the user's booking page after success
            } else {
                alert('Failed to confirm booking.');
            }
        } catch (error) {
            if (error.response) {
                // Log error details from server response
                console.error('Error confirming booking:', error.response.data);
            } else if (error.request) {
                // Handle when no response is received
                console.error('Error confirming booking: No response from server', error.request);
            } else {
                // Handle other errors (e.g., network error)
                console.error('Error confirming booking:', error.message);
            }
            alert('Failed to confirm booking.');
        }
    };

    const styles = {
        container: {
            padding: '20px',
            maxWidth: '600px',
            margin: '0 auto',
            textAlign: 'center',
        },
        modal: {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#fff',
            padding: '20px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
            borderRadius: '8px',
            zIndex: 1000,
        },
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
        },
        button: {
            backgroundColor: '#007BFF',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            margin: '10px',
        },
    };

    if (loading) {
        return <div style={styles.container}>Loading...</div>;
    }

    if (error) {
        return (
            <div style={styles.container}>
                <p style={{ color: 'red' }}>{error}</p>
                <button style={styles.button} onClick={() => navigate('/services')}>
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div>
            <HomeNavbar />
            <div style={styles.container}>
                <h2>{service?.title}</h2>
                <p>{service?.description}</p>
                <p>Price: ${service?.price}</p>
                <p>Availability: {service?.availability ? 'Available' : 'Not Available'}</p>
                <button style={styles.button} onClick={handleBooking}>
                    Confirm Booking
                </button>
                <button style={styles.button} onClick={() => navigate('/services')}>
                    Go Back
                </button>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <>
                    <div style={styles.overlay} onClick={handleCloseModal}></div>
                    <div style={styles.modal}>
                        <h3>Confirm Your Booking</h3>
                        <p>Select a date and time for your booking:</p>
                        <div className="mb-3">
                            <label htmlFor="date" className="form-label">
                                Start of Service
                            </label>
                            <input
                                type="date"
                                name="date"
                                id="date"
                                value={bookingDetails.date}
                                onChange={handleInputChange}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="time" className="form-label">
                                Time of Service
                            </label>
                            <input
                                type="time"
                                name="time"
                                id="time"
                                value={bookingDetails.time}
                                onChange={handleInputChange}
                                className="form-control"
                                required
                            />
                        </div>
                        <button
                            style={styles.button}
                            onClick={handleConfirmBooking}
                            disabled={!bookingDetails.date || !bookingDetails.time}
                        >
                            Confirm Booking
                        </button>
                        <button style={styles.button} onClick={handleCloseModal}>
                            Cancel
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Booking;
