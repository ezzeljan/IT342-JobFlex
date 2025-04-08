import { Box, Button, Container, Divider, Grid, TextField, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"
import MailOutlineIcon from "@mui/icons-material/MailOutline"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import GoogleIcon from "@mui/icons-material/Google"
import { InputAdornment } from "@mui/material";
import { useNavigate } from 'react-router-dom';

// Styled components
const AuthContainer = styled(Grid)(() => ({
    minHeight: "100vh",
    width: "100%",
  }))


const LeftPanel = styled(Grid)(({ theme }) => ({
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

const RightPanel = styled(Grid)(({ theme }) => ({
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

const CreateAccountButton = styled(Button)(({ theme }) => ({
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

const Register = () => {
    const navigate = useNavigate();

    return (
    <AuthContainer container>
      {/* Left side - dark panel */}
      <LeftPanel item xs={12} md={4}>
        <Container maxWidth="sm">
          <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
            Welcome Back!
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 4 }}>
            Ready to find your next opportunity? Log in to access flexible jobs tailored to you and manage your
            applications with ease.
          </Typography>
          <LoginButton 
            variant="outlined" 
            fullWidth
            onClick={() => navigate('/login')}
            >
            Log In
          </LoginButton>
        </Container>
      </LeftPanel>

      {/* Right side - signup form */}
      <RightPanel item xs={12} md={8}>
        <Container maxWidth="sm">
          <Typography variant="h3" component="h1" fontWeight="bold" align="center" sx={{ color: "#2ecc71", mb: 1 }}>
            Create an account
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
            Create your JobFlex account and start exploring flexible job opportunities today.
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
            <DividerText sx={{ px: 2 }}>or sign up with</DividerText>
            <Divider sx={{ flexGrow: 1 }} />
          </Box>

          {/* Email input */}
          <StyledTextField
            fullWidth
            placeholder="Email"
            margin="normal"
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
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon sx={{ color: "#9ca3af" }} />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          {/* Re-enter Password input */}
          <StyledTextField
            fullWidth
            type="password"
            placeholder="Re-enter Password"
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon sx={{ color: "#9ca3af" }} />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />

          {/* Create account button */}
          <CreateAccountButton variant="contained" fullWidth>
            Create account
          </CreateAccountButton>
        </Container>
      </RightPanel>
    </AuthContainer>
  )
}

export default Register;

