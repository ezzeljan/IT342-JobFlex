import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Divider,
  IconButton,
  InputAdornment,
  Chip,
  Alert,
  Snackbar,
  Card,
  CardContent
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import LanguageIcon from '@mui/icons-material/Language';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import PreviewIcon from '@mui/icons-material/Preview';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import BuildIcon from '@mui/icons-material/Build';
import HomeNavbar from './HomeNavbar';

// Steps for the resume builder process
const steps = ['Personal Info', 'Professional Summary', 'Skills', 'Education', 'Experience', 'Additional Info'];

function ResumeBuilder() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [user, setUser] = useState({});
  const [skill, setSkill] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasExistingResume, setHasExistingResume] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Resume data state
  const [resumeData, setResumeData] = useState({
    summary: '',
    skills: [],
    education: [{ school: '', degree: '', fieldOfStudy: '', from: '', to: '', description: '' }],
    experience: [{ company: '', position: '', from: '', to: '', description: '' }],
    certifications: '',
    languages: '',
    portfolioUrl: '',
    linkedinUrl: '',
    githubUrl: '',
    additionalInfo: ''
  });

  useEffect(() => {
    // Load user data from localStorage
    const storedUser = JSON.parse(localStorage.getItem('user')) || {};
    setUser(storedUser);
    
    // Fetch existing resume if available
    if (storedUser.userId) {
      fetchResume(storedUser.userId);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchResume = async (userId) => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8080/api/resume/${userId}`);
      if (response.ok) {
        const data = await response.json();
        
        // Transform string skills into array if needed
        let skills = data.skills;
        if (typeof skills === 'string') {
          skills = skills.split(',').map(skill => skill.trim()).filter(Boolean);
        } else if (!Array.isArray(skills)) {
          skills = [];
        }
        
        // Parse JSON strings if needed
        let education = data.education;
        if (typeof education === 'string') {
          try {
            education = JSON.parse(education);
          } catch (e) {
            education = [{ school: '', degree: '', fieldOfStudy: '', from: '', to: '', description: '' }];
          }
        }
        
        let experience = data.experience;
        if (typeof experience === 'string') {
          try {
            experience = JSON.parse(experience);
          } catch (e) {
            experience = [{ company: '', position: '', from: '', to: '', description: '' }];
          }
        }
        
        setResumeData({
          ...data,
          skills,
          education,
          experience
        });
        
        setHasExistingResume(true);
      }
    } catch (error) {
      console.error('Error fetching resume:', error);
      setHasExistingResume(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnterEditMode = (startAtStep = 0) => {
    setIsEditMode(true);
    setActiveStep(startAtStep);
  };

  const handleExitEditMode = () => {
    setIsEditMode(false);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setResumeData({ ...resumeData, [name]: value });
  };

  const handleAddSkill = () => {
    if (skill.trim() && !resumeData.skills.includes(skill.trim())) {
      setResumeData({
        ...resumeData,
        skills: [...resumeData.skills, skill.trim()]
      });
      setSkill('');
    }
  };

  const handleDeleteSkill = (skillToDelete) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.filter(s => s !== skillToDelete)
    });
  };

  const handleEducationChange = (index, e) => {
    const { name, value } = e.target;
    const newEducation = [...resumeData.education];
    newEducation[index] = { ...newEducation[index], [name]: value };
    setResumeData({ ...resumeData, education: newEducation });
  };

  const handleAddEducation = () => {
    setResumeData({
      ...resumeData,
      education: [...resumeData.education, { school: '', degree: '', fieldOfStudy: '', from: '', to: '', description: '' }]
    });
  };

  const handleRemoveEducation = (index) => {
    const newEducation = [...resumeData.education];
    newEducation.splice(index, 1);
    setResumeData({ ...resumeData, education: newEducation });
  };

  const handleExperienceChange = (index, e) => {
    const { name, value } = e.target;
    const newExperience = [...resumeData.experience];
    newExperience[index] = { ...newExperience[index], [name]: value };
    setResumeData({ ...resumeData, experience: newExperience });
  };

  const handleAddExperience = () => {
    setResumeData({
      ...resumeData,
      experience: [...resumeData.experience, { company: '', position: '', from: '', to: '', description: '' }]
    });
  };

  const handleRemoveExperience = (index) => {
    const newExperience = [...resumeData.experience];
    newExperience.splice(index, 1);
    setResumeData({ ...resumeData, experience: newExperience });
  };

  const handleSaveResume = async () => {
    try {
      // Prepare data for API
      const dataToSend = {
        ...resumeData,
        // Convert arrays to strings or JSON as needed
        skills: resumeData.skills.join(', '),
        education: JSON.stringify(resumeData.education),
        experience: JSON.stringify(resumeData.experience)
      };
      
      const response = await fetch(`http://localhost:8080/api/resume/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.userId,
          ...dataToSend
        }),
      });
      
      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'Resume saved successfully!',
          severity: 'success'
        });
        setIsEditMode(false);
        setHasExistingResume(true);
      } else {
        throw new Error('Failed to save resume');
      }
    } catch (error) {
      console.error('Error saving resume:', error);
      setSnackbar({
        open: true,
        message: 'Error saving resume. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  const handleDownloadPDF = () => {
    // This would be implemented with a PDF generation library
    setSnackbar({
      open: true,
      message: 'PDF download feature coming soon!',
      severity: 'info'
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Render form sections based on active step
  const getStepContent = (step) => {
    switch (step) {
      case 0: // Personal Info
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                This information is from your profile
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography><strong>Name:</strong> {user.name}</Typography>
                <Typography><strong>Email:</strong> {user.email}</Typography>
                <Typography><strong>Phone:</strong> {user.phone || 'Not provided'}</Typography>
                <Typography><strong>Address:</strong> {user.address || 'Not provided'}</Typography>
              </Paper>
              <Alert severity="info">
                You can update your personal information in your profile settings.
              </Alert>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Portfolio URL"
                name="portfolioUrl"
                value={resumeData.portfolioUrl || ''}
                onChange={handleInputChange}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LanguageIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="LinkedIn URL"
                name="linkedinUrl"
                value={resumeData.linkedinUrl || ''}
                onChange={handleInputChange}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LinkedInIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="GitHub URL"
                name="githubUrl"
                value={resumeData.githubUrl || ''}
                onChange={handleInputChange}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <GitHubIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        );
      case 1: // Professional Summary
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body1" gutterBottom>
                Write a concise summary of your professional background, skills, and career goals.
              </Typography>
              <TextField
                name="summary"
                label="Professional Summary"
                multiline
                rows={6}
                value={resumeData.summary || ''}
                onChange={handleInputChange}
                fullWidth
                placeholder="Experienced software developer with a focus on web technologies and a passion for creating user-friendly applications..."
              />
            </Grid>
          </Grid>
        );
      case 2: // Skills
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body1" gutterBottom>
                Add your key skills and competencies. These should be relevant to the positions you're applying for.
              </Typography>
              <Box sx={{ display: 'flex', mb: 2 }}>
                <TextField
                  label="Skill"
                  value={skill}
                  onChange={(e) => setSkill(e.target.value)}
                  fullWidth
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                  placeholder="e.g., JavaScript, Project Management, Customer Service"
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddSkill}
                  sx={{ ml: 1 }}
                >
                  Add
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {resumeData.skills.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    onDelete={() => handleDeleteSkill(skill)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        );
      case 3: // Education
        return (
          <Box>
            <Typography variant="body1" gutterBottom>
              Add your educational background, starting with the most recent.
            </Typography>
            {resumeData.education.map((edu, index) => (
              <Paper key={index} elevation={0} variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="subtitle1">Education #{index + 1}</Typography>
                  {resumeData.education.length > 1 && (
                    <IconButton size="small" onClick={() => handleRemoveEducation(index)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      name="school"
                      label="School/University"
                      value={edu.school || ''}
                      onChange={(e) => handleEducationChange(index, e)}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      name="degree"
                      label="Degree"
                      value={edu.degree || ''}
                      onChange={(e) => handleEducationChange(index, e)}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      name="fieldOfStudy"
                      label="Field of Study"
                      value={edu.fieldOfStudy || ''}
                      onChange={(e) => handleEducationChange(index, e)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <TextField
                      name="from"
                      label="From (Year)"
                      value={edu.from || ''}
                      onChange={(e) => handleEducationChange(index, e)}
                      fullWidth
                      required
                      placeholder="e.g., 2018"
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <TextField
                      name="to"
                      label="To (Year)"
                      value={edu.to || ''}
                      onChange={(e) => handleEducationChange(index, e)}
                      fullWidth
                      required
                      placeholder="e.g., 2022 or Present"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="description"
                      label="Description"
                      value={edu.description || ''}
                      onChange={(e) => handleEducationChange(index, e)}
                      fullWidth
                      multiline
                      rows={2}
                      placeholder="Notable achievements, GPA, coursework, etc."
                    />
                  </Grid>
                </Grid>
              </Paper>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={handleAddEducation}
              variant="outlined"
              fullWidth
            >
              Add Another Education
            </Button>
          </Box>
        );
      case 4: // Experience
        return (
          <Box>
            <Typography variant="body1" gutterBottom>
              Add your work experience, starting with the most recent.
            </Typography>
            {resumeData.experience.map((exp, index) => (
              <Paper key={index} elevation={0} variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="subtitle1">Experience #{index + 1}</Typography>
                  {resumeData.experience.length > 1 && (
                    <IconButton size="small" onClick={() => handleRemoveExperience(index)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      name="company"
                      label="Company"
                      value={exp.company || ''}
                      onChange={(e) => handleExperienceChange(index, e)}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      name="position"
                      label="Position"
                      value={exp.position || ''}
                      onChange={(e) => handleExperienceChange(index, e)}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <TextField
                      name="from"
                      label="From (Month/Year)"
                      value={exp.from || ''}
                      onChange={(e) => handleExperienceChange(index, e)}
                      fullWidth
                      required
                      placeholder="e.g., Jan 2020"
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <TextField
                      name="to"
                      label="To (Month/Year)"
                      value={exp.to || ''}
                      onChange={(e) => handleExperienceChange(index, e)}
                      fullWidth
                      required
                      placeholder="e.g., Dec 2022 or Present"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="description"
                      label="Description"
                      value={exp.description || ''}
                      onChange={(e) => handleExperienceChange(index, e)}
                      fullWidth
                      multiline
                      rows={4}
                      placeholder="Describe your responsibilities, achievements, and any notable projects."
                    />
                  </Grid>
                </Grid>
              </Paper>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={handleAddExperience}
              variant="outlined"
              fullWidth
            >
              Add Another Experience
            </Button>
          </Box>
        );
      case 5: // Additional Info
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="body1" gutterBottom>
                Add any certifications you've earned.
              </Typography>
              <TextField
                name="certifications"
                label="Certifications"
                value={resumeData.certifications || ''}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={3}
                placeholder="e.g., AWS Certified Solutions Architect, Google Analytics Certification"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" gutterBottom>
                List languages you speak and your proficiency level.
              </Typography>
              <TextField
                name="languages"
                label="Languages"
                value={resumeData.languages || ''}
                onChange={handleInputChange}
                fullWidth
                placeholder="e.g., English (Native), Spanish (Intermediate), French (Basic)"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" gutterBottom>
                Add any additional information you'd like employers to know.
              </Typography>
              <TextField
                name="additionalInfo"
                label="Additional Information"
                value={resumeData.additionalInfo || ''}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={4}
                placeholder="Hobbies, volunteer work, achievements, or other relevant information"
              />
            </Grid>
          </Grid>
        );
      default:
        return 'Unknown step';
    }
  };

  // Resume preview component
  const ResumePreview = () => (
    <Paper elevation={1} sx={{ p: 4, maxWidth: 900, mx: 'auto' }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>{user.name || "Your Name"}</Typography>
        <Typography variant="body1">
          {user.phone && `${user.phone} • `}
          {user.email || "your.email@example.com"}
          {user.address && ` • ${user.address}`}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 1 }}>
          {resumeData.portfolioUrl && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LanguageIcon fontSize="small" sx={{ mr: 0.5 }} />
              <Typography variant="body2">
                <a
                  href={resumeData.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  {resumeData.portfolioUrl}
                </a>
              </Typography>
            </Box>
          )}
          {resumeData.linkedinUrl && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LinkedInIcon fontSize="small" sx={{ mr: 0.5 }} />
              <Typography variant="body2">
                <a
                  href={resumeData.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  {resumeData.linkedinUrl}
                </a>
              </Typography>
            </Box>
          )}
          {resumeData.githubUrl && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <GitHubIcon fontSize="small" sx={{ mr: 0.5 }} />
              <Typography variant="body2">
                <a
                  href={resumeData.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  {resumeData.githubUrl}
                </a>
              </Typography>
            </Box>
          )}
        </Box>

      </Box>

      {resumeData.summary ? (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ borderBottom: '1px solid #ddd', pb: 1 }}>
            Professional Summary
          </Typography>
          <Typography variant="body1">{resumeData.summary}</Typography>
        </Box>
      ) : hasExistingResume ? null : (
        <Box sx={{ mb: 3, textAlign: 'center', p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
          <Typography color="text.secondary">Add a professional summary to highlight your experience and goals</Typography>
        </Box>
      )}

      {resumeData.skills && resumeData.skills.length > 0 ? (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ borderBottom: '1px solid #ddd', pb: 1 }}>
            Skills
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {resumeData.skills.map((skill, index) => (
              <Chip key={index} label={skill} size="small" />
            ))}
          </Box>
        </Box>
      ) : hasExistingResume ? null : (
        <Box sx={{ mb: 3, textAlign: 'center', p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
          <Typography color="text.secondary">Add your skills to showcase your expertise</Typography>
        </Box>
      )}

      {resumeData.experience && resumeData.experience.length > 0 && resumeData.experience[0].company ? (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ borderBottom: '1px solid #ddd', pb: 1 }}>
            Experience
          </Typography>
          {resumeData.experience.map((exp, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">{exp.position}</Typography>
              <Typography variant="subtitle2">{exp.company} | {exp.from} - {exp.to}</Typography>
              <Typography variant="body2" paragraph>{exp.description}</Typography>
            </Box>
          ))}
        </Box>
      ) : hasExistingResume ? null : (
        <Box sx={{ mb: 3, textAlign: 'center', p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
          <Typography color="text.secondary">Add your work experience to show your career history</Typography>
        </Box>
      )}

      {resumeData.education && resumeData.education.length > 0 && resumeData.education[0].school ? (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ borderBottom: '1px solid #ddd', pb: 1 }}>
            Education
          </Typography>
          {resumeData.education.map((edu, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">{edu.degree}{edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}</Typography>
              <Typography variant="subtitle2">{edu.school} | {edu.from} - {edu.to}</Typography>
              {edu.description && <Typography variant="body2">{edu.description}</Typography>}
            </Box>
          ))}
        </Box>
      ) : hasExistingResume ? null : (
        <Box sx={{ mb: 3, textAlign: 'center', p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
          <Typography color="text.secondary">Add your education to highlight your academic achievements</Typography>
        </Box>
      )}

      {(resumeData.certifications || resumeData.languages) ? (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ borderBottom: '1px solid #ddd', pb: 1 }}>
            Certifications & Languages
          </Typography>
          {resumeData.certifications && (
            <Box sx={{ mb: 1 }}>
              <Typography variant="subtitle2" fontWeight="bold">Certifications:</Typography>
              <Typography variant="body2">{resumeData.certifications}</Typography>
            </Box>
          )}
          {resumeData.languages && (
            <Box>
              <Typography variant="subtitle2" fontWeight="bold">Languages:</Typography>
              <Typography variant="body2">{resumeData.languages}</Typography>
            </Box>
          )}
        </Box>
      ) : hasExistingResume ? null : (
        <Box sx={{ mb: 3, textAlign: 'center', p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
          <Typography color="text.secondary">Add certifications and languages to stand out from other candidates</Typography>
        </Box>
      )}

      {resumeData.additionalInfo ? (
        <Box>
          <Typography variant="h6" gutterBottom sx={{ borderBottom: '1px solid #ddd', pb: 1 }}>
            Additional Information
          </Typography>
          <Typography variant="body2">{resumeData.additionalInfo}</Typography>
        </Box>
      ) : null}

      {!hasExistingResume && (
        <Box sx={{ mt: 3, p: 3, border: '1px dashed #ccc', borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>Create Your Resume</Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Get started by clicking the "Build Resume" button to create your professional resume.
          </Typography>
        </Box>
      )}
    </Paper>
  );

  // Welcome component for new users
  const WelcomeView = () => (
    <Box sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>Resume Builder</Typography>
      <Typography variant="body1" paragraph>
        Create a professional resume that highlights your skills and experience.
        Our step-by-step process makes it easy to build an impressive resume.
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<EditIcon />}
          onClick={() => handleEnterEditMode(0)}
          sx={{ mx: 1 }}
        >
          Build Your Resume
        </Button>
      </Box>
    </Box>
  );

  // Loading component
  const LoadingView = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
      <Typography variant="h6" gutterBottom>Loading your resume...</Typography>
      <Box sx={{ width: '100%', maxWidth: 400 }}>
        {[1, 2, 3].map((i) => (
          <Paper key={i} sx={{ p: 2, mb: 2, bgcolor: '#f5f5f5' }}>
            <Box sx={{ height: 20, width: '60%', bgcolor: '#e0e0e0', borderRadius: 1, mb: 1 }} />
            <Box sx={{ height: 15, width: '80%', bgcolor: '#e0e0e0', borderRadius: 1 }} />
          </Paper>
        ))}
      </Box>
    </Box>
  );


  return (
    <>
      <HomeNavbar handleLogout={handleLogout} />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Paper elevation={2} sx={{ p: 3 }}>
          {isLoading ? (
            <LoadingView />
          ) : isEditMode ? (
            // Edit Mode
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Edit Resume</Typography>
                <Box>
                  <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={handleExitEditMode}
                    sx={{ mr: 1 }}
                  >
                    Back to Preview
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveResume}
                  >
                    Save Resume
                  </Button>
                </Box>
              </Box>

              <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              <Box sx={{ mt: 2, mb: 4 }}>
                {getStepContent(activeStep)}
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  variant="outlined"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                >
                  Back
                </Button>
                {activeStep === steps.length - 1 ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveResume}
                    startIcon={<SaveIcon />}
                  >
                    Save Resume
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </>
          ) : (
            // Preview Mode
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Your Resume</Typography>
                <Box>
                  {hasExistingResume ? (
                    <>
                      <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        onClick={handleDownloadPDF}
                        sx={{ mr: 1 }}
                      >
                        Download PDF
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<EditIcon />}
                        onClick={() => handleEnterEditMode(0)}
                      >
                        Edit Resume
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<EditIcon />}
                      onClick={() => handleEnterEditMode(0)}
                    >
                      Build Resume
                    </Button>
                  )}
                </Box>
              </Box>
              
              {hasExistingResume ? (
                // Show resume preview if it exists
                <Box>
                  <ResumePreview />
                </Box>
              ) : (
                // Show welcome message if no resume exists
                <WelcomeView />
              )}
            </>
          )}
        </Paper>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default ResumeBuilder;