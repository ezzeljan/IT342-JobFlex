//Tarungon pa nako ni!!!!!!!!!!!!!!!

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './HomeNavbar';
import './ProfilePage.css';

function ProfilePage() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
  const [name, setName] = useState(user.name || '');
  const [address, setAddress] = useState(user.address || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [password, setPassword] = useState('');
  const [isEditingPassword, setIsEditingPassword] = useState(false);  // Track if password is being edited
  const navigate = useNavigate();

  useEffect(() => {
    if (!user.userId) {
      navigate('/login');  // Redirect to login if no user is logged in
    }
  }, [user, navigate]);

  const handleSaveChanges = async () => {
    const updatedUserDetails = {
      name,
      address,
      phone,
      password,
    };

    try {
      const response = await fetch(`http://localhost:8080/user/update-profile?userId=${user.userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUserDetails),
      });

      if (response.ok) {
        alert('Profile updated successfully');
        const updatedUser = { ...user, name, address, phone };  // Update the local user state
        localStorage.setItem('user', JSON.stringify(updatedUser));  // Save updated user to localStorage
        setUser(updatedUser);
      } else {
        const errorMessage = await response.text();
        alert('Error: ' + errorMessage);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };

  const handleLogout = () => {
    console.log('User logged out');
  }

  return (
    <div className="profile-page">
        <Sidebar handleLogout={handleLogout}/>
        <h1>UNDER CONSTRUCTION!</h1>
      <h2 className="profile-heading">Profile</h2>
      <form className="profile-form" onSubmit={(e) => e.preventDefault()}>
        {/* Name - Editable */}
        <div className="profile-form-group">
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder=" "
            className="profile-form-input"
          />
          <label htmlFor="name" className="profile-form-label">Name</label>
          <i className="profile-edit-icon fas fa-edit" onClick={() => document.getElementById('name').focus()}></i>
        </div>

        {/* Email - Read-only */}
        <div className="profile-form-group">
          <input
            type="text"
            id="email"
            value={user.email || ''}
            readOnly
            className="profile-form-name-email-display"
          />
          <label htmlFor="email" className="profile-form-label">Email</label>
        </div>

        {/* Address - Editable */}
        <div className="profile-form-group">
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder=" "
            className="profile-form-input"
          />
          <label htmlFor="address" className="profile-form-label">Address</label>
          <i className="profile-edit-icon fas fa-edit" onClick={() => document.getElementById('address').focus()}></i>
        </div>

        {/* Phone - Editable */}
        <div className="profile-form-group">
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder=" "
            className="profile-form-input"
          />
          <label htmlFor="phone" className="profile-form-label">Phone</label>
          <i className="profile-edit-icon fas fa-edit" onClick={() => document.getElementById('phone').focus()}></i>
        </div>

        {/* Password - Hidden but editable */}
        <div className="profile-form-group">
          <input
            type={isEditingPassword ? "text" : "password"}  // Toggle between password and text for editing
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder=" "
            className="profile-form-input"
          />
          <label htmlFor="password" className="profile-form-label">Password</label>
          <i
            className="profile-edit-icon fas fa-edit"
            onClick={() => {
              setIsEditingPassword(!isEditingPassword);  // Toggle password visibility for editing
              document.getElementById('password').focus();
            }}
          ></i>
        </div>

        <button type="button" className="profile-button" onClick={handleSaveChanges}>Save Changes</button>
      </form>
    </div>
  );
}

export default ProfilePage;
