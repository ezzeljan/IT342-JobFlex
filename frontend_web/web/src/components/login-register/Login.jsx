import { Box, Button, Container, Divider, Grid, TextField, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"
import MailOutlineIcon from "@mui/icons-material/MailOutline"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import GoogleIcon from "@mui/icons-material/Google"
import InputAdornment from "@mui/material/InputAdornment"
import { useState } from "react"
import { useNavigate } from 'react-router-dom';

// Styled components
const AuthContainer = styled(Grid)(() => ({
    minHeight: "100vh",
    width: "100%",
  }))


const RightPanel = styled(Grid)(({ theme }) => ({
  backgroundColor: "black",
  color: "white",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  padding: theme.spacing(5),
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(4),
  },
}))

const LeftPanel = styled(Grid)(({ theme }) => ({
  backgroundColor: "white",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  padding: theme.spacing(5),
  flexGrow: 1,
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(4),
  },
}))

const LoginButton = styled(Button)(({ theme }) => ({
  borderColor: "white",
  color: "white",
  borderRadius: "50px",
  padding: "10px 20px",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderColor: "white",
  },
}))

const GoogleButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#f3f4f6",
  color: "rgba(0, 0, 0, 0.87)",
  borderRadius: "50px",
  padding: "10px",
  textTransform: "none",
  boxShadow: "none",
  "&:hover": {
    backgroundColor: "#e5e7eb",
    boxShadow: "none",
  },
}))

const LoginAccountButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#2ecc71",
  color: "white",
  borderRadius: "50px",
  padding: "12px",
  textTransform: "none",
  boxShadow: "none",
  "&:hover": {
    backgroundColor: "#27ae60",
    boxShadow: "none",
  },
}))

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#f3f4f6",
    borderRadius: "8px",
    "& fieldset": {
      border: "none",
    },
    "&:hover fieldset": {
      border: "none",
    },
    "&.Mui-focused fieldset": {
      border: `2px solid #2ecc71`,
    },
  },
}))

const DividerText = styled(Typography)(({ theme }) => ({
  color: "#9ca3af",
  fontSize: "0.875rem",
  padding: theme.spacing(0, 1),
}))

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const navigate = useNavigate();

  const handleCreateAccount = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match!")
      return
    }

    try {
      const response = await fetch("http://localhost:8080/user/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      if (response.ok) {
        alert("Account created successfully!")
      } else {
        alert("Failed to create account")
      }
    } catch (error) {
      console.error("Error creating account:", error)
      alert("Error creating account")
    }
  }

  return (
    <AuthContainer container>
      {/* Left side - dark panel */}
      <LeftPanel item xs={12} md={4}>
      <Container maxWidth="sm">
          <Typography variant="h3" component="h1" fontWeight="bold" align="center" sx={{ color: "#2ecc71", mb: 1 }}>
            Login
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
            Welcome back! Please login to your account.
          </Typography>

          {/* Google sign in button */}
          <GoogleButton variant="contained" fullWidth startIcon={<GoogleIcon />} sx={{ mb: 3 }}>
            Continue with Google
          </GoogleButton>

          {/* Divider */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Divider sx={{ flexGrow: 1 }} />
            <DividerText sx={{ px: 2 }}>or login with</DividerText>
            <Divider sx={{ flexGrow: 1 }} />
          </Box>

          {/* Email input */}
          <StyledTextField
            fullWidth
            placeholder="Email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MailOutlineIcon sx={{ color: "#9ca3af" }} />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          {/* Password input */}
          <StyledTextField
            fullWidth
            type="password"
            placeholder="Password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon sx={{ color: "#9ca3af" }} />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />


          {/* Create account button */}
          <LoginAccountButton variant="contained" fullWidth onClick={handleCreateAccount}>
            Login
          </LoginAccountButton>
        </Container>
      </LeftPanel>

      {/* Right side - signup form */}
      <RightPanel item xs={12} md={8}>
        <Container maxWidth="sm">
          <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
            Welcome to JobFlex!
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 4 }}>
            Your journey to flexible work opportunities starts here. 
            Don't have an account yet? Sign up now and explore jobs that fit your lifestyle, skills, and goals — all for free.
          </Typography>
          <LoginButton 
            variant="outlined" 
            fullWidth
            onClick={() => navigate('/register')}
            >
            Sign up
          </LoginButton>
        </Container>
      </RightPanel>
    </AuthContainer>
  )
}

export default Login
