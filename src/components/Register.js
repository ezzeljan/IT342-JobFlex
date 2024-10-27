import React, { useState } from 'react';
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Link as RouterLink } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import Navbar from './Navbar';
import Background from './Background';
import './Register.css';

function Register() {
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = data.get("email");
        const password = data.get("password");
        const confirmPassword = data.get("confirmpassword"); // Ensure the name matches the TextField

        let isValid = true;

        //Validations
        if(!email) {
          setEmailError("Email is required");
          isValid = false;
        } else {
          setEmailError("");
        }

        if(!password) {
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

        if(!isValid) {
          return;
        }

        // Create user object to send to the API
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

            
            alert("User registered successfully!");
            // Optionally redirect to login or home page
        } catch (err) {
            alert("Error: " + err.message);
        }
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", paddingBottom: "100px" }}>
            <Navbar/>

            <Background/>

            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "25px"
                }}
            >
                <Typography component="h1" variant="h5" sx={{ fontSize: "32px", fontFamily: "Arial", fontWeight: "600", color: "#28313B" }}>
                    Register
                </Typography>

                <Typography variant="body1" sx={{ textAlign: 'center', mt: "37px", color: "#808080", fontSize: "12px" }}>
                    Register with
                </Typography>

                <Box sx={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                    <Button variant="outlined" fullWidth sx={{ width: '200px', height: '100px' }}>
                        <GoogleIcon fontSize="large" />
                    </Button>
                    <Button variant="outlined" fullWidth sx={{ width: '200px', height: '100px' }}>
                        <LinkedInIcon fontSize="large" />
                    </Button>
                </Box>

                <Typography variant="body1" sx={{ textAlign: 'center', color: "#808080", fontSize: "12px" }}>
                    or continue with
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
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        error={!!passwordError}
                        helperText={passwordError}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirmpassword"
                        label="Confirm password"
                        type="password"
                        id="confirmpassword"
                        autoComplete="current-password"
                        error={!!confirmPasswordError}
                        helperText={confirmPasswordError}
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
    );
}

export default Register;
