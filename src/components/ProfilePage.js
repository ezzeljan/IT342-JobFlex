import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';
import HomeNavbar from './HomeNavbar';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

function ProfilePage() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
  const [name, setName] = useState(user.name || '');
  const [address, setAddress] = useState(user.address || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [password, setPassword] = useState(user.password || '');
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
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
      userType: user.userType,
    };

    try {
      const response = await fetch(`http://localhost:8080/user/update-profile?userId=${user.userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUserDetails),
      });

      if (response.ok) {
        const updatedUser = { ...user, name, address, phone, password: updatedUserDetails.password };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setIsUpdateModalOpen(true); // Open the success modal
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
    try {
      const response = await fetch(`http://localhost:8080/user/deleteUser/${user.userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        localStorage.removeItem('user');
        setIsDeleteModalOpen(true); // Open the delete modal
      } else {
        const errorMessage = await response.text();
        alert('Error: ' + errorMessage);
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Error deleting account');
    }
  };

  return (
    <div className="profile-page">
      <HomeNavbar />
      <div className="profile-container">
        <h2 className="profile-title">Profile</h2>
        <form onSubmit={(e) => e.preventDefault()} className="profile-form">
          {/* Form Fields */}
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
              onClick={() => setIsEditingPassword(true)}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>
          <div className="profile-form-group">
            <label className="profile-label">Role (User Type)</label>
            <input
              className="profile-input"
              type="text"
              value={user.userType || ''}
              readOnly
            />
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
            onClick={() => setIsDeleteModalOpen(true)}
          >
            Delete Account
          </button>
        </form>
      </div>

      {/* Update Modal */}
      <Dialog open={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)}>
        <DialogTitle>Update Successful</DialogTitle>
        <DialogContent>
          <Typography>Your profile has been updated successfully.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsUpdateModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete your account? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              setIsDeleteModalOpen(false);
              handleDeleteAccount();
              navigate('/login'); // Redirect after deletion
            }}
            color="error"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ProfilePage;
