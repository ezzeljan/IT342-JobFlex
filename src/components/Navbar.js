import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import './Navbar.css';
import {Button} from "@mui/material"
import {
  Box,
  Link as MuiLink,
} from "@mui/material";


function Navbar() {
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
        <RouterLink to="/" style={{ textDecoration: 'none' }}>
          <Box sx={{ fontWeight: "bold", fontSize: "1.5rem", color: "black" }}>Jobflex</Box>
        </RouterLink>
        <Box sx={{ display: "flex", gap: 3 }}>
          <MuiLink href="/" underline="none" color="inherit" sx={{ fontSize: "0.875rem", fontWeight: 500 }}>
            Home
          </MuiLink>
          <MuiLink href="/build-resume" underline="none" color="inherit" sx={{ fontSize: "0.875rem", fontWeight: 500 }}>
            Build Resume
          </MuiLink>
        </Box>
      </Box>

      {/* Right side: icons and extra links */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <div className="navbar-buttons">
        <RouterLink to='/login' className="login-btn">Login</RouterLink>
        <Button
              variant="outlined"
              href="/register"
              sx={{
                borderColor: "black",
                color: "black",
                textTransform: "none",
                borderRadius: "4px",
                fontSize: "0.875rem",
                fontWeight: 500,
                "&:hover": {
                  borderColor: "black",
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              Sign up
            </Button>
      </div>
      </Box>
      </Box>
  );
}

export default Navbar;
