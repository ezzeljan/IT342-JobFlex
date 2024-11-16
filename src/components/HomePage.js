import React, { useEffect, useState } from 'react';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import HomeNavbar from './HomeNavbar';
import ServiceForm from './ServiceForm';

function HomePage() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || {});
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [nameInput, setNameInput] = useState("");


  const navigate = useNavigate();

  useEffect(() => {
    if (!user.name) {
      setShowNamePrompt(true);
    }
  }, [user]);

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
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser({});
    navigate('/login');
  };

  

  return (
    <div className="homepage">
      <HomeNavbar handleLogout={handleLogout} />
      <main className="content">
        <div className="info-display-container">
          <div className="greeting">Welcome, {user.name || "User"}!</div>
          <div className="center-content">
            <p className="welcome-message">
              We're here to help you find trusted local services. <br /> or
            </p>
            <button className="become-provider-button">Become a Service Provider</button>
          </div>
        </div>

        <div className="services-selection-container">
          <h2 className="find-services-message">Find services on Trabahanap</h2>
          <ServiceForm/>
         
        </div>
      </main>

      {showNamePrompt && (
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
      )}
    </div>
  );
}

export default HomePage;
