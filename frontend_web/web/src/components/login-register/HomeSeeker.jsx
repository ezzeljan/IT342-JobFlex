import React from "react";
import { Link } from "react-router-dom";
import ChatIcon from "@mui/icons-material/Chat";
import LocationIcon from "@mui/icons-material/LocationOn";
import NotificationIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import {
  AppBar,
  Autocomplete,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";

const HomeSeeker = () => {
  return (
    <Box
      sx={{
        bgcolor: "background.paper", // or any color like "#F5F5F5"
        minHeight: "100vh", // Ensures full page height
        width: "249%",
      }}
    >
      <Container maxWidth="l">
        {/* Header Navigation */}
        <AppBar
          position="static"
          color="default"
          elevation={3}
          sx={{ boxShadow: "0px -1px 10.9px rgba(0,0,0,0.25)" }}
        >
          <Toolbar
            sx={{
              px: { xs: 2, md: 12.75 },
              py: 1.75,
              justifyContent: "space-between",
            }}
          >
            {/* Left side */}
            <Stack direction="row" spacing={7} alignItems="center">
              <Typography
                variant="h6"
                fontWeight="bold"
                color="#28313B"
                fontFamily="Poppins"
              >
                JobFlex
              </Typography>
              <Link to="/" style={{ textDecoration: "none" }}>
                <Typography variant="subtitle2" fontWeight="bold" color="#28313B">
                  Home
                </Typography>
              </Link>
              <Link to="/resumemaker" style={{ textDecoration: "none" }}>
                <Typography variant="subtitle2" fontWeight="semibold" color="#28313B">
                  Build Resume
                </Typography>
              </Link>
            </Stack>

            {/* Right side */}
            <Stack direction="row" spacing={2.5} alignItems="center">
              <IconButton>
                <NotificationIcon sx={{ width: 28, height: 30 }} />
              </IconButton>
              <IconButton>
                <ChatIcon sx={{ width: 26, height: 26 }} />
              </IconButton>
              <IconButton>
                <PersonIcon sx={{ width: 31, height: 30 }} />
              </IconButton>
              <Divider orientation="vertical" flexItem sx={{ height: 26 }} />
              <Link to="/PostJob" style={{ textDecoration: "none" }}>
                <Typography variant="subtitle2" fontWeight="semibold" color="#28313B">
                  Employer/ Post Job
                </Typography>
              </Link>
            </Stack>
          </Toolbar>
        </AppBar>

        {/* Search Bar Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "calc(100vh - 100px)", // Adjust based on header height
            flexDirection: "column",
          }}
        >
          <Paper
            elevation={4}
            sx={{
              width: "100%",
              maxWidth: 709,
              height: 74,
              borderRadius: "15px",
              border: "1px solid rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              px: 2,
            }}
          >
            <IconButton sx={{ mr: 1 }}>
              <SearchIcon sx={{ width: 33, height: 41 }} />
            </IconButton>

            <Autocomplete
              freeSolo
              options={[]}
              sx={{ flex: 1 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  placeholder="Job Title, keywords, company"
                />
              )}
            />

            <Divider orientation="vertical" flexItem sx={{ mx: 2, height: 30 }} />

            <LocationIcon sx={{ width: 40, height: 30, mr: 1 }} />

            <Autocomplete
              freeSolo
              options={[]}
              sx={{ flex: 1 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="City, state, zip code, or remote"
                  variant="standard"
                  InputProps={{
                    ...params.InputProps,
                    disableUnderline: true,
                  }}
                />
              )}
            />

            <Button
              variant="contained"
              sx={{
                bgcolor: "#2DBE5F",
                borderRadius: "15px",
                width: 102,
                height: 43,
                textTransform: "none",
                "&:hover": { bgcolor: "#25a351" },
              }}
            >
              Search
            </Button>
          </Paper>

          {/* Build Resume Text */}
          <Box sx={{ mt: 4, display: "flex", alignItems: "center" }}>
            <Link to="/resumemaker" style={{ textDecoration: "none" }}>
              <Typography
                variant="subtitle1"
                color="#2DBE5F"
                fontWeight="medium"
                sx={{ mr: 1 }}
              >
                Build Resume
              </Typography>
            </Link>
            <Typography variant="subtitle1" fontWeight="medium" sx={{ mr: 1 }}>
              -
            </Typography>
            <Typography variant="subtitle2" color="text.primary">
              Create your professional edge
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HomeSeeker;
