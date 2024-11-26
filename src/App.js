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
import ServiceForm from './components/ServiceForm';
import ServiceList from './components/ServiceList';
import Booking from './components/Booking';
import MyBooking from './components/MyBooking';
import BookingServiceProvider from './components/BookingServiceProvider';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/listprovider" element={<ListProviders />} />
        <Route path="/addprovider" element={<AddProvider />} />
        <Route path="/profilepage" element={<ProfilePage />} />
        <Route path="/providerhome" element={<ProviderHomepage />} />
        <Route path="/serviceform" element={<ServiceForm />} />
        <Route path="/servicelist" element={<ServiceList />} />
        <Route path="/mybooking" element={<MyBooking />} />
        <Route path="/services" element={<ServiceList />} />
        <Route path="/yourbooking" element={<BookingServiceProvider />} />
        <Route path="/booking/:serviceID" element={<Booking />} /> {/* Corrected */}
      </Routes>
    </Router>
  );
}

export default App;
