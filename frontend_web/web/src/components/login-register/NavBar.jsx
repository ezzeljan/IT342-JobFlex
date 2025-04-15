// src/components/NavBar.jsx
import React from 'react';
import { Box, Typography, Link as MuiLink, IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';

const NavBar = () => {
  const navigate = useNavigate();

  return (
    <Box
  component="nav"
  sx={{
    position: 'fixed',      // Stick to top
    top: 0,
    left: 0,
    width: '98%',
    zIndex: 1000,           // Make sure it stays on top
    backgroundColor: '#FFF',
    boxShadow: '0px -1px 10.9px 0px rgba(0, 0, 0, 0.25)',
    px: { xs: 2, md: 8 },
    py: 1,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 102px',
  }}
>

      {/* Left Section */}
      <Box display="flex" alignItems="center" gap={4}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, fontFamily: 'Poppins', color: '#28313B' }}
        >
          JobFlex
        </Typography>

        {/* Only show menu items on md and up */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
          <MuiLink component={Link} to="/" underline="none" sx={{ color: '#28313B', fontWeight: 500 }}>
            Home
          </MuiLink>
          <MuiLink component={Link} to="/resume" underline="none" sx={{ color: '#28313B', fontWeight: 500 }}>
            Build Resume
          </MuiLink>
        </Box>
      </Box>

      {/* Right Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <MuiLink
          onClick={() => navigate('/login')}
          underline="none"
          sx={{ color: '#28313B', fontWeight: 600, fontFamily: 'Inter', fontSize: 14 }}
        >
          Log in
        </MuiLink>
        <MuiLink
          onClick={() => navigate('/register')}
          underline="none"
          sx={{
            backgroundColor: '#2DBE5F',
            color: '#FFF',
            fontFamily: 'Poppins',
            fontWeight: 600,
            fontSize: 14,
            px: 2,
            py: 1,
            borderRadius: '40px',
            textAlign: 'center',
          }}
        >
          Sign up
        </MuiLink>

        {/* Mobile hamburger icon (optional if you're using a drawer menu later) */}
        <IconButton sx={{ display: { md: 'none' } }}>
          <MenuIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default NavBar;
