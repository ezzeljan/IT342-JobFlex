import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  FormControl,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Badge,
  Avatar,
  Divider,
  Paper,
  Container,
  IconButton,
  TextField,
  InputAdornment,
  ThemeProvider,
  createTheme,
  CircularProgress,
  Tooltip
} from "@mui/material";
import {
  People as PeopleIcon,
  Person as PersonIcon,
  CalendarToday,
  ArrowBack,
  CheckCircle,
  Cancel,
  Search,
  Email,
  Phone,
  LocationOn,
  School,
  Work,
  Timer,
  FilterList,
  ArrowDropDown,
  HourglassEmpty,
  MoreVert,
  Send
} from "@mui/icons-material";
import EmployerNav from "./EmployerNav";

const API_URL = "http://localhost:8080/api";

// Create a theme with green and black color palette
const greenBlackTheme = createTheme({
  palette: {
    primary: {
      main: '#2DBE5F', // Green as primary color
      contrastText: '#fff'
    },
    secondary: {
      main: '#000000', // Black as secondary color
      contrastText: '#fff'
    },
    success: {
      main: '#2DBE5F', // Use the same green for success
      dark: '#259a4d', // Darker green for hover states
      contrastText: '#fff'
    },
    error: {
      main: '#f44336', // Keep red for error states
      contrastText: '#fff'
    },
    warning: {
      main: '#ff9800', // Keep orange for warning states
      contrastText: '#fff'
    },
    info: {
      main: '#03a9f4', // Keep blue for info states
      contrastText: '#fff'
    },
    background: {
      default: '#f7f9f7', // Very light green tint for background
      paper: '#ffffff'
    },
    text: {
      primary: '#212121',
      secondary: '#555555'
    }
  },
  shape: {
    borderRadius: 8
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 500
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8
        }
      }
    }
  }
});

// Helper function to format date
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Applicant Card Component
const ApplicantCard = ({ application, onStatusChange, onViewProfile }) => {
  const getStatusColorClass = (status) => {
    const statusLower = status?.toLowerCase() || '';
    
    if (statusLower.includes('accept')) {
      return { 
        bgcolor: '#2DBE5F', // Green for accepted
        color: 'white',
        icon: <CheckCircle fontSize="small" />
      };
    } else if (statusLower.includes('reject')) {
      return { 
        bgcolor: '#f44336', // Red for rejected
        color: 'white',
        icon: <Cancel fontSize="small" />
      };
    } else {
      return { 
        bgcolor: '#ff9800', // Orange for pending
        color: 'white',
        icon: <HourglassEmpty fontSize="small" />
      };
    }
  };

  const statusColor = getStatusColorClass(application.applicationStatus);
  const applicantInitial = application.applicantName ? application.applicantName.charAt(0).toUpperCase() : 'A';
  
  return (
    <Card 
      sx={{
        borderRadius: 3,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        border: '1px solid rgba(45, 190, 95, 0.1)', // Very light green border
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              sx={{ 
                bgcolor: 'rgba(45, 190, 95, 0.1)',
                color: '#2DBE5F',
                mr: 2
              }}
            >
              {applicantInitial}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                {application.applicantName}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                <CalendarToday sx={{ fontSize: 14, color: 'text.secondary', mr: 0.5 }} />
                <Typography variant="body2" color="text.secondary">
                  Applied on {formatDate(application.dateApplied)}
                </Typography>
              </Box>
              
              {application.applicant && application.applicant.email && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <Email sx={{ fontSize: 14, color: 'text.secondary', mr: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    {application.applicant.email}
                  </Typography>
                </Box>
              )}
              
              {application.applicant && application.applicant.phone && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <Phone sx={{ fontSize: 14, color: 'text.secondary', mr: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    {application.applicant.phone}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
          
          <Chip
            icon={statusColor.icon}
            label={application.applicationStatus}
            sx={{
              bgcolor: statusColor.bgcolor,
              color: statusColor.color,
              fontWeight: 'medium'
            }}
          />
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<PersonIcon />}
            onClick={() => onViewProfile(application)}
            sx={{ 
              borderColor: '#2DBE5F',
              color: '#2DBE5F',
              '&:hover': {
                borderColor: '#259a4d',
                backgroundColor: 'rgba(45, 190, 95, 0.04)'
              }
            }}
          >
            View Profile
          </Button>
          
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <Select
              value={application.applicationStatus}
              onChange={(e) => onStatusChange(application.id, e.target.value)}
              sx={{ 
                borderRadius: 2,
                '.MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(45, 190, 95, 0.3)'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(45, 190, 95, 0.5)'
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#2DBE5F'
                }
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    borderRadius: 2,
                    mt: 0.5
                  }
                }
              }}
            >
              <MenuItem value="Pending">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <HourglassEmpty sx={{ fontSize: 18, mr: 1, color: '#ff9800' }} />
                  Pending Review
                </Box>
              </MenuItem>
              <MenuItem value="Accepted">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircle sx={{ fontSize: 18, mr: 1, color: '#2DBE5F' }} />
                  Accept Candidate
                </Box>
              </MenuItem>
              <MenuItem value="Rejected">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Cancel sx={{ fontSize: 18, mr: 1, color: '#f44336' }} />
                  Reject Candidate
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
      </CardContent>
    </Card>
  );
};

function JobApplicants() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [job, setJob] = useState({});
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (user.userId && jobId) {
      fetchJob();
      fetchApplications();
    }
  }, [user, jobId]);

  // Filter applications based on search query and status filter
  useEffect(() => {
    let filtered = [...applications];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app => 
        app.applicantName?.toLowerCase().includes(query) ||
        app.applicant?.email?.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(app => app.applicationStatus === statusFilter);
    }
    
    setFilteredApplications(filtered);
  }, [applications, searchQuery, statusFilter]);

  const fetchJob = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/jobs/${jobId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch job details");
      }
      const data = await res.json();
      setJob(data);
    } catch (error) {
      setError("Error fetching job details: " + error.message);
    }
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/job/${jobId}?userId=${user.userId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch applications");
      }
      const data = await res.json();
      setApplications(data);
      setFilteredApplications(data);
      setLoading(false);
    } catch (error) {
      setError("Error fetching applications: " + error.message);
      setLoading(false);
    }
  };

  const handleViewProfile = (application) => {
    if (application && application.applicant && application.applicant.userId) {
      navigate(`/applicant-profile/${application.applicant.userId}`);
    } else if (application && application.id) {
      // If we have the application ID but not applicant data, we could potentially 
      // fetch the applicant ID from the server first
      setSnackbar({
        open: true,
        message: "Unable to access full profile. Limited view available.",
        severity: "warning"
      });
    } else {
      setSnackbar({
        open: true,
        message: "Unable to view profile: Applicant data is incomplete",
        severity: "error"
      });
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/update/${applicationId}?status=${newStatus}&userId=${user.userId}`, {
        method: "PUT"
      });
      
      if (!res.ok) {
        throw new Error("Failed to update application status");
      }
      
      const responseText = await res.text();
      
      // Update the local state
      setApplications(prevApplications =>
        prevApplications.map(app =>
          app.id === applicationId ? { ...app, applicationStatus: newStatus } : app
        )
      );
      
      // Show success message
      setSnackbar({
        open: true,
        message: responseText || `Application status updated to ${newStatus}`,
        severity: "success"
      });
      
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message,
        severity: "error"
      });
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  // Count applications by status
  const getStatusCounts = () => {
    const counts = {
      total: applications.length,
      Pending: 0,
      Accepted: 0,
      Rejected: 0
    };
    
    applications.forEach(app => {
      counts[app.applicationStatus] = (counts[app.applicationStatus] || 0) + 1;
    });
    
    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <ThemeProvider theme={greenBlackTheme}>
      <Box sx={{ minHeight: '100vh', bgcolor: '#f7f9f7' }}>
        <EmployerNav
          handleLogout={() => {
            localStorage.removeItem("user");
            navigate("/login");
          }}
        />
        
        <Container sx={{ py: 4 }}>
          <Box sx={{ mb: 4 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => navigate("/providerhome")}
              sx={{ 
                mb: 3,
                borderColor: '#2DBE5F',
                color: '#2DBE5F',
                '&:hover': {
                  borderColor: '#259a4d',
                  backgroundColor: 'rgba(45, 190, 95, 0.04)'
                }
              }}
            >
              Back to My Jobs
            </Button>

            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                mb: 3, 
                border: '1px solid rgba(45, 190, 95, 0.1)',
                borderRadius: 3
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h4" fontWeight="bold">
                  {job.title}
                </Typography>
                <Chip
                  icon={<PeopleIcon />}
                  label={`${statusCounts.total} Total Applicants`}
                  sx={{ 
                    bgcolor: '#2DBE5F', 
                    color: 'white',
                    fontWeight: 'bold',
                    px: 1
                  }}
                />
              </Box>
              
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                {job.company} • {job.location} • {job.jobType}
              </Typography>
              
              {/* Status summary */}
              {!loading && applications.length > 0 && (
                <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                  <Chip
                    label={`${statusCounts.Pending || 0} Pending`}
                    size="small"
                    icon={<HourglassEmpty fontSize="small" />}
                    onClick={() => setStatusFilter(statusFilter === 'Pending' ? 'all' : 'Pending')}
                    sx={{ 
                      bgcolor: statusFilter === 'Pending' ? '#ff9800' : 'rgba(255, 152, 0, 0.1)',
                      color: statusFilter === 'Pending' ? 'white' : '#ff9800',
                      fontWeight: 'medium',
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: statusFilter === 'Pending' ? '#e68900' : 'rgba(255, 152, 0, 0.2)'
                      }
                    }}
                  />
                  <Chip
                    label={`${statusCounts.Accepted || 0} Accepted`}
                    size="small"
                    icon={<CheckCircle fontSize="small" />}
                    onClick={() => setStatusFilter(statusFilter === 'Accepted' ? 'all' : 'Accepted')}
                    sx={{ 
                      bgcolor: statusFilter === 'Accepted' ? '#2DBE5F' : 'rgba(45, 190, 95, 0.1)',
                      color: statusFilter === 'Accepted' ? 'white' : '#2DBE5F',
                      fontWeight: 'medium',
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: statusFilter === 'Accepted' ? '#259a4d' : 'rgba(45, 190, 95, 0.2)'
                      }
                    }}
                  />
                  <Chip
                    label={`${statusCounts.Rejected || 0} Rejected`}
                    size="small"
                    icon={<Cancel fontSize="small" />}
                    onClick={() => setStatusFilter(statusFilter === 'Rejected' ? 'all' : 'Rejected')}
                    sx={{ 
                      bgcolor: statusFilter === 'Rejected' ? '#f44336' : 'rgba(244, 67, 54, 0.1)',
                      color: statusFilter === 'Rejected' ? 'white' : '#f44336',
                      fontWeight: 'medium',
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: statusFilter === 'Rejected' ? '#d32f2f' : 'rgba(244, 67, 54, 0.2)'
                      }
                    }}
                  />
                  
                  {statusFilter !== 'all' && (
                    <Button 
                      size="small" 
                      onClick={() => setStatusFilter('all')}
                      sx={{ ml: 1, color: 'text.secondary' }}
                    >
                      Clear Filter
                    </Button>
                  )}
                </Box>
              )}
            </Paper>

            {/* Search Bar */}
            {!loading && applications.length > 0 && (
              <TextField
                fullWidth
                placeholder="Search applicants by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="outlined"
                size="small"
                sx={{ 
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    bgcolor: 'white',
                    '& fieldset': {
                      borderColor: 'rgba(45, 190, 95, 0.3)'
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(45, 190, 95, 0.5)'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#2DBE5F'
                    }
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="action" />
                    </InputAdornment>
                  )
                }}
              />
            )}
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress sx={{ color: '#2DBE5F' }} />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          ) : applications.length === 0 ? (
            <Paper 
              sx={{ 
                p: 4, 
                textAlign: "center",
                borderRadius: 3,
                border: '1px solid rgba(45, 190, 95, 0.1)'
              }}
            >
              <Box 
                component="img"
                src="/empty-applications.svg"
                alt="No applications"
                sx={{ 
                  width: 120, 
                  height: 120, 
                  opacity: 0.5,
                  mb: 2,
                  display: 'none' // Remove this if you have an image
                }}
              />
              
              <PeopleIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
              
              <Typography variant="h5" gutterBottom fontWeight="medium">
                No applications yet
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto', mb: 2 }}>
                There are no applications for this job posting at the moment. Check back later or share your job posting to attract more candidates.
              </Typography>
              
              <Button 
                variant="contained"
                sx={{ 
                  mt: 2,
                  bgcolor: '#2DBE5F',
                  color: 'white',
                  '&:hover': {
                    bgcolor: '#259a4d'
                  },
                  borderRadius: 2,
                  px: 3
                }}
              >
                Share Job Posting
              </Button>
            </Paper>
          ) : filteredApplications.length === 0 ? (
            <Paper 
              sx={{ 
                p: 4, 
                textAlign: "center",
                borderRadius: 3,
                border: '1px solid rgba(45, 190, 95, 0.1)'
              }}
            >
              <Search sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
              
              <Typography variant="h5" gutterBottom fontWeight="medium">
                No matching applicants
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto', mb: 2 }}>
                No applicants match your current search or filter. Try adjusting your search criteria.
              </Typography>
              
              <Button 
                variant="outlined"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
                sx={{ 
                  mt: 2,
                  borderColor: '#2DBE5F',
                  color: '#2DBE5F',
                  '&:hover': {
                    borderColor: '#259a4d',
                    backgroundColor: 'rgba(45, 190, 95, 0.04)'
                  },
                  borderRadius: 2
                }}
              >
                Clear All Filters
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {filteredApplications.map((application) => (
                <Grid item xs={12} key={application.id}>
                  <ApplicantCard 
                    application={application}
                    onStatusChange={handleStatusChange}
                    onViewProfile={handleViewProfile}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Container>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbar.severity}
            variant="filled"
            sx={{ 
              width: "100%",
              ...(snackbar.severity === 'success' && {
                bgcolor: '#2DBE5F' // Green success alerts
              })
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default JobApplicants;