import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import { Link } from 'react-router-dom';
import HomeNavbar from './HomeNavbar';
import './MyBooking.css';

const Booking = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    loadBooking();
  }, []);

  const loadBooking = async () => {
    try {
      const result = await axios.get("http://localhost:8080/booking/get", {
        validateStatus: (status) => status >= 200 && status < 300,
      });

      if (result.status === 200) {
        setBookings(result.data);
      } else {
        console.error("Failed to load bookings:", result.status, result.statusText);
      }
    } catch (error) {
      console.error("Error loading bookings:", error);
    }
  };

  const handleDelete = async (bookingID) => {
    await axios.delete(`http://localhost:8080/booking/delete/${bookingID}`);
    loadBooking();
  };

  return (
    <div>
      <HomeNavbar />

      <div>
        <h2>My Bookings</h2>
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
      <td colSpan="5">You dont have any bookings available at the moment.</td>
    </tr>
  ) : (
    bookings.map((booking) => (
      <tr key={booking.bookingID}>
        <td>{booking.serviceTitle}</td> 
        <td>{booking.date}</td>
        <td>{booking.time}</td>
        <td>{booking.status}</td>
        <td>
          <button
            className="cancel-button"
            onClick={() => {
              if (window.confirm("Are you sure you want to accept this booking?")) {
                handleDelete(booking.bookingID);
              }
            }}
          >
            {/* <FaTrashAlt /> */}
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
            {/* <FaTrashAlt /> */}
            Decline Booking
          </button>
        </td>
      </tr>
    ))
  )}
</tbody>
        </table>
      </div>
      {/* <button className="add-booking">Add new Booking</button> */}
    </div>
    </div>
 
  );
};

export default Booking;
