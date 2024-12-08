import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { SearchOutlined, FavoriteBorderOutlined, NotificationsOutlined, MailOutline } from '@mui/icons-material';
import { Avatar } from '@mui/material';
import './HomeNavbar.css';

function HomeNavbar({ handleSearch, userAvatar }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleInputChange = (e) => {
    handleSearch(e.target.value);
  };

  const handleLogout = () => {
    // Clear any necessary user data (e.g., from localStorage)
    localStorage.removeItem("user");
    navigate('/login');
  };

  return (
    <nav className="nav-bar">
      <div className="navbar-left">
        <RouterLink to="/homepage" style={{ textDecoration: 'none' }}>
          <div className="navbar-title">TrabaHanap</div>
        </RouterLink>
        <div className="navbar-search-container">
          <SearchOutlined className="search-icon" />
          <input
            type="text"
            placeholder="Search..."
            className="navbar-search"
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div className="navbar-right">
        <MailOutline className="navbar-icon" title="Messages" />
        <FavoriteBorderOutlined className="navbar-icon" title="Favorites" />
        <NotificationsOutlined className="navbar-icon" title="Notifications" />

        
        <div className="profile-icon-container">
          <Avatar
            src={userAvatar}
            alt="User Avatar"
            onClick={toggleDropdown}
            sx={{ cursor: 'pointer', width: 40, height: 40 }}
          >
            {!userAvatar ? null : "U"}
          </Avatar>
          {showDropdown && (
            <div className="dropdown-menu">
              <RouterLink to="/profilepage" className="dropdown-item">Profile</RouterLink>
              <RouterLink to="/mybooking" className="dropdown-item">My Booking</RouterLink>
              <button onClick={handleLogout} className="dropdown-item">Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default HomeNavbar;
