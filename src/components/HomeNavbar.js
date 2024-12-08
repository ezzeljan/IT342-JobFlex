import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { SearchOutlined, FavoriteBorderOutlined, NotificationsOutlined, MailOutline } from '@mui/icons-material';
import { Avatar } from '@mui/material';
import './HomeNavbar.css';

function HomeNavbar({ handleSearch, userAvatar }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [userRole, setUserRole] = useState(null); // State for user role
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserRole(user.userType); // Set user role from local storage
    }
  }, []);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleInputChange = (e) => {
    handleSearch(e.target.value);
  };

  const handleLogout = () => {
    // Clear user data from localStorage and navigate to login
    localStorage.removeItem("user");
    setUserRole(null); // Reset user role
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
<<<<<<< HEAD
        <FaEnvelope className="navbar-icon" title="Messages" />
        <FaHeart className="navbar-icon" title="Favorites" />
        <FaBell className="navbar-icon" title="Notifications" />
        
        {/* Profile Icon with Dropdown */}
=======
        <MailOutline className="navbar-icon" title="Messages" />
        <FavoriteBorderOutlined className="navbar-icon" title="Favorites" />
        <NotificationsOutlined className="navbar-icon" title="Notifications" />

        
>>>>>>> aca618c3a06639a514d847c0bafa1b46e109df76
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
              {userRole === 'Service Provider' ? (
                <RouterLink to="/yourbooking" className="dropdown-item">My Booking</RouterLink>
              ) : (
                <RouterLink to="/mybooking" className="dropdown-item">My Booking</RouterLink>
              )}
              <button onClick={handleLogout} className="dropdown-item">Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default HomeNavbar;
