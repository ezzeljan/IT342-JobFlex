import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Box,
  TextField,
  InputAdornment,
  Paper,
  Container,
  Link as MuiLink,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  Divider,
  useTheme, 
  useMediaQuery,
  CardActions,
  IconButton,
  Tooltip,
  Tabs,
  Tab
} from "@mui/material";
import { 
  Search, 
  LocationOn, 
  BusinessCenter, 
  AttachMoney, 
  Schedule, 
  BookmarkBorder,
  Work,
  Business,
  KeyboardArrowRight,
  AccessTime,
  Category as CategoryIcon,
  School as EducationIcon,
  HealthAndSafety as HealthcareIcon,
  AccountBalance as FinanceIcon,
  Engineering as EngineeringIcon,
  Computer as TechnologyIcon,
  Storefront as RetailIcon
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

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

// Job Card Component for the left sidebar
const JobCard = ({ job, onClick, selected }) => {
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

  const jobTypeStyle = getJobTypeColor(job.jobType || 'Full-time');
  const categoryStyle = getCategoryColor(job.category || 'Other');
  const relativeTime = formatDateTime(job.postedDate);
  const fullDateTime = formatFullDateTime(job.postedDate);

  return (
    <Card
      elevation={selected ? 3 : 1}
      sx={{
        mb: 2,
        borderRadius: 3,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        borderLeft: selected ? '4px solid #2DBE5F' : 'none',
        '&:hover': {
          boxShadow: 3,
          transform: 'translateY(-2px)',
        },
        position: 'relative',
        overflow: 'hidden',
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5, fontSize: '1rem' }}>
              {job.title}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
              <BusinessCenter sx={{ fontSize: 16, mr: 0.5 }} />
              {job.company}
            </Typography>
          </Box>
          <Chip 
            size="small" 
            label={job.jobType || "Full-time"} 
            sx={{ 
              backgroundColor: jobTypeStyle.bg,
              color: jobTypeStyle.color,
              fontWeight: 'bold',
              borderRadius: 2
            }} 
          />
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LocationOn sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
          <Typography variant="body2" color="text.secondary">
            {job.location}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <CategoryIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
          <Chip
            size="small"
            label={job.category || "Other"}
            sx={{
              backgroundColor: categoryStyle.bg,
              color: categoryStyle.color,
              fontWeight: 'medium',
              borderRadius: 2,
              height: 20,
              fontSize: '0.625rem',
              ml: 0.5
            }}
          />
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1, my: 1 }}>
          {job.pay && (
            <Chip 
              size="small" 
              label={job.pay} 
              icon={<AttachMoney sx={{ fontSize: 14 }} />}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            />
          )}
          {job.shiftAndSchedule && (
            <Chip 
              size="small" 
              label={job.shiftAndSchedule} 
              icon={<Schedule sx={{ fontSize: 14 }} />}
              variant="outlined"
              sx={{ borderRadius: 2 }}
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
          <KeyboardArrowRight sx={{ color: selected ? '#2DBE5F' : 'text.disabled' }} />
        </Box>
      </CardContent>
    </Card>
  );
};

// Detailed Job Card Component for the right panel
const JobDetailCard = ({ job, onApply, onSave }) => {
  const navigate = useNavigate();
  const relativeTime = formatDateTime(job.postedDate);
  const fullDateTime = formatFullDateTime(job.postedDate);
  const categoryStyle = getCategoryColor(job.category || 'Other');
  const categoryIcon = getCategoryIcon(job.category);
  
  if (!job) return null;

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        boxShadow: 3,
        position: 'sticky',
        top: 20
      }}
    >
      <Box sx={{ 
        p: 3,
        background: 'linear-gradient(135deg, #1e2b24 0%, #000000 100%)',
        color: 'white',
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3
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
          
          <Box sx={{ display: 'flex', alignItems: 'center', opacity: 0.8 }}>
            {categoryIcon}
            <Chip
              size="small"
              label={job.category || "Other"}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 'medium',
                borderRadius: 2,
                ml: 0.5
              }}
            />
          </Box>
        </Box>
      </Box>
      
      <CardContent sx={{ p: 3, flex: 1, overflow: 'auto' }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<Work />}
            onClick={() => navigate('/login')}
            sx={{ 
              bgcolor: '#2DBE5F', 
              color: 'white', 
              mr: 1,
              textTransform: 'none',
              borderRadius: 2,
              '&:hover': { bgcolor: '#28ab56' },
              py: 1.5
            }}
          >
            Apply Now
          </Button>
          <Button
            variant="outlined"
            size="medium"
            startIcon={<BookmarkBorder />}
            onClick={() => navigate('/login')}
            sx={{ 
              color: 'black', 
              borderColor: 'black',
              textTransform: 'none',
              borderRadius: 2,
              '&:hover': { 
                bgcolor: 'rgba(0,0,0,0.04)',
                borderColor: 'black'
              },
            }}
          >
            Save Job
          </Button>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>Job Details</Typography>
          <Grid container spacing={2}>
            {job.pay && (
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AttachMoney sx={{ mr: 1, color: '#2DBE5F' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Salary</Typography>
                    <Typography variant="body1" fontWeight={500}>{job.pay}</Typography>
                  </Box>
                </Box>
              </Grid>
            )}
            {job.jobType && (
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <BusinessCenter sx={{ mr: 1, color: '#2DBE5F' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Job Type</Typography>
                    <Typography variant="body1" fontWeight={500}>{job.jobType}</Typography>
                  </Box>
                </Box>
              </Grid>
            )}
            {job.shiftAndSchedule && (
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Schedule sx={{ mr: 1, color: '#2DBE5F' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Schedule</Typography>
                    <Typography variant="body1" fontWeight={500}>{job.shiftAndSchedule}</Typography>
                  </Box>
                </Box>
              </Grid>
            )}
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CategoryIcon sx={{ mr: 1, color: '#2DBE5F' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">Category</Typography>
                  <Typography variant="body1" fontWeight={500}>{job.category || "Other"}</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>Job Description</Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'text.secondary', 
            whiteSpace: 'pre-line'
          }}
        >
          {job.description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default function Landing() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [titleQuery, setTitleQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [categoryQuery, setCategoryQuery] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  
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

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8080/api/jobs/all");
      const data = await response.json();
  
      // First filter for status
      let filtered = data.filter(job => job.status === "OPEN" || job.status === undefined);
      
      // Apply title/company filter
      if (titleQuery) {
        filtered = filtered.filter(job => 
          job.title.toLowerCase().includes(titleQuery.toLowerCase()) ||
          job.company.toLowerCase().includes(titleQuery.toLowerCase())
        );
      }
      
      // Apply location filter
      if (locationQuery) {
        filtered = filtered.filter(job =>
          job.location.toLowerCase().includes(locationQuery.toLowerCase())
        );
      }
      
      // Apply category filter if it's not "all"
      if (categoryFilter && categoryFilter !== "all" && categoryFilter !== "All") {
        filtered = filtered.filter(job => 
          job.category && job.category.toLowerCase() === categoryFilter.toLowerCase()
        );
      }
  
      setFilteredJobs(filtered);
      setHasSearched(true);
      
      // Select first result if there are any
      if (filtered.length > 0) {
        setSelectedJob(filtered[0]);
      } else {
        setSelectedJob(null);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setLoading(false);
    }
  };

  // Handle "Enter" key press in search fields
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  // Handle job selection
  const handleJobClick = (job) => {
    setSelectedJob(job);
    
    // If on mobile, scroll to the details section
    if (isMobile) {
      const detailsSection = document.getElementById('job-details-section');
      if (detailsSection) {
        detailsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
  
  // Handle category change
  const handleCategoryChange = (e, newValue) => {
    setCategoryFilter(newValue);
  };
  
  // Filter jobs by specific category 
  const handleCategoryClick = (category) => {
    setCategoryFilter(category);
    handleSearch();
  };

  return (
    <Box 
      sx={{ 
        display: "flex", 
        flexDirection: "column", 
        minHeight: "100vh",
        background: 'linear-gradient(180deg, #f5f7fa 0%, rgba(245, 247, 250, 0.8) 100%)'
      }}
    >
      <Navbar />

      {/* Hero Section */}
      <Box 
        sx={{ 
          padding: { xs: 4, md: 10 },
          paddingTop: { xs: 6, md: 12 },
          paddingBottom: { xs: 6, md: 10 },
          background: 'linear-gradient(135deg, #000000 0%, #1e2b24 100%)',
          color: 'white',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="md">
          <Typography 
            variant="h2" 
            component="h1"
            sx={{ 
              fontWeight: 800,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
              marginBottom: 2,
              position: 'relative',
              zIndex: 2
            }}
          >
            Find Your Dream Job Today
          </Typography>
          <Typography 
            variant="h6"
            sx={{ 
              fontWeight: 400,
              maxWidth: '700px',
              margin: '0 auto',
              marginBottom: 5,
              position: 'relative',
              zIndex: 2
            }}
          >
            Browse thousands of job listings and find the perfect opportunity for your career
          </Typography>
          
          {/* Search Box */}
          <Paper
            elevation={5}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              borderRadius: "12px",
              position: "relative",
              overflow: "hidden",
              zIndex: 2,
              maxWidth: '850px',
              margin: '0 auto',
              padding: 1
            }}
          >
            <Box sx={{ 
              display: "flex", 
              alignItems: "center", 
              flex: 1, 
              borderRight: { xs: "none", md: "1px solid #e0e0e0" }, 
              borderBottom: { xs: "1px solid #e0e0e0", md: "none" },
              padding: 1
            }}>
              <StyledTextField
                fullWidth
                placeholder="Job Title, keywords, company"
                value={titleQuery}
                onChange={(e) => setTitleQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box sx={{ 
              display: "flex", 
              alignItems: "center", 
              flex: 1,
              padding: 1 
            }}>
              <StyledTextField
                fullWidth
                placeholder='City, state, zip code, or "remote"'
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
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
                backgroundColor: '#2DBE5F',
                '&:hover': {
                  backgroundColor: '#28ab56'
                }
              }}
            >
              Search Jobs
            </SearchButton>
          </Paper>
        </Container>
        
        {/* Decorative elements */}
        <Box 
          sx={{ 
            position: 'absolute',
            top: '50%',
            left: '-5%',
            transform: 'translateY(-50%)',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(45,190,95,0.1) 0%, rgba(45,190,95,0) 70%)',
            zIndex: 1
          }} 
        />
        <Box 
          sx={{ 
            position: 'absolute',
            top: '10%',
            right: '-5%',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(45,190,95,0.1) 0%, rgba(45,190,95,0) 70%)',
            zIndex: 1
          }} 
        />
      </Box>

      {/* Main Content - Split View */}
      <Container maxWidth="xl" sx={{ flex: 1, mb: 6 }}>
        {hasSearched && (
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'} Found
              {categoryFilter !== 'all' && categoryFilter !== 'All' ? ` in ${categoryFilter}` : ''}
            </Typography>
            
            <Button 
              variant="outlined" 
              size="small"
              onClick={() => {
                setTitleQuery("");
                setLocationQuery("");
                setCategoryFilter("all");
                setFilteredJobs([]);
                setHasSearched(false);
                setSelectedJob(null);
              }}
              sx={{ 
                textTransform: 'none',
                borderRadius: 2,
                borderColor: '#666',
                color: '#666'
              }}
            >
              Clear Search
            </Button>
          </Box>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <Typography>Loading job results...</Typography>
          </Box>
        ) : filteredJobs.length > 0 ? (
          <Grid container spacing={3}>
            {/* Left Column - Job List */}
            <Grid item xs={12} md={5} lg={4}>
              <Box sx={{ 
                maxHeight: { md: 'calc(100vh - 300px)' }, 
                overflow: 'auto',
                pr: { md: 2 }
              }}>
                {filteredJobs.map((job) => (
                  <JobCard 
                    key={job.id} 
                    job={job} 
                    onClick={() => handleJobClick(job)}
                    selected={selectedJob && selectedJob.id === job.id}
                  />
                ))}
              </Box>
            </Grid>
            
            {/* Right Column - Job Details */}
            <Grid item xs={12} md={7} lg={8} id="job-details-section">
              {selectedJob ? (
                <JobDetailCard job={selectedJob} />
              ) : (
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '100%',
                    minHeight: { md: 'calc(100vh - 300px)' },
                    p: 4,
                    bgcolor: '#f5f5f5',
                    borderRadius: 3
                  }}
                >
                  <Typography variant="h6" color="text.secondary" align="center">
                    Select a job from the list to view details
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        ) : hasSearched ? (
          <Box 
            sx={{ 
              py: 8, 
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Work sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" gutterBottom fontWeight={600}>
              No job results found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mb: 3 }}>
              Try adjusting your search criteria or browse our featured jobs below.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            py: 10,
            textAlign: 'center'
          }}>
            <Box>
              <Work sx={{ fontSize: 80, color: 'rgba(0,0,0,0.1)', mb: 3 }} />
              <Typography variant="h5" gutterBottom fontWeight={600}>
                Start your job search
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mb: 4 }}>
                Enter keywords, job titles or locations in the search bar above to find your next opportunity
              </Typography>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}