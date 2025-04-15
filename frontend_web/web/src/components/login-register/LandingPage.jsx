import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Grid, Box, Typography, TextField, Button, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import NotificationIcon from '@mui/icons-material/Notifications';
import ChatIcon from '@mui/icons-material/Chat';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import backgroundImage from '../../assets/JobFlex.jpg';
import {Container} from '@mui/material';


const LandingPage = ({ defaultSearch = 'Job Title, keywords, company', defaultLocation = 'City, state, zip code, or "remote"' }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(defaultSearch);
  const [location, setLocation] = useState(defaultLocation);

  const handleSearch = () => {
    console.log('Searching:', searchQuery, location);
  };

  const onLogin = () => {
    navigate('/login');  // Navigate to Login Page
  };

  const onRegister = () => {
    navigate('/register');  // Navigate to Register Page (Sign Up Page)
  };


  // Styles object
  const styles = {
    rightNav: {
      display: 'flex',
      gap: '15px',
      alignItems: 'center',
    },
    loginLink: {
      textDecoration: 'none',
      color: '#28313B',
      fontWeight: 600,
      fontFamily: 'Inter',
      fontSize: '14px',
    },
    registerLink: {
      backgroundColor: '#2DBE5F',
      color: '#FFF',
      fontFamily: 'Poppins',
      fontWeight: 600,
      fontSize: '14px',
      borderRadius: '40px',
    }
  };

  

  return (
    <Grid container direction="column" alignItems="center"
      sx={{
        width: '249%',    // this will fix your layout
        height: '100vh',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
>
  
      {/* Navbar */}
      <Grid container sx={{
        width: '100%',
        height: '65px',
        padding: '14px 102px',
        backgroundColor: '#FFF',
        boxShadow: '0px -1px 10.9px 0px rgba(0, 0, 0, 0.25)',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box display="flex" gap="55px" alignItems="center">
          <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'Poppins', color: '#28313B' }}>
            JobFlex
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 500, fontFamily: 'Inter', color: '#28313B' }}>
            Home
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'Inter', color: '#28313B', fontSize: 14 }}>
            Build Resume
          </Typography>
        </Box>
  
        {/* Right Nav Section */}
        <Box sx={styles.rightNav}>
          <Link to="/login" style={styles.loginLink} onClick={onLogin}>Log in</Link>
          <Link to="/register" style={styles.registerLink} onClick={onRegister}>Sign up</Link>
        </Box>
      </Grid>
  
    </Grid>
  );
};

export default LandingPage;
