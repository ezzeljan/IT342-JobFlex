import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Register from './components/Register';
import Login from './components/Login';
import HomePage from './components/HomePage';
import LandingPage from './components/LandingPage';
import ProfilePage from './components/ProfilePage';
import ProviderHomepage from './components/ProviderHomepage';
import Landing from './components/Landing';
import Home from './components/Home';
import Resume from './components/ResumeMaker';
import Profile from './components/ProfilePage';
import Employer from './components/EmployerLanding';
import EmployerDashboard from './components/Employer';
import JobPosting from './components/JobPost';
import JobApplications from './components/JobApplications';
import { UserProvider } from './components/UserContext';
import SaveJobs from './components/SavedJobsPage';
import JobApplicants from './components/JobApplicants';
import ResumeBuilder from './components/ResumeBuilder';
import ApplicantProfile from './components/ApplicantProfile';

function App() {
  return (
    <UserProvider>
    <Router>
      <Routes>
      <Route path ="/" element={<Landing/>} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/profilepage" element={<ProfilePage />} />
        <Route path="/providerhome" element={<ProviderHomepage />} />
        <Route path ="/home" element={<Home/>} />
        <Route path ="/profile" element={<Profile/>} />
        <Route path="/employer" element={<Employer />} />
        <Route path="/employerdashboard" element={<EmployerDashboard />} />
        <Route path="/jobpost" element={<JobPosting />} />
        <Route path="/resumemaker" element={<Resume />} />
        <Route path="/job-applications" element={<JobApplications />} />
        <Route path="/saved-jobs" element={<SaveJobs />} />
        <Route path="/job-applicants/:jobId" element={<JobApplicants />} />
        <Route path="/resume-builder" element={<ResumeBuilder />} />
        <Route path="/applicant-profile/:applicantId" element={<ApplicantProfile />} />
      </Routes>
    </Router>
    </UserProvider>

    
  );
}

export default App;
