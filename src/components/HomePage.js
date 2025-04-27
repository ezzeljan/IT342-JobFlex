import React, { useEffect, useState } from 'react';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import HomeNavbar from './HomeNavbar';
import ServiceList from './ServiceList';
import { Grid, Card, CardContent, Typography, Button, Box } from '@mui/material';
import { TextField } from '@mui/material';


function HomePage() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || {});
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [showRolePrompt, setShowRolePrompt] = useState(false);
  const [role, setRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({
    title: '',
    company: '',
    location: ''
  });

  const handleApply = async (jobPostId) => {
    if (user.userType !== 'Job Seeker') {
      alert("Only Job Seekers can apply for jobs.");
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
  
      if (response.ok) {
        alert(result); // show success message from backend
      } else {
        alert("Error: " + result);
      }
    } catch (error) {
      console.error("Error applying for job:", error);
      alert("An error occurred while applying. Please try again later.");
    }
  };
  

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(filters.title.toLowerCase()) &&
    job.company.toLowerCase().includes(filters.company.toLowerCase()) &&
    job.location.toLowerCase().includes(filters.location.toLowerCase())
  );  

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/jobs/all");
      const data = await res.json();
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };


  useEffect(() => {
    if (!user.name) {
      setShowNamePrompt(true);
    } else if (user.userType === null) {
      setShowRolePrompt(true);
    } else {
      if (user.userType === 'Job Seeker') {
        navigate('/homepage');
      } else if (user.userType === 'Employer') {
        navigate('/providerhome');
      }
    }
  }, [user, navigate]);

  const userAvatar = user.profileImage || 'http://localhost:8080/uploads/default-profile.jpg';

  const handleSaveName = async () => {
    try {
      const response = await fetch(`http://localhost:8080/user/update-name`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.userId, name: nameInput })
      });
      if (!response.ok) {
        throw new Error("Failed to update name");
      }
      const updatedUser = { ...user, name: nameInput };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setShowNamePrompt(false);
      if (updatedUser.userType === null) {
        setShowRolePrompt(true);
      } else {
        if (updatedUser.userType === 'Job Seeker') {
          navigate('/homepage');
        } else if (updatedUser.userType === 'Employer') {
          navigate('/providerhome');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRoleSelection = (selectedRole) => {
    setRole(selectedRole);
  };

  const handleSubmitRole = async () => {
    try {
      const response = await fetch(`http://localhost:8080/user/update-role`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.userId, userType: role })
      });

      if (!response.ok) {
        throw new Error("Failed to update role");
      }

      const updatedUser = { ...user, userType: role };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setShowRolePrompt(false);

      if (role === 'Job Seeker') {
        navigate('/homepage');
      } else if (role === 'Employer') {
        navigate('/providerhome');
      }
    } catch (err) {
      console.error("Error submitting role:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser({});
    navigate('/login');
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  }

  return (
    <div className="homepage">
      <HomeNavbar handleLogout={handleLogout} handleSearch={handleSearch} userAvatar={userAvatar} user={user}/>
      <main className="content">
        <div className="info-display-container">
          <div className="greeting">Welcome, {user.name || "User"}!</div>
          <div className="center-content">
            <p className="welcome-message">
              We're here to help you find the perfect job for you.
            </p>
          </div>
        </div>

        <div className="services-selection-container">
          <h2 className="find-services-message">Find jobs on Jobflex</h2>
          
          <ServiceList searchQuery={searchQuery}/>
          <Box sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
  <TextField
    name="title"
    label="Job Title"
    value={filters.title}
    onChange={handleFilterChange}
    size="small"
  />
  <TextField
    name="company"
    label="Company"
    value={filters.company}
    onChange={handleFilterChange}
    size="small"
  />
  <TextField
    name="location"
    label="Location"
    value={filters.location}
    onChange={handleFilterChange}
    size="small"
  />
</Box>

  <Grid container spacing={3}>
    {filteredJobs.map((job) => (
      <Grid item xs={12} sm={6} md={4} key={job.id}>
        <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <CardContent>
            <Typography variant="h6">{job.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {job.company} | {job.location}
            </Typography>
            <Typography sx={{ mt: 1 }}>{job.description}</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Pay: {job.pay} | Schedule: {job.shiftAndSchedule}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button variant="contained" color="primary" onClick={() => handleApply(job.id)}>Apply</Button>
              <Button variant="outlined" color="secondary">Save</Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
  {filteredJobs.length === 0 && (
  <Typography variant="body1" sx={{ mt: 2 }}>
    No jobs found matching your criteria.
  </Typography>
)}

</Box>

        </div>
      </main>

      {/*{showNamePrompt && (
        <div className="name-prompt-modal">
          <div className="name-prompt-content">
            <h3>Enter your name</h3>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Your name"
            />
            <button onClick={handleSaveName}>Save</button>
          </div>
        </div>
      )}*/}

{/*{showRolePrompt && (
        <div className="role-prompt-modal">
          <div className="role-prompt-content">
            <h3>What brings you to Jobflex?</h3>
            <p>We want to tailor your experience so you'll feel right at home.</p>
            <div className="role-prompt-buttons">
              <button
                onClick={() => handleRoleSelection('Job Seeker')}
                className={role === 'Job Seeker' ? 'selected' : ''}
              >
                <h4>Job Seeker</h4>
                <p>You can browse and apply for job openings, from internships, work-from-home, part-time, to full-time, all at your convenience.</p>
              </button>
              <button
                onClick={() => handleRoleSelection('Employer')}
                className={role === 'Employer' ? 'selected' : ''}
              >
                <h4>Employer</h4>
                <p>You can post job hirings, manage applications, and connect with applicants.</p>
              </button>
            </div>
            {role && (
              <button className="submit-button" onClick={handleSubmitRole}>
                Submit
              </button>
            )}
          </div>
        </div>
      )}*/}
    </div>
  );
}

export default HomePage;
