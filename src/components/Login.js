import React, {useState} from 'react'
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import GoogleIcon from '@mui/icons-material/Google';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Register.css';

function Login() {
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate(); // Hook for navigation

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

        // Create user object to send to the API
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

            // Assuming the response contains a success message or user info
            const result = await response.json();
            alert("Login successful!");
            // Redirect to the homepage
            navigate("/homepage");
        } catch (err) {
            setErrorMessage(err.message);
        }
    };
    


  return (
    <Container component="main" maxWidth="xs" sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", paddingBottom: "100px"  }}>
      <Typography
        variant="h4"
        sx={{
          position: "absolute",
          top: 20,
          left: 20,
          fontWeight: 'bold',
          color: "#28313B"
        }}
      >
        TrabaHanap
      </Typography>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 502 532" fill="none" style={{ position: 'absolute', bottom: 0, left: 0, width: 502, height: 532 }}>
        <path d="M501.5 540.148C501.5 678.22 288.071 643.564 150 643.564C11.9288 643.564 -100 531.635 -100 393.564C-100 255.493 -68.463 -186.851 28.4999 88.564C75.5 222.064 181 517.148 501.5 540.148Z" fill="url(#paint0_linear_38_102)" fill-opacity="0.58"/>
        <defs>
          <linearGradient id="paint0_linear_38_102" x1="200.75" y1="0" x2="200.75" y2="647.435" gradientUnits="userSpaceOnUse">
            <stop stop-color="#FF6B6B"/>
            <stop offset="1" stop-color="#FFBE5B"/>
          </linearGradient>
        </defs>
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 502 532" fill="none" style={{ position: 'absolute', top: 0, right: 0, transform: 'rotate(180deg)', width: 502, height: 532 }}>
        <path d="M501.5 540.148C501.5 678.22 288.071 643.564 150 643.564C11.9288 643.564 -100 531.635 -100 393.564C-100 255.493 -68.463 -186.851 28.4999 88.564C75.5 222.064 181 517.148 501.5 540.148Z" fill="url(#paint1_linear_38_102)" fill-opacity="0.58"/>
        <defs>
          <linearGradient id="paint1_linear_38_102" x1="200.75" y1="0" x2="200.75" y2="647.435" gradientUnits="userSpaceOnUse">
            <stop stop-color="#FF6B6B"/>
            <stop offset="1" stop-color="#FFBE5B"/>
          </linearGradient>
        </defs>
      </svg>
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "25px"
        }}
      >
        <Typography component="h1" variant="h5" sx={{ fontSize: "32px", fontFamily: "Arial", fontWeight: "600", color: "#28313B"}}>
          Login
        </Typography>

        <Typography variant="body1" sx={{ textAlign: 'center', mt: "37px", color: "#808080", fontSize: "12px"}}>
          Log in with
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", gap: "10px"}}>
          <Button
            variant="outlined"
            fullWidth
            sx={{ 
              width: '200px',
              height: '100px'

             }}
          >
            <GoogleIcon fontSize="large" />  {/* Google Icon */}
          </Button>
          <Button
            variant="outlined"
            fullWidth
            sx={{ width: '200px',
              height: '100px' }}
          >
            <LinkedInIcon fontSize="large" />  {/* LinkedIn Icon */}
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

            {errorMessage && (
            <Typography variant="body2" color="error">{errorMessage}</Typography>
            )}
          
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
          </Grid>
  
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2}}
          >
            Log in
          </Button>
          <Grid container justifyContent="center">
            <Grid item>
              <RouterLink to="/" variant="body2" style={{ textDecoration: 'none'}}>
                {"Don't have an account? Sign Up"}
              </RouterLink>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default Login