import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';
import HomeNavbar from './HomeNavbar';

function ProfilePage() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
  const [name, setName] = useState(user.name || '');
  const [address, setAddress] = useState(user.address || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [password, setPassword] = useState(user.password || ''); 
  const [isEditingPassword, setIsEditingPassword] = useState(false); 
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    if (!user.userId) {
      navigate('/login');
    }
  }, [user, navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name cannot be empty";
    if (!address.trim()) newErrors.address = "Address cannot be empty";
    if (!phone.trim()) newErrors.phone = "Phone cannot be empty";
    if (isEditingPassword && !password.trim()) newErrors.password = "Password cannot be empty";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveChanges = async () => {
    if (!validateForm()) return;

    const updatedUserDetails = {
      name,
      address,
      phone,
      email: user.email,
      password: isEditingPassword && password.trim() ? password : user.password,
    };

    try {
      const response = await fetch(`http://localhost:8080/user/update-profile?userId=${user.userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUserDetails),
      });

      if (response.ok) {
        alert('Profile updated successfully');
        const updatedUser = { ...user, name, address, phone, password: updatedUserDetails.password };
        localStorage.setItem('user', JSON.stringify(updatedUser));
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

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        const response = await fetch(`http://localhost:8080/user/deleteUser/${user.userId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('Account deleted successfully');
          localStorage.removeItem('user');
          navigate('/login');
        } else {
          const errorMessage = await response.text();
          alert('Error: ' + errorMessage);
        }
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('Error deleting account');
      }
    }
  };

  const handlePasswordClick = () => {
    setIsEditingPassword(true);
  };

  return (
    <div className="profile-page">
      <HomeNavbar />
      <div className="profile-container">
        <h2 className="profile-title">Profile</h2>
        <form onSubmit={(e) => e.preventDefault()} className="profile-form">
          <div className="profile-form-group">
            <label className="profile-label">Name</label>
            <input
              className="profile-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <p className="error">{errors.name}</p>}
          </div>
          <div className="profile-form-group">
            <label className="profile-label">Email</label>
            <input
              className="profile-input"
              type="email"
              value={user.email || ''}
              readOnly
            />
          </div>
          <div className="profile-form-group">
            <label className="profile-label">Address</label>
            <input
              className="profile-input"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            {errors.address && <p className="error">{errors.address}</p>}
          </div>
          <div className="profile-form-group">
            <label className="profile-label">Phone</label>
            <input
              className="profile-input"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            {errors.phone && <p className="error">{errors.phone}</p>}
          </div>
          <div className="profile-form-group">
            <label className="profile-label">Password</label>
            <input
              className="profile-input"
              type="password"
              value={password}
              onClick={handlePasswordClick}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>
          <button
            className="profile-button"
            type="button"
            onClick={handleSaveChanges}
          >
            Save Changes
          </button>
          <button
            className="delete-account-button"
            type="button"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;
