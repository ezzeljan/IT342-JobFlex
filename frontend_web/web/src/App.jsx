import React from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from './components/login-register/Register';
import Login from './components/login-register/Login';
import LandingPage from './components/login-register/LandingPage'; // Correct import
import HomeSeeker from './components/login-register/HomeSeeker';
import ResumeMaker from './components/login-register/ResumeMaker';
import PostJob from './components/login-register/PostJob';
import JobPosting from './components/login-register/JobPosting';
import NavBar from './components/login-register/NavBar';

function App() {
  return (
    
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/landingpage" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/homeseeker" element={<HomeSeeker />} />
        <Route path="/resumemaker" element={<ResumeMaker />} />
        <Route path="/postjob" element={<PostJob />} />
        <Route path="/jobposting" element={<JobPosting />} />
        <Route path="/navbar" element={<NavBar />} />
      </Routes>
    
  );
}

export default App;
