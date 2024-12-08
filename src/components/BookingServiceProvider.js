import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HomeNavbar from './HomeNavbar';
import './MyBooking.css';

const Booking = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    loadBooking();
  }, []);

  // Load bookings from backend
  const loadBooking = async () => {
    try {
      const result = await axios.get("http://localhost:8080/booking/get", {
        validateStatus: (status) => status >= 200 && status < 300,
      });

      if (result.status === 200) {
        setBookings(result.data); // Save the data from the backend, including serviceEntity
      } else {
        console.error("Failed to load bookings:", result.status, result.statusText);
      }
    } catch (error) {
      console.error("Error loading bookings:", error);
    }
  };

  // Handle booking acceptance by changing status
  const handleAcceptBooking = async (bookingID) => {
    try {
      // Update booking status to 'Accepted/Confirmed'
      const updatedBooking = await axios.put(`http://localhost:8080/booking/update/${bookingID}`, {
        status: 'Accepted', // Or any status you're updating
    });

      if (updatedBooking.status === 200) {
        // Update the local state to reflect the status change
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking.bookingID === bookingID
              ? { ...booking, status: 'Accepted' }
              : booking
          )
        );
      }
    } catch (error) {
      console.error("Error accepting booking:", error);
    }
  };

  // Handle booking deletion
  const handleDelete = async (bookingID) => {
    try {
      await axios.delete(`http://localhost:8080/booking/delete/${bookingID}`);
      loadBooking(); // Reload bookings after deletion
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  return (
    <div>
      <HomeNavbar />

      <div>
        <h2 className="mybooking-header">My Bookings - Service Provider</h2>
      </div>
      <div className="booking-container">
        <div className="booking-table">
          <table>
            <thead>
              <tr>
                <th>Service</th>
                <th>Booking Date</th>
                <th>Booking Time</th>
                <th>Booking Status</th>
                <th colSpan="3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="5">You don't have any bookings available at the moment.</td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.bookingID}>
                    {/* Display the service title */}
                    <td>{booking.serviceEntity?.title || "Service Title Not Available"}</td>
                    <td>{booking.date}</td>
                    <td>{booking.time}</td>
                    <td>{booking.status}</td>
                    <td>
                      <button
                        className="cancel-button"
                        onClick={() => {
                          if (window.confirm("Are you sure you want to accept this booking?")) {
                            handleAcceptBooking(booking.bookingID);
                          }
                        }}
                      >
                        Accept Booking
                      </button>
                    </td>
                    <td>
                      <button
                        className="cancel-button"
                        onClick={() => {
                          if (window.confirm("Are you sure you want to decline this booking?")) {
                            handleDelete(booking.bookingID);
                          }
                        }}
                      >
                        Decline Booking
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Booking;
