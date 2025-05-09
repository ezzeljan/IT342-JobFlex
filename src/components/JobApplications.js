import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Stack,
  Box,
  Snackbar,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
  Avatar,
  useTheme,
  useMediaQuery,
  Tabs,
  Tab,
  Badge
} from '@mui/material';
import {
  ArrowBack,
  WorkOff,
  Business,
  CalendarToday,
  Cancel as CancelIcon,
  CheckCircle,
  HourglassEmpty,
  Close,
  FilterList,
  Search,
  Visibility,
  Work,
  Timeline,
  MoreVert,
  LocationOn,
  DoNotDisturb
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import HomeNavbar from './HomeNavbar';
import { ThemeProvider, createTheme } from '@mui/material/styles';

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
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Helper function to get status chip props with green and black theme
const getStatusChipProps = (status) => {
  const statusLower = status?.toLowerCase() || '';
  
  if (statusLower.includes('pending') || statusLower.includes('review')) {
    return { 
      color: 'warning', 
      icon: <HourglassEmpty fontSize="small" />,
      label: 'Under Review'
    };
  } else if (statusLower.includes('reject') || statusLower.includes('declined')) {
    return { 
      color: 'error', 
      icon: <Close fontSize="small" />,
      label: 'Rejected'
    };
  } else if (statusLower.includes('accept') || statusLower.includes('hired') || statusLower.includes('success')) {
    return { 
      color: 'success', 
      icon: <CheckCircle fontSize="small" />,
      label: 'Accepted'
    };
  } else if (statusLower.includes('cancel')) {
    return { 
      color: 'default', 
      icon: <DoNotDisturb fontSize="small" />,
      label: 'Cancelled'
    };
  }
  
  // Default
  return { 
    color: 'default', 
    icon: <HourglassEmpty fontSize="small" />,
    label: status || 'Pending'
  };
};

// Application Card Component
const ApplicationCard = ({ application, onCancel, onView }) => {
  const statusProps = getStatusChipProps(application.applicationStatus);
  const canCancel = application.applicationStatus?.toLowerCase().includes('pending') || 
                   application.applicationStatus?.toLowerCase().includes('review');
  
  return (
    <Card sx={{
      borderRadius: 3,
      boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
      height: '100%',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
      },
      border: '1px solid rgba(45, 190, 95, 0.1)' // Very light green border
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <Avatar 
              variant="rounded"
              sx={{ 
                bgcolor: 'rgba(45, 190, 95, 0.1)', // Very light green background
                color: '#2DBE5F', // Green text
                width: 48,
                height: 48,
                fontWeight: 'bold',
                mr: 2
              }}
            >
              {application.company?.charAt(0) || 'J'}
            </Avatar>
            
            <Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {application.jobTitle}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <Business sx={{ fontSize: 14, color: 'text.secondary', mr: 0.5 }} />
                <Typography variant="body2" color="text.secondary" noWrap>
                  {application.company}
                </Typography>
              </Box>
              
              {application.location && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationOn sx={{ fontSize: 14, color: 'text.secondary', mr: 0.5 }} />
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {application.location}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
          
          <Chip
            icon={statusProps.icon}
            label={statusProps.label}
            color={statusProps.color}
            size="small"
            sx={{ fontWeight: 'medium' }}
          />
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CalendarToday sx={{ fontSize: 14, color: 'text.secondary', mr: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              Applied {formatDate(application.dateApplied)}
            </Typography>
          </Box>
          
          <Box>
            <Button 
              variant="outlined"
              size="small"
              onClick={() => onView(application)}
              sx={{ 
                mr: 1, 
                borderRadius: 2,
                borderColor: '#2DBE5F', // Green border
                color: '#2DBE5F', // Green text
                '&:hover': {
                  borderColor: '#259a4d', // Darker green on hover
                  backgroundColor: 'rgba(45, 190, 95, 0.04)' // Very light green background on hover
                }
              }}
            >
              View Details
            </Button>
            
            {canCancel && (
              <Button 
                variant="outlined"
                color="error"
                size="small"
                startIcon={<CancelIcon />}
                onClick={() => onCancel(application.id)}
                sx={{ 
                  borderRadius: 2
                }}
              >
                Cancel
              </Button>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

// Application Detail Dialog
const ApplicationDetailDialog = ({ open, application, onClose, onCancel }) => {
  if (!application) return null;
  
  const statusProps = getStatusChipProps(application.applicationStatus);
  const canCancel = application.applicationStatus?.toLowerCase().includes('pending') || 
                   application.applicationStatus?.toLowerCase().includes('review');
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: '#000000', // Black background 
        color: 'white',
        py: 3
      }}>
        <Typography variant="h5" fontWeight="bold">
          Application Details
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ py: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="overline" color="text.secondary">
            JOB INFORMATION
          </Typography>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {application.jobTitle}
          </Typography>
          <Typography variant="body1">
            {application.company}
          </Typography>
          {application.location && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <LocationOn sx={{ fontSize: 18, color: 'text.secondary', mr: 0.5 }} />
              <Typography variant="body2" color="text.secondary">
                {application.location}
              </Typography>
            </Box>
          )}
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="overline" color="text.secondary">
            APPLICATION STATUS
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Chip
              icon={statusProps.icon}
              label={statusProps.label}
              color={statusProps.color}
              sx={{ fontWeight: 'medium', mr: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
              Last updated {formatDate(application.lastUpdated || application.dateApplied)}
            </Typography>
          </Box>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box>
          <Typography variant="overline" color="text.secondary">
            APPLICATION TIMELINE
          </Typography>
          <Box sx={{ mt: 2, pl: 2, borderLeft: '2px solid #2DBE5F' }}> {/* Green timeline */}
            <Box sx={{ position: 'relative', mb: 3, pl: 2 }}>
              <Box 
                sx={{ 
                  width: 10, 
                  height: 10, 
                  borderRadius: '50%', 
                  bgcolor: '#2DBE5F', // Green dot
                  position: 'absolute',
                  left: -6,
                  top: 6
                }} 
              />
              <Typography variant="body2" fontWeight="bold">
                Application Submitted
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatDate(application.dateApplied)}
              </Typography>
            </Box>
            
            {application.applicationStatus?.toLowerCase().includes('cancel') && (
              <Box sx={{ position: 'relative', mb: 3, pl: 2 }}>
                <Box 
                  sx={{ 
                    width: 10, 
                    height: 10, 
                    borderRadius: '50%', 
                    bgcolor: 'text.disabled',
                    position: 'absolute',
                    left: -6,
                    top: 6
                  }} 
                />
                <Typography variant="body2" fontWeight="bold">
                  Application Cancelled
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDate(application.lastUpdated || new Date())}
                </Typography>
              </Box>
            )}
            
            {application.applicationStatus?.toLowerCase().includes('reject') && (
              <Box sx={{ position: 'relative', mb: 3, pl: 2 }}>
                <Box 
                  sx={{ 
                    width: 10, 
                    height: 10, 
                    borderRadius: '50%', 
                    bgcolor: '#f44336', // Red dot for rejection
                    position: 'absolute',
                    left: -6,
                    top: 6
                  }} 
                />
                <Typography variant="body2" fontWeight="bold">
                  Application Rejected
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDate(application.lastUpdated || new Date())}
                </Typography>
              </Box>
            )}
            
            {application.applicationStatus?.toLowerCase().includes('accept') && (
              <Box sx={{ position: 'relative', mb: 3, pl: 2 }}>
                <Box 
                  sx={{ 
                    width: 10, 
                    height: 10, 
                    borderRadius: '50%', 
                    bgcolor: '#2DBE5F', // Green dot for acceptance
                    position: 'absolute',
                    left: -6,
                    top: 6
                  }} 
                />
                <Typography variant="body2" fontWeight="bold">
                  Application Accepted
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDate(application.lastUpdated || new Date())}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={onClose} 
          sx={{ 
            borderRadius: 2,
            color: 'text.secondary'
          }}
        >
          Close
        </Button>
        {canCancel && (
          <Button 
            variant="outlined"
            color="error"
            startIcon={<CancelIcon />}
            onClick={() => {
              onCancel(application.id);
              onClose();
            }}
            sx={{ 
              borderRadius: 2
            }}
          >
            Cancel Application
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

// Main JobApplications Component
const JobApplications = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user] = useState(JSON.parse(localStorage.getItem('user')) || {});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  const [confirmCancelDialog, setConfirmCancelDialog] = useState({
    open: false,
    applicationId: null
  });
  const [detailDialog, setDetailDialog] = useState({
    open: false,
    application: null
  });
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate('/login');
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Open cancel confirmation dialog
  const openCancelDialog = (applicationId) => {
    setConfirmCancelDialog({
      open: true,
      applicationId
    });
  };

  // Close cancel confirmation dialog
  const closeCancelDialog = () => {
    setConfirmCancelDialog({
      open: false,
      applicationId: null
    });
  };

  // Handle canceling an application
  const handleCancelApplication = async () => {
    try {
      const applicationId = confirmCancelDialog.applicationId;
      if (!applicationId) return;
      
      const response = await fetch(`http://localhost:8080/api/applications/${applicationId}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to cancel application: ${response.statusText}`);
      }

      // Update the application status locally
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? { ...app, applicationStatus: 'Cancelled' } 
            : app
        )
      );

      setSnackbar({
        open: true,
        message: 'Application cancelled successfully',
        severity: 'success'
      });
    } catch (err) {
      console.error('Error cancelling application:', err);
      setSnackbar({
        open: true,
        message: `Error: ${err.message}`,
        severity: 'error'
      });
    } finally {
      closeCancelDialog();
    }
  };

  // Open application detail dialog
  const openDetailDialog = (application) => {
    setDetailDialog({
      open: true,
      application
    });
  };

  // Close application detail dialog
  const closeDetailDialog = () => {
    setDetailDialog({
      open: false,
      application: null
    });
  };

  // Handle status filter change
  const handleStatusFilterChange = (event, newValue) => {
    setStatusFilter(newValue);
  };

  // Apply status filter to applications
  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredApplications(applications);
    } else {
      const filtered = applications.filter(app => {
        const status = app.applicationStatus?.toLowerCase() || '';
        
        switch(statusFilter) {
          case 'pending':
            return status.includes('pending') || status.includes('review');
          case 'accepted':
            return status.includes('accept') || status.includes('hired');
          case 'rejected':
            return status.includes('reject') || status.includes('declined');
          case 'cancelled':
            return status.includes('cancel');
          default:
            return true;
        }
      });
      
      setFilteredApplications(filtered);
    }
  }, [statusFilter, applications]);

  // Fetch applications from backend
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/api/applications/${user.userId}`);
        
        if (!response.ok) {
          throw new Error(`Server returned ${response.status}: ${response.statusText}`);
        }
        
        // Get the response text first to check if it's empty
        const responseText = await response.text();
        
        // Only try to parse as JSON if we have a non-empty response
        let data = [];
        if (responseText && responseText.trim().length > 0) {
          try {
            data = JSON.parse(responseText);
          } catch (parseError) {
            console.error('JSON parse error:', parseError);
            throw new Error('Invalid response format from server');
          }
        }
        
        setApplications(Array.isArray(data) ? data : []);
        setFilteredApplications(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
        setSnackbar({
          open: true,
          message: `Error: ${err.message}`,
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    if (user && user.userId) {
      fetchApplications();
    } else {
      setLoading(false);
      setError('User not logged in');
    }
  }, [user]);

  // Count applications by status
  const getStatusCounts = () => {
    const counts = {
      pending: 0,
      accepted: 0,
      rejected: 0,
      cancelled: 0
    };
    
    applications.forEach(app => {
      const status = app.applicationStatus?.toLowerCase() || '';
      
      if (status.includes('pending') || status.includes('review')) {
        counts.pending++;
      } else if (status.includes('accept') || status.includes('hired')) {
        counts.accepted++;
      } else if (status.includes('reject') || status.includes('declined')) {
        counts.rejected++;
      } else if (status.includes('cancel')) {
        counts.cancelled++;
      }
    });
    
    return counts;
  };
  
  const statusCounts = getStatusCounts();

  return (
    <ThemeProvider theme={greenBlackTheme}>
      <Box sx={{ bgcolor: '#f7f9f7', minHeight: '100vh' }}> {/* Very light green background */}
        <HomeNavbar handleLogout={handleLogout} userAvatar={user.profileImage} user={user} />
        
        {loading ? (
          <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <CircularProgress sx={{ color: '#2DBE5F' }} /> {/* Green loading spinner */}
          </Container>
        ) : (
          <Container sx={{ py: 4 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: { xs: 'flex-start', sm: 'center' },
              flexDirection: { xs: 'column', sm: 'row' },
              mb: 3
            }}>
              <Box>
                <Button 
                  startIcon={<ArrowBack />} 
                  onClick={() => navigate(-1)}
                  variant="outlined"
                  sx={{ 
                    mb: { xs: 2, sm: 0 },
                    borderRadius: 2,
                    borderColor: '#2DBE5F', // Green border
                    color: '#2DBE5F', // Green text
                    '&:hover': {
                      borderColor: '#259a4d', // Darker green on hover
                      backgroundColor: 'rgba(45, 190, 95, 0.04)' // Very light green background on hover
                    }
                  }}
                >
                  Back
                </Button>
              </Box>
              
              <Typography variant="h4" fontWeight="bold" color="#212121">
                Your Applications
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {!error && applications.length === 0 ? (
              <Paper 
                sx={{ 
                  p: 4, 
                  borderRadius: 3,
                  textAlign: 'center',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                  border: '1px solid rgba(45, 190, 95, 0.1)' // Very light green border
                }}
              >
                <Box sx={{ 
                  width: '100%',
                  maxWidth: 400,
                  mx: 'auto',
                  py: 6
                }}>
                  <WorkOff sx={{ fontSize: 70, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="h5" gutterBottom fontWeight="medium">
                    You haven't applied to any jobs yet
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    Browse available job listings and start applying to find your next opportunity.
                  </Typography>
                  <Button 
                    variant="contained" 
                    onClick={() => navigate('/homepage')}
                    sx={{ 
                      mt: 2,
                      bgcolor: '#2DBE5F', // Green button
                      color: 'white',
                      '&:hover': {
                        bgcolor: '#259a4d' // Darker green on hover
                      },
                      borderRadius: 2,
                      px: 4,
                      py: 1
                    }}
                  >
                    Browse Jobs
                  </Button>
                </Box>
              </Paper>
            ) : (!error && (
              <>
                <Paper sx={{ 
                  borderRadius: 3, 
                  mb: 4, 
                  overflow: 'hidden',
                  border: '1px solid rgba(45, 190, 95, 0.1)' // Very light green border
                }}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs 
                      value={statusFilter} 
                      onChange={handleStatusFilterChange}
                      indicatorColor="primary" // Green indicator
                      textColor="primary" // Green text
                      variant="scrollable"
                      scrollButtons="auto"
                      allowScrollButtonsMobile
                      sx={{ 
                        px: 2, 
                        '& .MuiTab-root': { 
                          textTransform: 'none',
                          py: 2,
                          px: 3
                        } 
                      }}
                    >
                      <Tab 
                        value="all" 
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography>All Applications</Typography>
                            <Chip 
                              size="small" 
                              label={applications.length} 
                              sx={{ ml: 1, height: 20, minWidth: 28 }} 
                            />
                          </Box>
                        } 
                      />
                      <Tab 
                        value="pending" 
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography>Pending</Typography>
                            {statusCounts.pending > 0 && (
                              <Chip 
                                size="small" 
                                color="warning"
                                label={statusCounts.pending} 
                                sx={{ ml: 1, height: 20, minWidth: 28 }} 
                              />
                            )}
                          </Box>
                        } 
                      />
                      <Tab 
                        value="accepted" 
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography>Accepted</Typography>
                            {statusCounts.accepted > 0 && (
                              <Chip 
                                size="small" 
                                color="success" // Green chip
                                label={statusCounts.accepted} 
                                sx={{ ml: 1, height: 20, minWidth: 28 }} 
                              />
                            )}
                          </Box>
                        } 
                      />
                      <Tab 
                        value="rejected" 
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography>Rejected</Typography>
                            {statusCounts.rejected > 0 && (
                              <Chip 
                                size="small" 
                                color="error"
                                label={statusCounts.rejected} 
                                sx={{ ml: 1, height: 20, minWidth: 28 }} 
                              />
                            )}
                          </Box>
                        } 
                      />
                      <Tab 
                        value="cancelled" 
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography>Cancelled</Typography>
                            {statusCounts.cancelled > 0 && (
                              <Chip 
                                size="small" 
                                label={statusCounts.cancelled} 
                                sx={{ ml: 1, height: 20, minWidth: 28 }} 
                              />
                            )}
                          </Box>
                        } 
                      />
                    </Tabs>
                  </Box>
                </Paper>
                
                {filteredApplications.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No applications match the selected filter
                    </Typography>
                    <Button 
                      variant="outlined" 
                      onClick={() => setStatusFilter('all')}
                      sx={{ 
                        mt: 2,
                        borderRadius: 2,
                        borderColor: '#2DBE5F', // Green border
                        color: '#2DBE5F', // Green text
                        '&:hover': {
                          borderColor: '#259a4d', // Darker green on hover
                          backgroundColor: 'rgba(45, 190, 95, 0.04)' // Very light green background on hover
                        }
                      }}
                    >
                      View All Applications
                    </Button>
                  </Box>
                ) : (
                  <Grid container spacing={3}>
                    {filteredApplications.map((application) => (
                      <Grid item xs={12} sm={6} md={4} key={application.id}>
                        <ApplicationCard 
                          application={application}
                          onCancel={openCancelDialog}
                          onView={openDetailDialog}
                        />
                      </Grid>
                    ))}
                  </Grid>
                )}
              </>
            ))}
            
            {/* Cancel Application Confirmation Dialog */}
            <Dialog
              open={confirmCancelDialog.open}
              onClose={closeCancelDialog}
              PaperProps={{
                sx: { borderRadius: 3 }
              }}
            >
              <DialogTitle>Cancel Application</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Are you sure you want to cancel this application? This action cannot be undone.
                </DialogContentText>
              </DialogContent>
              <DialogActions sx={{ p: 3 }}>
                <Button 
                  onClick={closeCancelDialog}
                  sx={{ 
                    borderRadius: 2,
                    color: 'text.secondary'
                  }}
                >
                  No, Keep Application
                </Button>
                <Button 
                  onClick={handleCancelApplication} 
                  variant="contained"
                  sx={{ 
                    borderRadius: 2,
                    bgcolor: '#2DBE5F', // Green confirm button
                    color: 'white',
                    '&:hover': {
                      bgcolor: '#259a4d' // Darker green on hover
                    }
                  }}
                >
                  Yes, Cancel Application
                </Button>
              </DialogActions>
            </Dialog>
            
            {/* Application Detail Dialog */}
            <ApplicationDetailDialog 
              open={detailDialog.open}
              application={detailDialog.application}
              onClose={closeDetailDialog}
              onCancel={openCancelDialog}
            />

            {/* Snackbar */}
            <Snackbar 
              open={snackbar.open} 
              autoHideDuration={6000} 
              onClose={handleSnackbarClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
              <Alert 
                onClose={handleSnackbarClose} 
                severity={snackbar.severity}
                variant="filled"
                sx={{ 
                  width: '100%',
                  ...(snackbar.severity === 'success' && {
                    bgcolor: '#2DBE5F' // Make success alerts green
                  })
                }}
              >
                {snackbar.message}
              </Alert>
            </Snackbar>
          </Container>
        )}
      </Box>
    </ThemeProvider>
  );
}

export default JobApplications;