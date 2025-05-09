import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Snackbar,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import {
  BusinessCenter as BusinessCenterIcon,
  LocationOn as LocationOnIcon,
  AttachMoney as AttachMoneyIcon,
  Description as DescriptionIcon,
  Category as CategoryIcon
} from '@mui/icons-material';

function JobPost() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([
    "Technology",
    "Healthcare",
    "Finance",
    "Engineering",
    "Remote",
    "Education",
    "Marketing",
    "Sales",
    "Customer Service",
    "Administration",
    "Hospitality",
    "Retail",
    "Manufacturing",
    "Construction",
    "Transportation",
    "Other"
  ]);
  
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    pay: '',
    jobType: '',
    shiftAndSchedule: '',
    description: '',
    category: ''
  });
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Job types and shift schedule options
  const JOB_TYPES = [
    "Full-time",
    "Part-time",
    "Temporary",
    "Internship",
    "Freelance",
    "Seasonal"
  ];

  const SHIFT_SCHEDULE_OPTIONS = [
    "Day shift",
    "Night shift",
    "Rotating shift",
    "Fixed shift",
    "Flexible schedule",
    "Weekday only",
    "Weekend availability",
    "8 hour shift",
    "10 hour shift",
    "12 hour shift",
    "Overtime",
    "Split shift"
  ];

  useEffect(() => {
    // Load user data from localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
    
    // Fetch categories from backend (optional if you want to dynamically load categories)
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/jobs/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    // Uncomment when backend endpoint is ready
    // fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setSnackbar({
        open: true,
        message: 'You must be logged in to post a job',
        severity: 'error'
      });
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/jobs/post?userId=${user.userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'Job posted successfully!',
          severity: 'success'
        });
        
        
        // Reset form after successful submission
        setFormData({
          title: '',
          company: '',
          location: '',
          pay: '',
          jobType: '',
          shiftAndSchedule: '',
          description: '',
          category: ''
        });

        navigate('/providerhome');

      } else {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to post job');
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error: ${error.message}`,
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          Post a New Job
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Job Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BusinessCenterIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Pay"
                name="pay"
                value={formData.pay}
                onChange={handleChange}
                placeholder="e.g. $15-20/hr or $60,000-75,000/year"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoneyIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel id="job-type-label">Job Type</InputLabel>
                <Select
                  labelId="job-type-label"
                  id="job-type"
                  name="jobType"
                  value={formData.jobType}
                  label="Job Type"
                  onChange={handleChange}
                >
                  {JOB_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="shift-schedule-label">Shift & Schedule</InputLabel>
                <Select
                  labelId="shift-schedule-label"
                  id="shift-schedule"
                  name="shiftAndSchedule"
                  value={formData.shiftAndSchedule}
                  label="Shift & Schedule"
                  onChange={handleChange}
                >
                  {SHIFT_SCHEDULE_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel id="category-label">Job Category</InputLabel>
                <Select
                  labelId="category-label"
                  id="category"
                  name="category"
                  value={formData.category}
                  label="Job Category"
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CategoryIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>{category}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                multiline
                rows={6}
                label="Job Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                      <DescriptionIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
            <Button
              variant="outlined"
              color="secondary"
              sx={{ mr: 2 }}
              onClick={() => navigate('/providerhome')}
            >
              Back
            </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                sx={{
                  mt: 2,
                  py: 1.5,
                  px: 4,
                  borderRadius: 2,
                  backgroundColor: '#2DBE5F',
                  '&:hover': {
                    backgroundColor: '#28ab56',
                  },
                }}
              >
                Post Job
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default JobPost