import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homenav from './Homenav';


function HomePage() {
  return (
    <div><Homenav />
    <h1>HomePage</h1></div>
    
  );
}

export default HomePage;
