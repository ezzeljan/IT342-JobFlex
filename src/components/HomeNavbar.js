import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { FaBell, FaUserCircle, FaEnvelope, FaHeart, FaSearch } from 'react-icons/fa';
import './HomeNavbar.css';

function HomeNavbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    // Clear any necessary user data (e.g., from localStorage)
    localStorage.removeItem("user");
    navigate('/login');
  };

  return (
    <nav className="nav-bar">
      <div className="navbar-left">
        <RouterLink to="/" style={{ textDecoration: 'none' }}>
          <div className="navbar-title">TrabaHanap</div>
        </RouterLink>
        <div className="navbar-search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search..."
            className="navbar-search"
          />
        </div>
      </div>
      <div className="navbar-right">
        <FaEnvelope className="navbar-icon" title="Messages" />
        <FaHeart className="navbar-icon" title="Favorites" />
        <FaBell className="navbar-icon" title="Notifications" />
        <RouterLink to="" className="post-service-link" style={{ textDecoration: 'none' }}>
          post a service
        </RouterLink>

        {/* Profile Icon with Dropdown */}
        <div className="profile-icon-container">
          <FaUserCircle className="navbar-icon" title="Profile" onClick={toggleDropdown} />
          {showDropdown && (
            <div className="dropdown-menu">
              <RouterLink to="/profilepage" className="dropdown-item">Profile</RouterLink>
              <button onClick={handleLogout} className="dropdown-item">Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default HomeNavbar;
