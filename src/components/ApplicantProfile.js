import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Divider,
  Avatar,
  Grid,
  Paper,
  CircularProgress,
  Alert
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EmployerNav from "./EmployerNav";

const API_URL = "http://localhost:8080";

function ApplicantProfile() {
  const { applicantId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [applicant, setApplicant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Retrieve logged-in user from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    } else {
      navigate("/login");
      return;
    }

    // Only proceed if user is an employer
    if (storedUser && storedUser.userType === "Employer") {
      fetchApplicantProfile();
    } else {
      setError("Only employers can view applicant profiles");
      setLoading(false);
    }
  }, [applicantId, navigate]);

  const fetchApplicantProfile = async () => {
    try {
      setLoading(true);
      
      // Make API call to get applicant profile, passing the logged-in user's ID as the requester
      const response = await fetch(
        `${API_URL}/user/${applicantId}?requesterId=${user.userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        // Try to get error message from response
        const errorText = await response.text();
        throw new Error(`Failed to fetch applicant details: ${errorText}`);
      }

      const data = await response.json();
      setApplicant(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching applicant:", error);
      setError(error.message || "Error fetching applicant details");
      setLoading(false);
    }
  };

  // Handle the back button
  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="applicant-profile-page">
      <EmployerNav
        handleLogout={() => {
          localStorage.removeItem("user");
          navigate("/login");
        }}
      />

      <Box sx={{ maxWidth: 1000, mx: "auto", p: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mb: 3 }}
        >
          Back
        </Button>

        <Typography variant="h4" gutterBottom>
          Applicant Profile
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ my: 2 }}>
            {error}
          </Alert>
        ) : applicant ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 3, height: "100%" }}>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
                  <Avatar
                    src={applicant.profileImage ? `${API_URL}/${applicant.profileImage}` : null}
                    alt={applicant.name}
                    sx={{ width: 120, height: 120, mb: 2 }}
                  />
                  <Typography variant="h5" align="center">
                    {applicant.name}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" align="center">
                    {applicant.userType}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" color="text.secondary">
                  Contact Information
                </Typography>
                <Box sx={{ my: 1 }}>
                  <Typography variant="body1">
                    <strong>Email:</strong> {applicant.email}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Phone:</strong> {applicant.phone || "Not provided"}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Address:</strong> {applicant.address || "Not provided"}
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={8}>
              <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Applicant Summary
                  </Typography>
                  <Typography variant="body1" paragraph>
                    This section shows a summary of the applicant's profile. You can see their basic information and contact details.
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Applicant ID: {applicant.userId}
                  </Typography>
                </CardContent>
              </Card>

              {/* You can add more sections here as needed, such as skills, experience, etc. */}
              {/* These would need to be added to your backend model and API */}
              
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleBack}
                >
                  Return to Applications
                </Button>
              </Box>
            </Grid>
          </Grid>
        ) : (
          <Alert severity="warning">
            No applicant data found. The applicant may have deleted their account.
          </Alert>
        )}
      </Box>
    </div>
  );
}

export default ApplicantProfile;