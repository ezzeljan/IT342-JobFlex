import React, { useState } from 'react';
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import GoogleIcon from '@mui/icons-material/Google';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { 
  IconButton, 
  InputAdornment, 
  Snackbar, 
  Alert, 
  Paper, 
  Divider, 
  Card,
  CardContent,
  useTheme,
  useMediaQuery
} from '@mui/material';
import Navbar from './Navbar';

function Login() {
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");

    let isValid = true;

    // Validations
    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!isValid) {
      return;
    }

    const user = {
      email: email,
      password: password
    };

    try {
      const response = await fetch("http://localhost:8080/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error("Invalid email or password");
      }

      const result = await response.json();
      console.log(result);

      // Check if result contains a userId (or similar identifier)
      if (result.userId) {
        // Save userId and other necessary info to localStorage
        localStorage.setItem("userId", result.userId); // Store the userId in localStorage
        localStorage.setItem("user", JSON.stringify(result)); // Store the full user data if needed

        setSnackbar({
          open: true,
          message: "Login successful!",
          severity: "success"
        });
        
        // Navigate based on userType after a short delay to show the snackbar
        setTimeout(() => {
          if (result.userType === "Employer") {
            navigate("/providerhome");
          } else {
            navigate("/homepage");
          }
        }, 1000);
      } else {
        throw new Error("User ID not found in the response");
      }

    } catch (err) {
      setErrorMessage(""); // Clear the old error message (it will display in the snackbar instead)
      setSnackbar({
        open: true,
        message: err.message,
        severity: "error"
      });
    }
  };

  return (
    <div className="login-page" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%)'
    }}>
      <Navbar />
      <Container component="main" maxWidth="sm" 
        sx={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          minHeight: "calc(100vh - 64px)", // Adjust based on your Navbar height
          py: 4
        }}
      >
        <Card 
          elevation={5}
          sx={{
            width: '100%',
            borderRadius: 4,
            overflow: 'hidden',
            boxShadow: '0 8px 40px rgba(0,0,0,0.12)'
          }}
        >
          <Box 
            sx={{
              p: 0,
              height: '8px',
              background: 'linear-gradient(90deg, #2DBE5F 0%, #1daa4a 100%)'
            }}
          />
          
          <CardContent sx={{ p: 4 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "20px"
              }}
            >
              <Typography 
                component="h1" 
                variant="h4" 
                sx={{ 
                  fontWeight: "700", 
                  color: "#28313B",
                  textAlign: 'center',
                  mb: 1
                }}
              >
                Welcome Back
              </Typography>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  color: "#667085", 
                  textAlign: 'center',
                  mb: 2 
                }}
              >
                Enter your credentials to access your account
              </Typography>

              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%', mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  error={!!emailError}
                  helperText={emailError}
                  variant="outlined"
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&.Mui-focused fieldset': {
                        borderColor: '#2DBE5F',
                      },
                    },
                    '& label.Mui-focused': {
                      color: '#2DBE5F',
                    },
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="current-password"
                  error={!!passwordError}
                  helperText={passwordError}
                  sx={{
                    mb: 1,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&.Mui-focused fieldset': {
                        borderColor: '#2DBE5F',
                      },
                    },
                    '& label.Mui-focused': {
                      color: '#2DBE5F',
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                  <RouterLink to="/forgot-password" style={{ textDecoration: 'none', color: '#2DBE5F', fontSize: '14px' }}>
                    Forgot password?
                  </RouterLink>
                </Box>
                
                {errorMessage && (
                  <Typography variant="body2" color="error" sx={{ mb: 2 }}>{errorMessage}</Typography>
                )}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ 
                    py: 1.5, 
                    mb: 2,
                    backgroundColor: "#2DBE5F",
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '16px',
                    fontWeight: 600,
                    "&:hover": {
                      backgroundColor: "#28ab56",
                    },
                    boxShadow: '0 4px 12px rgba(45, 190, 95, 0.3)'
                  }}
                >
                  Sign in
                </Button>
                
                <Box sx={{ display: 'flex', alignItems: 'center', my: 3 }}>
                  <Divider sx={{ flexGrow: 1 }} />
                  <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>or</Typography>
                  <Divider sx={{ flexGrow: 1 }} />
                </Box>
                
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<GoogleIcon />}
                  onClick={handleLogin}
                  sx={{ 
                    py: 1.5,
                    mb: 3, 
                    borderRadius: 2,
                    borderColor: '#E0E0E0',
                    color: '#424242',
                    textTransform: 'none',
                    fontSize: '16px',
                    fontWeight: 500,
                    '&:hover': {
                      borderColor: '#BDBDBD',
                      backgroundColor: 'rgba(0, 0, 0, 0.01)'
                    }
                  }}
                >
                  Continue with Google
                </Button>
                
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Don't have an account?{' '}
                    <RouterLink to="/register" style={{ textDecoration: 'none', color: '#2DBE5F', fontWeight: 600 }}>
                      Sign up
                    </RouterLink>
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity} 
          sx={{ 
            width: '100%',
            boxShadow: 3,
            borderRadius: 2
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Login;