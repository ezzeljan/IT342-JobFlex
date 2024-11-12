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
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Background from './Background';
import './Register.css';
import { IconButton, InputAdornment } from '@mui/material';

function Login() {
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState("");
    const navigate = useNavigate(); 

    const handleClickShowPassword = () => {
      setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
      event.preventDefault();
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
            /*alert("Login successful!");*/localStorage.setItem("user", JSON.stringify(result));

            alert("Login successful!");
            
            navigate("/homepage");
        } catch (err) {
            setErrorMessage(err.message);
        }
    };
    


  return (
    <Container component="main" maxWidth="xs" className="main-container" sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", paddingBottom: "100px"  }}>

      <Background/>
      <Box className="login-box"
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px"
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
            type={showPassword ? "text" : "password"}
            id="password"
            autoComplete="current-password"
            error={!!passwordError}
            helperText={passwordError}
            InputProps = {{
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
                            )
                        }}
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
            <RouterLink to="/register" variant="body2" style={{ textDecoration: 'none'}}>
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