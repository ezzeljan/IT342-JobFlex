import {
  Typography,
  Button,
  Box,
  TextField,
  InputAdornment,
  Paper,
  Container,
  Link as MuiLink,
} from "@mui/material"
import { Search, LocationOn } from "@mui/icons-material"
import { styled } from "@mui/material/styles"
import Navbar from "./Navbar";

const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      border: "none",
    },
    "&:hover fieldset": {
      border: "none",
    },
    "&.Mui-focused fieldset": {
      border: "none",
    },
  },
  "& .MuiInputBase-input": {
    padding: "10px 0",
  },
})

const SearchButton = styled(Button)({
  backgroundColor: "black",
  color: "white",
  borderRadius: "4px",
  "&:hover": {
    backgroundColor: "#333",
  },
  textTransform: "none",
  padding: "6px 16px",
})

export default function Landing() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />

      <Container
        maxWidth="md"
        sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
      >
        <Box sx={{ width: "100%", mt: 8, mb: 16 }}>
          <Paper
            elevation={3}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              borderRadius: "8px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flex: 1,
                borderRight: { xs: "none", md: "1px solid #e0e0e0" },
                borderBottom: { xs: "1px solid #e0e0e0", md: "none" },
              }}
            >
              <StyledTextField
                fullWidth
                placeholder="Job Title, keywords, company"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
              <StyledTextField
                fullWidth
                placeholder="City, state, zip code, or &quot;remote&quot;"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <SearchButton
              variant="contained"
              sx={{
                position: { xs: "relative", md: "absolute" },
                right: 8,
                top: { md: "50%" },
                transform: { md: "translateY(-50%)" },
                width: { xs: "100%", md: "auto" },
              }}
            >
              Search
            </SearchButton>
          </Paper>

          <Box sx={{ mt: 2, textAlign: "center" }}>
            <MuiLink
              href="/build-resume"
              sx={{
                color: "#4caf50",
                fontWeight: 500,
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Build Resume
            </MuiLink>
            <Typography component="span" sx={{ mx: 1, color: "text.secondary" }}>
              -
            </Typography>
            <Typography component="span" sx={{ color: "text.secondary" }}>
              Create your professional edge
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
