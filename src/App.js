import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Register from './components/Register';
import Login from './components/Login';
import HomePage from './components/HomePage';
import LandingPage from './components/LandingPage';
import ListProviders from './components/ListProviders';
import AddProvider from './components/AddProvider';
import ProfilePage from './components/ProfilePage';
import ProviderHomepage from './components/ProviderHomepage';

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<LandingPage/>} />
      <Route path="/login" element ={<Login/>} />
      <Route path="/register" element ={<Register/>} />
      <Route path="/homepage" element ={<HomePage/>} />
      <Route path="/listprovider" element ={<ListProviders/>} />
      <Route path="/addprovider" element ={<AddProvider/>} />
      <Route path="/profilepage" element ={<ProfilePage/>} />
      <Route path="/provider" element ={<ProviderHomepage/>} />
      </Routes>
    </Router>
  );
}

export default App;
