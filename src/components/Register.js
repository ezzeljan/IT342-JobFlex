import React, { useState } from 'react';
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Modal from '@mui/material/Modal';
import GoogleIcon from '@mui/icons-material/Google';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { 
  IconButton, 
  InputAdornment, 
  Card, 
  CardContent, 
  Divider, 
  useTheme, 
  useMediaQuery,
  Snackbar,
  Alert,
  Paper
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import Navbar from './Navbar';

function Register() {
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [userType, setUserType] = useState(null); // 'Job Seeker' or 'Employer'
    const [roleSelectionError, setRoleSelectionError] = useState("");
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);
    const handleMouseDownPassword = (event) => event.preventDefault();

    const handleLogin = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/google";
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
        
        // Validate role selection first
        if (!userType) {
            setRoleSelectionError("Please select your role");
            return;
        } else {
            setRoleSelectionError("");
        }

        const data = new FormData(event.currentTarget);
        const email = data.get("email");
        const password = data.get("password");
        const confirmPassword = data.get("confirmpassword"); 

        let isValid = true;

        // Validations
        if (!email) {
            setEmailError("Email is required");
            isValid = false;
        } else if (!email.includes('@')) {
            setEmailError("Invalid Email, must contain '@'");
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

        if (password !== confirmPassword) {
            setConfirmPasswordError("Passwords do not match!");
            isValid = false;
        } else {
            setConfirmPasswordError("");
        }

        if (!isValid) {
            return;
        }

        const user = {
            email: email,
            password: password,
            userType: userType // Include the selected role
        };

        try {
            const response = await fetch("http://localhost:8080/user/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });

            if (!response.ok) {
                throw new Error("Failed to register user");
            }

            setOpenModal(true);
  
        } catch (err) {
            setSnackbar({
                open: true,
                message: "Error: " + err.message,
                severity: "error"
            });
        }
    };

    const handleModalClose = () => {
        setOpenModal(false);
        navigate("/login");
    }

    return (
        <div className="register-page" style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%)'
        }}>
            <Navbar/>
            <Container component="main" maxWidth="sm" 
                sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    minHeight: "calc(100vh - 64px)",
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
                                    mb: 1
                                }}
                            >
                                Create Account
                            </Typography>
                            
                            <Typography 
                                variant="body1" 
                                sx={{ 
                                    color: "#667085", 
                                    textAlign: 'center',
                                    mb: 2 
                                }}
                            >
                                Join our platform to find jobs or hire talent
                            </Typography>

                            {/* Role Selection */}
                            <Box sx={{ width: '100%', mb: 2 }}>
                                <Typography 
                                    variant="subtitle1" 
                                    sx={{ 
                                        mb: 1.5, 
                                        fontWeight: 500,
                                        color: '#344054'
                                    }}
                                >
                                    I am a:
                                </Typography>
                                <Box sx={{ 
                                    display: 'flex', 
                                    gap: 2,
                                    flexDirection: isMobile ? 'column' : 'row'
                                }}>
                                    <Button
                                        fullWidth
                                        variant={userType === 'Job Seeker' ? 'contained' : 'outlined'}
                                        onClick={() => setUserType('Job Seeker')}
                                        startIcon={<PersonIcon />}
                                        sx={{
                                            py: 1.5,
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            fontSize: '16px',
                                            fontWeight: 500,
                                            backgroundColor: userType === 'Job Seeker' ? '#2DBE5F' : 'transparent',
                                            borderColor: userType === 'Job Seeker' ? '#2DBE5F' : '#E0E0E0',
                                            color: userType === 'Job Seeker' ? 'white' : '#424242',
                                            '&:hover': {
                                                backgroundColor: userType === 'Job Seeker' ? '#28ab56' : 'rgba(0, 0, 0, 0.01)',
                                                borderColor: userType === 'Job Seeker' ? '#28ab56' : '#BDBDBD',
                                            }
                                        }}
                                    >
                                        Job Seeker
                                    </Button>
                                    <Button
                                        fullWidth
                                        variant={userType === 'Employer' ? 'contained' : 'outlined'}
                                        onClick={() => setUserType('Employer')}
                                        startIcon={<BusinessIcon />}
                                        sx={{
                                            py: 1.5,
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            fontSize: '16px',
                                            fontWeight: 500,
                                            backgroundColor: userType === 'Employer' ? '#2DBE5F' : 'transparent',
                                            borderColor: userType === 'Employer' ? '#2DBE5F' : '#E0E0E0',
                                            color: userType === 'Employer' ? 'white' : '#424242',
                                            '&:hover': {
                                                backgroundColor: userType === 'Employer' ? '#28ab56' : 'rgba(0, 0, 0, 0.01)',
                                                borderColor: userType === 'Employer' ? '#28ab56' : '#BDBDBD',
                                            }
                                        }}
                                    >
                                        Employer
                                    </Button>
                                </Box>
                                {roleSelectionError && (
                                    <Typography 
                                        color="error" 
                                        variant="body2" 
                                        sx={{ 
                                            mt: 1,
                                            fontWeight: 500
                                        }}
                                    >
                                        {roleSelectionError}
                                    </Typography>
                                )}
                            </Box>

                            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
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
                                    autoComplete="new-password"
                                    error={!!passwordError}
                                    helperText={passwordError}
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
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="confirmpassword"
                                    label="Confirm password"
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmpassword"
                                    autoComplete="new-password"
                                    error={!!confirmPasswordError}
                                    helperText={confirmPasswordError}
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
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={handleClickShowConfirmPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ 
                                        py: 1.5, 
                                        mt: 2,
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
                                    Create Account
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
                                        Already have an account?{' '}
                                        <RouterLink to="/login" style={{ textDecoration: 'none', color: '#2DBE5F', fontWeight: 600 }}>
                                            Sign in
                                        </RouterLink>
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Container>

            {/* Success Modal */}
            <Modal
                open={openModal}
                onClose={handleModalClose}
                aria-labelledby="success-modal-title"
                aria-describedby="success-modal-description"
            >
                <Paper
                    elevation={5}
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: { xs: '80%', sm: 400 },
                        bgcolor: 'background.paper',
                        borderRadius: 4,
                        boxShadow: 24,
                        p: 4,
                        textAlign: 'center'
                    }}
                >
                    <Box sx={{ 
                        width: 70, 
                        height: 70, 
                        borderRadius: '50%', 
                        bgcolor: '#e8f5e9', 
                        display: 'flex', 
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px'
                    }}>
                        <Box sx={{ 
                            fontSize: 40, 
                            color: '#2DBE5F',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            ✓
                        </Box>
                    </Box>
                    
                    <Typography id="success-modal-title" variant="h5" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
                        Account Created!
                    </Typography>
                    
                    <Typography id="success-modal-description" sx={{ mb: 4, color: '#666' }}>
                        Your account has been successfully created. You can now log in.
                    </Typography>
                    
                    <Button
                        onClick={handleModalClose}
                        variant="contained"
                        fullWidth
                        sx={{ 
                            py: 1.5,
                            bgcolor: '#2DBE5F',
                            '&:hover': { bgcolor: '#28ab56' },
                            borderRadius: 2,
                            textTransform: 'none',
                            fontSize: '16px',
                            fontWeight: 600
                        }}
                    >
                        Continue to Login
                    </Button>
                </Paper>
            </Modal>

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

export default Register;