import React, { useEffect, useState } from 'react';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import HomeNavbar from './HomeNavbar';
import { HelpOutline } from '@mui/icons-material';
import { 
  Grid, 
  Card, 
  Typography, 
  Button, 
  Box, 
  TextField,
  InputAdornment, 
  Paper, 
  Snackbar, 
  Alert,
  Chip,
  CardContent,
  Divider,
  Avatar,
  IconButton,
  Skeleton,
  Container,
  Popper,
  Grow,
  ClickAwayListener,
  Tooltip
} from '@mui/material';
import { 
  Search, 
  LocationOn, 
  BusinessCenter, 
  AttachMoney, 
  Schedule, 
  Bookmark, 
  BookmarkBorder,
  KeyboardArrowRight,
  Work,
  Category as CategoryIcon,
  School as EducationIcon,
  HealthAndSafety as HealthcareIcon,
  AccountBalance as FinanceIcon,
  Engineering as EngineeringIcon,
  Computer as TechnologyIcon,
  Storefront as RetailIcon,
  AccessTime
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    "& fieldset": { border: "none" },
    "&:hover fieldset": { border: "none" },
    "&.Mui-focused fieldset": { border: "none" },
  },
  "& .MuiInputBase-input": {
    padding: "4px 0",
  },
});

const SearchButton = styled(Button)({
  backgroundColor: "black",
  color: "white",
  borderRadius: "4px",
  "&:hover": {
    backgroundColor: "#333",
  },
  textTransform: "none",
  padding: "6px 16px",
});

// Function to format date and time
const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return "Recently posted";
  
  try {
    const date = new Date(dateTimeString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) return "Recently posted";
    
    // Calculate relative time
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 60) {
      return diffMinutes === 1 ? "1 minute ago" : `${diffMinutes} minutes ago`;
    } else if (diffHours < 24) {
      return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
    } else if (diffDays < 7) {
      return diffDays === 1 ? "Yesterday" : `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
    } else {
      const months = Math.floor(diffDays / 30);
      return months === 1 ? "1 month ago" : `${months} months ago`;
    }
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Recently posted";
  }
};

// Format date for the tooltip
const formatFullDateTime = (dateTimeString) => {
  if (!dateTimeString) return "";
  
  try {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  } catch (error) {
    return "";
  }
};

// Function to get appropriate icon for category
const getCategoryIcon = (category) => {
  switch(category?.toLowerCase()) {
    case 'technology':
      return <TechnologyIcon />;
    case 'healthcare':
      return <HealthcareIcon />;
    case 'finance':
      return <FinanceIcon />;
    case 'engineering':
      return <EngineeringIcon />;
    case 'education':
      return <EducationIcon />;
    case 'retail':
      return <RetailIcon />;
    default:
      return <CategoryIcon />;
  }
};

// Get color scheme for category
const getCategoryColor = (category) => {
  switch(category) {
    case 'Technology':
      return { bg: '#e3f2fd', color: '#1976d2' }; // blue
    case 'Healthcare':
      return { bg: '#e8eaf6', color: '#3f51b5' }; // indigo
    case 'Finance':
      return { bg: '#fff8e1', color: '#ffa000' }; // amber
    case 'Engineering':
      return { bg: '#f3e5f5', color: '#9c27b0' }; // purple
    case 'Remote':
      return { bg: '#e0f7fa', color: '#00acc1' }; // cyan
    case 'Education':
      return { bg: '#fce4ec', color: '#e91e63' }; // pink
    default:
      return { bg: '#f5f5f5', color: '#757575' }; // grey
  }
};

// Enhanced job card component
const JobCard = ({ job, selected, onClick }) => {
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

  const relativeTime = formatDateTime(job.postedDate);
  const fullDateTime = formatFullDateTime(job.postedDate);
  const jobTypeStyle = getJobTypeColor(job.jobType || 'Full-time');
  const categoryStyle = getCategoryColor(job.category || 'Other');

  return (
    <Card
      variant="outlined"
      sx={{
        mb: 2,
        p: 0,
        cursor: 'pointer',
        borderRadius: 2,
        boxShadow: selected ? 3 : 1,
        borderLeft: selected ? '4px solid #000' : 'none',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: 3,
          transform: 'translateY(-2px)',
        },
        position: 'relative',
        overflow: 'hidden',
      }}
      onClick={onClick}
    >
      {selected && (
        <Box sx={{ 
          position: 'absolute', 
          top: 0, 
          bottom: 0, 
          left: 0, 
          width: '4px', 
          backgroundColor: 'black' 
        }} />
      )}
      
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
              {job.title}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
              <BusinessCenter sx={{ fontSize: 16, mr: 0.5 }} />
              {job.company}
            </Typography>
          </Box>
          <Box>
            <Chip 
              size="small" 
              label={job.jobType || "Full-time"} 
              sx={{ 
                backgroundColor: jobTypeStyle.bg,
                color: jobTypeStyle.color,
                fontWeight: 'bold'
              }} 
            />
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LocationOn sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
          <Typography variant="body2" color="text.secondary">
            {job.location}
          </Typography>
        </Box>

        {job.category && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <CategoryIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
            <Chip
              size="small"
              label={job.category}
              sx={{
                backgroundColor: categoryStyle.bg,
                color: categoryStyle.color,
                fontWeight: 'medium',
                borderRadius: 10,
                height: 20,
                fontSize: '0.625rem',
                ml: 0.5
              }}
            />
          </Box>
        )}
        
        <Box sx={{ display: 'flex', gap: 2, my: 1 }}>
          {job.pay && (
            <Chip 
              size="small" 
              label={job.pay} 
              icon={<AttachMoney sx={{ fontSize: 16 }} />}
              variant="outlined"
              sx={{ borderRadius: 1 }}
            />
          )}
          {job.shiftAndSchedule && (
            <Chip 
              size="small" 
              label={job.shiftAndSchedule} 
              icon={<Schedule sx={{ fontSize: 16 }} />}
              variant="outlined"
              sx={{ borderRadius: 1 }}
            />
          )}
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
          <Tooltip title={fullDateTime} arrow placement="top">
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AccessTime sx={{ fontSize: 14, color: 'text.secondary', mr: 0.5 }} />
              <Typography variant="caption" color="text.secondary">
                {relativeTime}
              </Typography>
            </Box>
          </Tooltip>
          <KeyboardArrowRight sx={{ color: selected ? 'black' : 'text.disabled' }} />
        </Box>
      </CardContent>
    </Card>
  );
};

// Updated JobDetailCard component with fixed layout for visible job description
const JobDetailCard = ({ job, onApply, onSave }) => {
  const categoryStyle = getCategoryColor(job.category || 'Other');
  const categoryIcon = getCategoryIcon(job.category);
  const relativeTime = formatDateTime(job.postedDate);
  const fullDateTime = formatFullDateTime(job.postedDate);

  return (
    <Card sx={{ 
      p: 0, 
      borderRadius: 3, 
      boxShadow: 4,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      textAlign: 'left',
      position: 'relative', // Changed from sticky to relative for better layout
      minHeight: { md: 'calc(100vh - 400px)' }
    }}>
      <Box sx={{ 
        p: 3, 
        backgroundColor: 'black', 
        color: 'white',
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        textAlign: 'left',
        pt: 3, 
        pb: 3
      }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          {job.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar 
            sx={{ 
              width: 40, 
              height: 40, 
              backgroundColor: 'white', 
              color: 'black',
              mr: 2
            }}
          >
            {job.company ? job.company.charAt(0) : "C"}
          </Avatar>
          <Box>
            <Typography variant="h6">{job.company}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationOn sx={{ fontSize: 16, mr: 0.5 }} />
              <Typography variant="body2">{job.location}</Typography>
            </Box>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <AccessTime sx={{ fontSize: 16, mr: 0.5 }} />
            <Tooltip title={fullDateTime} arrow placement="top">
              <Typography variant="body2">
                Posted {relativeTime}
              </Typography>
            </Tooltip>
          </Box>
          
          {job.category && (
            <Box sx={{ display: 'flex', alignItems: 'center', opacity: 0.8 }}>
              {categoryIcon}
              <Chip
                size="small"
                label={job.category}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 'medium',
                  borderRadius: 2,
                  ml: 0.5
                }}
              />
            </Box>
          )}
        </Box>
      </Box>
      
      <Box sx={{ 
        p: 3, 
        flex: '1 1 auto',
        height: 'calc(100% - 170px)', // Fixed height calculation
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button
            variant="contained"
            sx={{ 
              backgroundColor: "black", 
              color: "white",
              '&:hover': {
                backgroundColor: "#333",
              },
              flex: 1,
              py: 1.5
            }}
            onClick={() => onApply && onApply(job.id)}
          >
            Apply Now
          </Button>
          <Button
            variant="outlined"
            sx={{ 
              borderColor: "black", 
              color: "black",
              '&:hover': {
                backgroundColor: "#f5f5f5",
                borderColor: "black",
              },
              py: 1.5
            }}
            startIcon={<BookmarkBorder />}
            onClick={() => onSave && onSave(job.id)}
          >
            Save
          </Button>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>Job Details</Typography>
          <Grid container spacing={2}>
            {job.pay && (
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AttachMoney sx={{ mr: 1, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Salary</Typography>
                    <Typography variant="body1">{job.pay}</Typography>
                  </Box>
                </Box>
              </Grid>
            )}
            {job.jobType && (
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <BusinessCenter sx={{ mr: 1, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Job Type</Typography>
                    <Typography variant="body1">{job.jobType}</Typography>
                  </Box>
                </Box>
              </Grid>
            )}
            {job.shiftAndSchedule && (
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Schedule sx={{ mr: 1, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Schedule</Typography>
                    <Typography variant="body1">{job.shiftAndSchedule}</Typography>
                  </Box>
                </Box>
              </Grid>
            )}
            {job.category && (
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CategoryIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Category</Typography>
                    <Typography variant="body1">{job.category}</Typography>
                  </Box>
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        {/* Job Description Section - Fixed to ensure visibility */}
        <Box sx={{ 
          flex: '1 1 auto',
          overflowY: 'auto',
          pb: 2 // Add padding at the bottom for better readability
        }}>
          <Typography variant="h6" gutterBottom>Job Description</Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'text.secondary', 
              whiteSpace: 'pre-line'
            }}
          >
            {job.description}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};

function HomePage() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || {});
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [filters, setFilters] = useState({
    title: '',
    location: ''
  });
  
  // Available categories
  const categories = [
    "All",
    "Technology",
    "Healthcare",
    "Finance",
    "Engineering",
    "Remote",
    "Education",
    "Other"
  ];

  const handleApply = async (jobPostId) => {
    if (user.userType !== 'Job Seeker') {
      setSnackbarMessage("Only Job Seekers can apply for jobs.");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          userId: user.userId,
          jobPostId: jobPostId,
        }),
      });

      const result = await response.text();

      setSnackbarMessage(result);
      setSnackbarSeverity(response.ok ? "success" : "error");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error applying for job:", error);
      setSnackbarMessage("An error occurred while applying. Please try again later.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };
  const detectCategoryInInput = (input) => {
    const lowercaseInput = input.toLowerCase();
    
    // Category keywords dictionary with variations
    const categoryKeywords = {
      "technology": ["tech", "software", "programming", "developer", "it", "computer", "web", "data", "cloud"],
      "healthcare": ["health", "medical", "nurse", "doctor", "hospital", "clinic", "patient", "care", "pharma"],
      // ... other categories and their keywords
    };
    
    // Check for direct matches or keyword matches
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (lowercaseInput === category) {
        return category.charAt(0).toUpperCase() + category.slice(1);
      }
      
      for (const keyword of keywords) {
        const regex = new RegExp(`\\b${keyword}\\b`, 'i');
        if (regex.test(lowercaseInput)) {
          return category.charAt(0).toUpperCase() + category.slice(1);
        }
      }
    }
    
    return null; // No category detected
  };
  const handleSave = async (jobPostId) => {
    if (user.userType !== 'Job Seeker') {
      setSnackbarMessage("Only Job Seekers can save jobs.");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          userId: user.userId,
          jobPostId: jobPostId,
        }),
      });

      const result = await response.text();

      setSnackbarMessage(result);
      setSnackbarSeverity(response.ok ? "success" : "error");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error saving job:", error);
      setSnackbarMessage("An error occurred while saving the job. Please try again later.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    
    setFilters((prev) => ({
      ...prev,
      [name]: value
    }));
    
    // If changing the title field, check for category keywords
    if (name === 'title') {
      const detectedCategory = detectCategoryInInput(value);
      if (detectedCategory) {
        setCategoryFilter(detectedCategory);
      } else if (categoryFilter !== 'all' && value === '') {
        // If the user clears the search and a category was selected, reset to "all"
        setCategoryFilter('all');
      }
    }
  };
  // Handle category change
  const handleCategoryChange = (e, newValue) => {
    setCategoryFilter(newValue);
  };

  // Filter jobs based on all criteria
  const filteredJobs = jobs
    .filter(job => job.status === "OPEN" || job.status === undefined) // Only show OPEN jobs
    .filter(job => {
      // Apply category filter if it's not "all"
      if (categoryFilter && categoryFilter !== "all" && categoryFilter !== "All") {
        if (!job.category || job.category.toLowerCase() !== categoryFilter.toLowerCase()) {
          return false;
        }
      }
      
      // Title/company search
      const titleMatch = job.title.toLowerCase().includes(filters.title.toLowerCase());
      const companyMatch = job.company.toLowerCase().includes(filters.title.toLowerCase());
      
      // Location search
      const locationMatch = !filters.location || 
        job.location.toLowerCase().includes(filters.location.toLowerCase());
      
      return (titleMatch || companyMatch) && locationMatch;
    });

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/api/jobs/all");
      const data = await res.json();
      
      // Set default status to "OPEN" for backward compatibility with existing jobs
      const jobsWithStatus = data.map(job => ({
        ...job,
        status: job.status || "OPEN",
        category: job.category || "Other"
      }));
      
      setJobs(jobsWithStatus);
      setLoading(false);
      
      // If we have search results, select the first job
      if (filteredJobs.length > 0) {
        setSelectedJob(filteredJobs[0]);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setSnackbarMessage("Failed to load jobs. Please try again later.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setLoading(false);
    }
  };

  const handleSearch = () => {
    // If we haven't loaded jobs yet, do it now
    if (jobs.length === 0) {
      fetchJobs();
    } else {
      // If jobs are already loaded, just filter them
      if (filteredJobs.length > 0) {
        setSelectedJob(filteredJobs[0]);
      } else {
        setSelectedJob(null);
      }
    }
    
    setHasSearched(true);
  };
  const CategoryFilterIndicator = () => {
    if (categoryFilter === 'all' || categoryFilter === 'All') {
      return null;
    }
    
    const categoryStyle = getCategoryColor(categoryFilter);
    const categoryIcon = getCategoryIcon(categoryFilter);
    
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center',
          mt: 1,
          ml: 2
        }}
      >
        <Typography variant="body2" color="text.secondary" mr={1}>
          Filtering by category:
        </Typography>
        <Chip
          size="small"
          icon={React.cloneElement(categoryIcon, { style: { fontSize: 16 } })}
          label={categoryFilter}
          onDelete={() => setCategoryFilter('all')}
          sx={{
            backgroundColor: categoryStyle.bg,
            color: categoryStyle.color,
            fontWeight: 'medium'
          }}
        />
      </Box>
    );
  };

  // Handle "Enter" key in search fields
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const SearchTips = () => {
    const [open, setOpen] = useState(false);
    
    return (
      <Box sx={{ position: 'relative', display: 'inline-block', ml: 1 }}>
        <Tooltip title="Show search tips">
          <IconButton
            size="small"
            onClick={() => setOpen(prev => !prev)}
            sx={{ color: 'text.secondary' }}
          >
            <HelpOutline fontSize="small" />
          </IconButton>
        </Tooltip>
        
        <Popper
          open={open}
          anchorEl={document.getElementById('search-tips-button')}
          placement="bottom-start"
          transition
          disablePortal
          sx={{ zIndex: 10 }}
        >
          {({ TransitionProps }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: 'top left' }}
            >
              <Paper 
                elevation={4}
                sx={{ 
                  mt: 1, 
                  p: 2,
                  maxWidth: 400,
                  borderRadius: 2
                }}
              >
                <ClickAwayListener onClickAway={() => setOpen(false)}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Search Tips
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      You can search by job title, company, or include category keywords:
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Typography variant="body2" fontWeight="medium" color="primary">Category Examples:</Typography>
                        <Typography variant="caption" component="div">
                          • "developer" → Technology<br />
                          • "nurse" → Healthcare<br />
                          • "accounting" → Finance<br />
                          • "civil engineer" → Engineering
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" fontWeight="medium" color="primary">More Examples:</Typography>
                        <Typography variant="caption" component="div">
                          • "remote developer"<br />
                          • "part-time teacher"<br />
                          • "finance manager"<br />
                          • "Google software"
                        </Typography>
                      </Grid>
                    </Grid>
                    <Box sx={{ mt: 1, textAlign: 'right' }}>
                      <Button 
                        size="small" 
                        color="primary" 
                        onClick={() => setOpen(false)}
                        sx={{ textTransform: 'none' }}
                      >
                        Got it
                      </Button>
                    </Box>
                  </Box>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Box>
    );
  };

  const userAvatar = user.profileImage || 'http://localhost:8080/uploads/default-profile.jpg';

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser({});
    navigate('/login');
  };

  return (
    <div className="homepage">
      <HomeNavbar handleLogout={handleLogout} userAvatar={userAvatar} user={user} />
      <main className="content">
        <div className="info-display-container">
          <div className="greeting" style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>
            Welcome, 
            <span
              style={{
                background: 'linear-gradient(90deg, #e0f7e9, #a0f1c3)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginLeft: '5px',
              }}
            >
              {user.name || "User"}!
            </span>
          </div>
          <div className="center-content">
            <p className="welcome-message">
              {hasSearched && filteredJobs.length > 0
                ? `Found ${filteredJobs.length} open jobs${categoryFilter !== 'all' && categoryFilter !== 'All' ? ` in ${categoryFilter}` : ''} matching your search.`
                : hasSearched && filteredJobs.length === 0
                ? "No open jobs found matching your criteria. Try a different search."
                : "Find your dream job. Start by searching below."}
            </p>
          </div>
        </div>
        
        {/* Search Panel */}
<Container maxWidth="md" sx={{ mb: 2 }}>
  <Paper
    elevation={3}
    sx={{
      display: "flex",
      flexDirection: { xs: "column", md: "row" },
      alignItems: "center",
      justifyContent: "space-between",
      borderRadius: "8px",
      position: "relative",
      overflow: "hidden",
      p: 0.5,
    }}
  >
    <Box sx={{ 
  display: "flex", 
  alignItems: "center", 
  flex: 1, 
  borderRight: { xs: "none", md: "1px solid #e0e0e0" }, 
  borderBottom: { xs: "1px solid #e0e0e0", md: "none" }, 
  p: 1 
}}>
  <StyledTextField
    fullWidth
    placeholder="Job Title, keywords, company"
    name="title"
    value={filters.title}
    onChange={handleFilterChange}
    onKeyPress={handleKeyPress}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <Search sx={{ color: "text.secondary" }} />
        </InputAdornment>
      ),
      endAdornment: (
        <InputAdornment position="end">
          <Box id="search-tips-button">
            <SearchTips />
          </Box>
        </InputAdornment>
      )
    }}
  />
</Box>

    <Box sx={{ display: "flex", alignItems: "center", flex: 1, p: 1 }}>
      <StyledTextField
        fullWidth
        placeholder='City, state, zip code, or "remote"'
        name="location"
        value={filters.location}
        onChange={handleFilterChange}
        onKeyPress={handleKeyPress}
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
      onClick={handleSearch}
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
  
  {/* Category Filter Indicator */}
  <CategoryFilterIndicator />
</Container>
        
        
        {/* Category Tabs 
        <Container maxWidth="md">
          <Box sx={{ 
            width: '100%', 
            bgcolor: 'background.paper',
            mb: 3,
            borderRadius: 2,
            boxShadow: 1
          }}>
            <Tabs
              value={categoryFilter}
              onChange={handleCategoryChange}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              textColor="primary"
              indicatorColor="primary"
              aria-label="job categories"
              sx={{ 
                '& .MuiTab-root': { 
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '0.95rem'
                }
              }}
            >
              <Tab value="all" label="All Jobs" />
              <Tab value="Technology" label="Technology" icon={<TechnologyIcon />} iconPosition="start" />
              <Tab value="Healthcare" label="Healthcare" icon={<HealthcareIcon />} iconPosition="start" />
              <Tab value="Finance" label="Finance" icon={<FinanceIcon />} iconPosition="start" />
              <Tab value="Engineering" label="Engineering" icon={<EngineeringIcon />} iconPosition="start" />
              <Tab value="Remote" label="Remote" icon={<LocationOn />} iconPosition="start" />
              <Tab value="Education" label="Education" icon={<EducationIcon />} iconPosition="start" />
            </Tabs>
          </Box>
        </Container>*/}

        {/* Updated Results Section with fixed layout */}
<Container maxWidth="xl" sx={{ pb: 4, px: { xs: 2, md: 4 } }}>
  {loading ? (
    <Grid container spacing={3} sx={{ height: { md: 'calc(100vh - 300px)' } }}>
      <Grid item xs={12} md={4}>
        {[1, 2, 3].map((i) => (
          <Card key={i} sx={{ mb: 2, p: 2, borderRadius: 2 }}>
            <Skeleton variant="text" width="70%" height={32} />
            <Skeleton variant="text" width="50%" height={24} />
            <Skeleton variant="text" width="40%" height={24} />
          </Card>
        ))}
      </Grid>
      <Grid item xs={12} md={8} sx={{ height: { md: '100%' } }}>
        <Card sx={{ p: 3, borderRadius: 3, height: '100%' }}>
          <Skeleton variant="text" width="60%" height={40} />
          <Skeleton variant="text" width="40%" height={32} />
          <Skeleton variant="rectangular" height={60} sx={{ my: 2 }} />
          <Skeleton variant="rectangular" height={200} />
        </Card>
      </Grid>
    </Grid>
  ) : hasSearched ? (
    filteredJobs.length > 0 ? (
      <Grid container spacing={3}>
        {/* Left Column: Job List */}
        <Grid item xs={12} md={4}>
          <Box sx={{ 
            mb: 2, 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <Typography variant="h6">
              {filteredJobs.length} Open {filteredJobs.length === 1 ? 'Job' : 'Jobs'} Found
              {categoryFilter !== 'all' && categoryFilter !== 'All' ? ` in ${categoryFilter}` : ''}
            </Typography>
            
            <Button 
              variant="outlined" 
              size="small"
              onClick={() => {
                setFilters({ title: '', location: '' });
                setCategoryFilter('all');
                setHasSearched(false);
              }}
              sx={{ 
                textTransform: 'none',
                borderRadius: 2,
                fontSize: '0.75rem',
                p: '4px 8px'
              }}
            >
              Clear
            </Button>
          </Box>
          
          <Box sx={{ 
            maxHeight: { md: 'calc(100vh - 300px)' }, 
            overflowY: 'auto',
            pr: { md: 2 }
          }}>
            {filteredJobs.map((job) => (
              <JobCard 
                key={job.id} 
                job={job} 
                selected={selectedJob && selectedJob.id === job.id}
                onClick={() => setSelectedJob(job)} 
              />
            ))}
          </Box>
        </Grid>

        {/* Right Column: Job Details - Fixed layout */}
        <Grid item xs={12} md={8} id="job-details-section">
          {selectedJob ? (
            <JobDetailCard 
              job={selectedJob} 
              onApply={handleApply} 
              onSave={handleSave} 
            />
          ) : (
            <Card sx={{ 
              p: 4, 
              borderRadius: 3, 
              textAlign: 'center', 
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              minHeight: { md: 'calc(100vh - 400px)' }
            }}>
              <Typography variant="h5" gutterBottom>Select a job to view details</Typography>
              <Typography variant="body1" color="text.secondary">
                Browse the job listings on the left to see detailed information.
              </Typography>
            </Card>
          )}
        </Grid>
      </Grid>
    ) : (
      // No results found
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        textAlign: 'center',
        py: 6
      }}>
        <Work sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h5" gutterBottom>No open jobs match your search</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mb: 3 }}>
          {categoryFilter !== 'all' && categoryFilter !== 'All' 
            ? `No jobs found in the ${categoryFilter} category matching your criteria.` 
            : "Try adjusting your search criteria or using more general keywords to find more opportunities."}
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => {
            setFilters({ title: '', location: '' });
            setCategoryFilter('all');
            setHasSearched(false);
          }}
          sx={{ 
            backgroundColor: "black", 
            color: "white",
            '&:hover': {
              backgroundColor: "#333",
            }
          }}
        >
          Reset Search
        </Button>
      </Box>
    )
  ) : (
    // Initial state - welcome message with illustration
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      textAlign: 'center',
      py: 8
    }}>
      <Box 
        component="img" 
        src="/job-search-illustration.svg" 
        alt="Job Search" 
        sx={{ 
          width: { xs: '80%', sm: 300 }, 
          height: 'auto', 
          mb: 4,
          display: 'none' // Hide if no image available
        }} 
      />
      <Typography variant="h4" gutterBottom>Find Your Perfect Job</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mb: 4 }}>
        Enter job titles, keywords, or locations in the search bar above to discover opportunities that match your skills and preferences.
      </Typography>
      <Grid container spacing={2} sx={{ maxWidth: '800px', mx: 'auto' }}>
        {/* All Jobs Button */}
        <Grid item xs={12} sm={3}>
          <Button 
            variant="contained" 
            onClick={handleSearch}
            fullWidth
            sx={{ 
              backgroundColor: "black", 
              color: "white",
              '&:hover': {
                backgroundColor: "#333",
              }
            }}
          >
            Browse All Jobs
          </Button>
        </Grid>
        
        {/* Category Buttons */}
        {categories.slice(1).map((category) => (
          <Grid item xs={12} sm={3} key={category}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={getCategoryIcon(category)}
              onClick={() => {
                setCategoryFilter(category);
                handleSearch();
              }}
              sx={{
                borderColor: getCategoryColor(category).color,
                color: getCategoryColor(category).color,
                '&:hover': {
                  backgroundColor: getCategoryColor(category).bg,
                  borderColor: getCategoryColor(category).color,
                }
              }}
            >
              {category} Jobs
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  )}
</Container>
      </main>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarSeverity} 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default HomePage;