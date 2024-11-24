import React, { useState } from 'react';
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Modal from '@mui/material/Modal';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Navbar from './Navbar';
import Background from './Background';
import './Register.css';

function Register() {
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [openModal, setOpenModal] = useState(false); // State for modal visibility
    const navigate = useNavigate();
    const [emailTakenError, setEmailTakenError] = useState("");

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);
    const handleMouseDownPassword = (event) => event.preventDefault();

    const handleSubmit = async (event) => {
        event.preventDefault();
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

        //To check if unique ang email unta
        /*if (isValid) {
            try {
                const emailResponse = await fetch(`http://localhost:8080/user/check-email?email=${email}`);
                if (emailResponse.status === 409) { // Conflict: email already in use
                    setEmailTakenError("Email is already taken");
                    isValid = false;
                } else if (emailResponse.status === 200) {
                    setEmailTakenError(""); // Email available
                }
            } catch (err) {
                alert("Error checking email availability");
                isValid = false;
            }
        }*/

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
            password: password
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
            alert("Error: " + err.message);
        }
    };

    const handleModalClose = () => {
        setOpenModal(false);
        navigate("/login");
    }

    return (
        <div className="register-page">
            <Navbar/>
            <Container component="main" maxWidth="xs" className="main-container" sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "90vh", paddingBottom: "100px" }}>
                <Background/>
                <Box
                    sx={{
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "20px"
                    }}
                >
                    <Typography component="h1" variant="h5" sx={{ fontSize: "32px", fontFamily: "Arial", fontWeight: "600", color: "#28313B" }}>
                        Register
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
                            autoComplete="current-password"
                            error={!!confirmPasswordError}
                            helperText={confirmPasswordError}
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
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Register
                        </Button>
                        <Grid container justifyContent="center">
                            <Grid item>
                                <RouterLink to="/Login" variant="body2" style={{ textDecoration: 'none' }}>
                                    {"Already have an account? Log in"}
                                </RouterLink>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>

            <Modal
                open={openModal}
                onClose={handleModalClose}
                aria-labelledby="success-modal-title"
                aria-describedby="success-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 300,
                        bgcolor: 'background.paper',
                        borderRadius: '10px',
                        boxShadow: 24,
                        p: 4,
                        textAlign: 'center'
                    }}
                >
                    <Typography id="success-modal-title" variant="h6" component="h2">
                        Your account has been successfully created!
                    </Typography>
                    <Button
                        onClick={handleModalClose}
                        variant="contained"
                        sx={{ mt: 4 }}
                    >
                        OK
                    </Button>
                </Box>
            </Modal>
        </div>
    );
}

export default Register;
