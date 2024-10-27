import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Register from './components/Register';
import Login from './components/Login';
import HomePage from './components/HomePage';
import LandingPage from './components/LandingPage';

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<LandingPage/>} />
      <Route path="/login" element ={<Login/>} />
      <Route path="/register" element ={<Register/>} />
      <Route path="/homepage" element ={<HomePage/>} />
      </Routes>
    </Router>
  );
}

export default App;
