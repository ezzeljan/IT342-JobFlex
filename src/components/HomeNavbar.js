import React, { useState } from "react";
import {
  Box,
  IconButton,
  Divider,
  Link as MuiLink,
  Menu,
  MenuItem,
} from "@mui/material";
import { Notifications, ChatBubbleOutline, Person } from "@mui/icons-material";
import { Link as RouterLink, useNavigate } from "react-router-dom";

export default function HomeNavbar({ handleLogout }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    if (handleLogout) {
      handleLogout();
    } else {
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
    <Box
      component="nav"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        backgroundColor: "white",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        position: "sticky",
        top: "0",
        zIndex: "1000",
      }}
    >
      {/* Left side: Logo and nav links */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
        <RouterLink to="/homepage" style={{ textDecoration: 'none' }}>
          <Box sx={{ fontWeight: "bold", fontSize: "1.5rem", color: "black" }}>Jobflex</Box>
        </RouterLink>
        <Box sx={{ display: "flex", gap: 3 }}>
          <MuiLink 
            component={RouterLink} 
            to="/homepage" 
            underline="none" 
            color="inherit" 
            sx={{ fontSize: "0.875rem", fontWeight: 500 }}
          >
            Home
          </MuiLink>
          {user.userType === "Job Seeker" && (
            <MuiLink 
              component={RouterLink} 
              to="/resume-builder" 
              underline="none" 
              color="inherit" 
              sx={{ fontSize: "0.875rem", fontWeight: 500 }}
            >
              Build Resume
            </MuiLink>
          )}
        </Box>
      </Box>

      {/* Right side: Icons and menu */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <IconButton size="small">
          <Notifications sx={{ fontSize: 20 }} />
        </IconButton>
        <IconButton size="small">
          <ChatBubbleOutline sx={{ fontSize: 20 }} />
        </IconButton>
        <IconButton size="small" onClick={handleMenuOpen}>
          <Person sx={{ fontSize: 20 }} />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem onClick={() => { navigate("/profile"); handleMenuClose(); }}>Profile</MenuItem>
          {user.userType === "Job Seeker" && (
            <>
              <MenuItem onClick={() => { navigate("/job-applications"); handleMenuClose(); }}>My Applications</MenuItem>
              <MenuItem onClick={() => { navigate("/saved-jobs"); handleMenuClose(); }}>Saved Jobs</MenuItem>
              <MenuItem onClick={() => { navigate("/resume-builder"); handleMenuClose(); }}>Your Resume</MenuItem>
            </>
          )}
          <MenuItem onClick={() => { navigate("/settings"); handleMenuClose(); }}>Settings</MenuItem>
          <Divider />
          <MenuItem onClick={handleLogoutClick}>Log Out</MenuItem>
        </Menu>

        <Divider orientation="vertical" flexItem sx={{ height: 24, mx: 1 }} />
        {user.userType !== "Employer" && (
          <MuiLink
            component={RouterLink}
            to="/employer"
            underline="none"
            color="inherit"
            sx={{ fontSize: "0.875rem", fontWeight: 500, display: { xs: "none", md: "block" } }}
          >
            Employer/ Post Job
          </MuiLink>
        )}
      </Box>
    </Box>
  );
}