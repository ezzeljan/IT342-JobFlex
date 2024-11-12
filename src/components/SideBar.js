import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { FiUser, FiLogOut } from 'react-icons/fi';
import './HomePage.css';

const Sidebar = ({ handleLogout }) => {
  return (
    <nav className="sidebar">
      <h1 className="sidebar-title">TrabaHanap</h1>
      <ul className="side-nav-links">
        <li>
          <RouterLink to="/profilepage">
            <FiUser className="side-icon" /> Profile
          </RouterLink>
        </li>
        <li>
          <a href="#" onClick={handleLogout}>
            <FiLogOut className="side-icon" /> Logout
          </a>
        </li>
      </ul>

      <p className="copyright">&copy; 2024 Trabahanap. All rights reserved.</p>
    </nav>
  );
};

export default Sidebar;
