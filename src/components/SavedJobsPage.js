import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  CircularProgress, 
  Snackbar, 
  Alert,
  Container,
  Box,
  Chip,
  Divider,
  Avatar,
  IconButton,
  Paper,
  useTheme,
  useMediaQuery,
  Badge,
  Tooltip,
  MenuItem,
  Menu,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  ButtonGroup
} from '@mui/material';
import { 
  ArrowBack, 
  Bookmark,
  Delete,
  Work, 
  AttachMoney, 
  Schedule, 
  LocationOn, 
  Business,
  MoreVert,
  FilterList,
  SortByAlpha,
  CalendarToday,
  Visibility,
  Launch
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import HomeNavbar from './HomeNavbar';

// A helper function to get the appropriate color for job type
const getJobTypeColor = (jobType) => {
  switch(jobType) {
    case 'Full-time':
      return { bg: '#e8f5e9', color: '#2e7d32' }; // green
    case 'Part-time':
      return { bg: '#f1f8e9', color: '#558b2f' }; // light green
    case 'Temporary':
      return { bg: '#f9fbe7', color: '#827717' }; // lime
    case 'Internship':
      return { bg: '#e0f2f1', color: '#00695c' }; // teal
    case 'Freelance':
      return { bg: '#e8f5e9', color: '#1b5e20' }; // dark green
    case 'Seasonal':
      return { bg: '#f1f8e9', color: '#33691e' }; // green variant
    default:
      return { bg: '#e3f2fd', color: '#1976d2' }; // blue (default)
  }
};

// Helper function to format date
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Job details dialog component
const JobDetailsDialog = ({ open, handleClose, job }) => {
  if (!job) return null;
  
  const jobTypeStyle = getJobTypeColor(job.jobType || 'Full-time');
  
  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      scroll="paper"
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      <Box sx={{ 
        bgcolor: 'black', 
        color: 'white', 
        p: 3,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12
      }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          {job.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Avatar 
            sx={{ 
              bgcolor: 'white', 
              color: 'black',
              width: 36,
              height: 36,
              mr: 1.5
            }}
          >
            {job.company?.charAt(0) || 'J'}
          </Avatar>
          <Typography variant="h6">{job.company}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LocationOn sx={{ mr: 0.5, fontSize: 18 }} />
          <Typography variant="body1">{job.location}</Typography>
        </Box>
      </Box>

      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {job.jobType && (
            <Grid item xs={6} sm={4}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Work sx={{ mr: 1, color: jobTypeStyle.color }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">Job Type</Typography>
                  <Typography variant="body1" fontWeight={500}>{job.jobType}</Typography>
                </Box>
              </Box>
            </Grid>
          )}
          
          {job.pay && (
            <Grid item xs={6} sm={4}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AttachMoney sx={{ mr: 1, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">Salary</Typography>
                  <Typography variant="body1" fontWeight={500}>{job.pay}</Typography>
                </Box>
              </Box>
            </Grid>
          )}
          
          {job.shiftAndSchedule && (
            <Grid item xs={6} sm={4}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Schedule sx={{ mr: 1, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">Schedule</Typography>
                  <Typography variant="body1" fontWeight={500}>{job.shiftAndSchedule}</Typography>
                </Box>
              </Box>
            </Grid>
          )}
        </Grid>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="h6" gutterBottom fontWeight={600}>
          Job Description
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary" 
          sx={{ 
            whiteSpace: 'pre-line',
            mb: 3
          }}
        >
          {job.description}
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button 
          onClick={handleClose} 
          variant="outlined"
          sx={{ borderRadius: 2, textTransform: 'none' }}
        >
          Close
        </Button>
        <Button 
          variant="contained"
          startIcon={<Work />}
          sx={{
            backgroundColor: 'black',
            color: 'white',
            '&:hover': {
              backgroundColor: '#333',
            },
            borderRadius: 2,
            textTransform: 'none',
            px: 3
          }}
        >
          Apply Now
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Enhanced SavedJobsPage component
function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('info');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobDetailsOpen, setJobDetailsOpen] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || {});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Fetch saved jobs from backend
  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/savedJobs/${user.userId}`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setSavedJobs(data);
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
      setMessage('Failed to load saved jobs. Please try again.');
      setSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  // Handle Apply button click
  const handleApply = async (jobPostId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/apply`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          userId: user.userId,
          jobPostId: jobPostId,
        }),
      });

      const result = await response.text();
      
      setMessage(result);
      setSeverity(response.ok ? 'success' : 'error');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error applying for job:', error);
      setMessage('An error occurred while applying.');
      setSeverity('error');
      setOpenSnackbar(true);
    }
  };

  // Handle delete saved job
  const handleDeleteSavedJob = async (savedJobId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/savedJobs/${savedJobId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove the deleted job from state
        setSavedJobs(prevJobs => prevJobs.filter(job => job.id !== savedJobId));
        setMessage('Job removed from saved list successfully');
        setSeverity('success');
      } else {
        setMessage('Failed to remove job from saved list');
        setSeverity('error');
      }
      
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error deleting saved job:', error);
      setMessage('An error occurred while removing the job.');
      setSeverity('error');
      setOpenSnackbar(true);
    }
  };

  // Navigate back to the previous page
  const handleBackClick = () => {
    navigate(-1);
  };

  // Open job details dialog
  const openJobDetails = (job) => {
    setSelectedJob(job);
    setJobDetailsOpen(true);
  };

  // Close job details dialog
  const closeJobDetails = () => {
    setJobDetailsOpen(false);
  };

  // Navigate to full job page
  const viewFullJob = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  // Sort options handlers
  const handleSortClick = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setSortAnchorEl(null);
  };

  const handleSort = (sortType) => {
    let sortedJobs = [...savedJobs];
    
    switch(sortType) {
      case 'title':
        sortedJobs.sort((a, b) => a.jobPost.title.localeCompare(b.jobPost.title));
        break;
      case 'company':
        sortedJobs.sort((a, b) => a.jobPost.company.localeCompare(b.jobPost.company));
        break;
      case 'date':
        sortedJobs.sort((a, b) => new Date(b.savedDate) - new Date(a.savedDate));
        break;
      default:
        break;
    }
    
    setSavedJobs(sortedJobs);
    handleSortClose();
  };

  // Open delete confirmation dialog
  const openDeleteConfirmDialog = (jobId) => {
    setJobToDelete(jobId);
    setConfirmDeleteDialogOpen(true);
  };

  // Handle confirmation of delete
  const confirmDelete = () => {
    if (jobToDelete) {
      handleDeleteSavedJob(jobToDelete);
    }
    setConfirmDeleteDialogOpen(false);
    setJobToDelete(null);
  };

  useEffect(() => {
    if (user.userId) {
      fetchSavedJobs();
    } else {
      navigate('/login');
    }
  }, [user.userId, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser({});
    navigate('/login');
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: '#f5f7fa'
    }}>
      <HomeNavbar handleLogout={handleLogout} userAvatar={user.profileImage} user={user} />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3
        }}>
          <Button 
            variant="outlined" 
            startIcon={<ArrowBack />}
            onClick={handleBackClick}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              boxShadow: 'none'
            }}
          >
            Back to Jobs
          </Button>
          
          <Box>
            <Tooltip title="Sort Jobs">
              <IconButton 
                onClick={handleSortClick}
                sx={{ 
                  ml: 1,
                  backgroundColor: 'white',
                  boxShadow: '0px 1px 3px rgba(0,0,0,0.1)',
                  '&:hover': {
                    backgroundColor: '#f5f5f5'
                  }
                }}
              >
                <SortByAlpha />
              </IconButton>
            </Tooltip>
            
            <Menu
              anchorEl={sortAnchorEl}
              open={Boolean(sortAnchorEl)}
              onClose={handleSortClose}
            >
              <MenuItem onClick={() => handleSort('title')}>Sort by Job Title</MenuItem>
              <MenuItem onClick={() => handleSort('company')}>Sort by Company</MenuItem>
              <MenuItem onClick={() => handleSort('date')}>Sort by Date Saved</MenuItem>
            </Menu>
          </Box>
        </Box>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Your Saved Jobs
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {savedJobs.length} {savedJobs.length === 1 ? 'job' : 'jobs'} saved to your profile
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '50vh' 
          }}>
            <CircularProgress />
          </Box>
        ) : savedJobs.length === 0 ? (
          <Paper sx={{ 
            p: 4, 
            textAlign: 'center',
            borderRadius: 2,
            backgroundColor: 'white',
            boxShadow: '0px 2px 8px rgba(0,0,0,0.08)'
          }}>
            <Box sx={{ 
              width: '100%',
              maxWidth: 400,
              mx: 'auto',
              py: 4
            }}>
              <Bookmark sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h5" gutterBottom fontWeight="medium">
                No saved jobs yet
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Jobs you save will appear here. Start browsing to find and save jobs that interest you.
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => navigate('/home')}
                sx={{ 
                  backgroundColor: 'black',
                  color: 'white', 
                  '&:hover': { backgroundColor: '#333' },
                  px: 4,
                  py: 1,
                  textTransform: 'none',
                  borderRadius: 2
                }}
              >
                Browse Jobs
              </Button>
            </Box>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {savedJobs.map((savedJob) => {
              const jobPost = savedJob.jobPost;
              const jobTypeStyle = getJobTypeColor(jobPost.jobType || 'Full-time');
              
              return (
                <Grid item xs={12} sm={6} md={4} key={savedJob.id}>
                  <Card 
                    sx={{ 
                      borderRadius: 3,
                      boxShadow: '0px 2px 10px rgba(0,0,0,0.08)',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0px 6px 15px rgba(0,0,0,0.1)',
                      }
                    }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'flex-start',
                      p: 2,
                      pb: 0
                    }}>
                      <Avatar 
                        variant="rounded"
                        sx={{ 
                          backgroundColor: '#f0f0f0',
                          color: '#666',
                          width: 48,
                          height: 48,
                          fontWeight: 'bold'
                        }}
                      >
                        {jobPost.company?.charAt(0) || 'J'}
                      </Avatar>
                      
                      <IconButton 
                        size="small"
                        onClick={() => openDeleteConfirmDialog(savedJob.id)}
                        aria-label="remove saved job"
                        sx={{ color: 'text.secondary' }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                    
                    <CardContent sx={{ flex: 1, pt: 1 }}>
                      <Typography 
                        variant="h6" 
                        gutterBottom 
                        sx={{ 
                          fontWeight: 'bold',
                          fontSize: '1.125rem',
                          lineHeight: 1.3,
                          mb: 0.5, 
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          height: '2.6em'
                        }}
                      >
                        {jobPost.title}
                      </Typography>
                      
                      <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                        <Business sx={{ fontSize: 14, color: 'text.secondary', mr: 0.5 }} />
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          noWrap
                          sx={{ flexGrow: 1 }}
                        >
                          {jobPost.company}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                        <LocationOn sx={{ fontSize: 14, color: 'text.secondary', mr: 0.5 }} />
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          noWrap
                          sx={{ flexGrow: 1 }}
                        >
                          {jobPost.location}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <Chip 
                          label={jobPost.jobType || "Full-time"} 
                          size="small"
                          sx={{ 
                            backgroundColor: jobTypeStyle.bg,
                            color: jobTypeStyle.color,
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            borderRadius: 1,
                            mr: 1,
                            mb: 1
                          }} 
                        />
                        
                        {jobPost.pay && (
                          <Chip 
                            icon={<AttachMoney sx={{ fontSize: 14 }} />} 
                            label={jobPost.pay} 
                            size="small"
                            variant="outlined"
                            sx={{ 
                              borderRadius: 1,
                              fontSize: '0.75rem',
                              mb: 1
                            }} 
                          />
                        )}
                      </Box>
                      
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          mb: 2,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          height: '3.6em'
                        }}
                      >
                        {jobPost.description}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <CalendarToday sx={{ fontSize: 14, color: 'text.secondary', mr: 0.5 }} />
                        <Typography variant="caption" color="text.secondary">
                          Saved on {formatDate(savedJob.savedDate || new Date())}
                        </Typography>
                      </Box>
                    </CardContent>
                    
                    <Box sx={{ p: 2, pt: 0 }}>
                      <Grid container spacing={1}>
                        <Grid item xs={12} sx={{ mb: 1 }}>
                          <Button
                            variant="outlined"
                            startIcon={<Visibility />}
                            onClick={() => openJobDetails(jobPost)}
                            fullWidth
                            sx={{
                              borderColor: 'rgba(0,0,0,0.23)',
                              color: 'text.primary',
                              '&:hover': {
                                backgroundColor: 'rgba(0,0,0,0.04)',
                              },
                              borderRadius: 2,
                              py: 0.75,
                              textTransform: 'none',
                            }}
                          >
                            View Full Job Post
                          </Button>
                        </Grid>
                        <Grid item xs={12}>
                          <Button
                            variant="contained"
                            startIcon={<Work />}
                            onClick={() => handleApply(jobPost.id)}
                            fullWidth
                            sx={{
                              backgroundColor: 'black',
                              color: 'white',
                              '&:hover': {
                                backgroundColor: '#333',
                              },
                              borderRadius: 2,
                              py: 0.75,
                              textTransform: 'none',
                              fontWeight: 'medium'
                            }}
                          >
                            Apply Now
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>

      {/* Job Details Dialog */}
      <JobDetailsDialog 
        open={jobDetailsOpen}
        handleClose={closeJobDetails}
        job={selectedJob}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity={severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
      
      {/* Confirmation Dialog for Delete */}
      <Dialog
        open={confirmDeleteDialogOpen}
        onClose={() => setConfirmDeleteDialogOpen(false)}
      >
        <DialogTitle>Remove Saved Job</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove this job from your saved list?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setConfirmDeleteDialogOpen(false)} 
            color="primary"
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmDelete} 
            color="error" 
            autoFocus
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default SavedJobsPage;