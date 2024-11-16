import React, { useEffect, useState } from 'react';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import HomeNavbar from './HomeNavbar';
import ServiceForm from './ServiceForm';

function HomePage() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || {});
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [showRolePrompt, setShowRolePrompt] = useState(false);
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in, and handle prompts accordingly
    if (!user.name) {
      setShowNamePrompt(true);
    } else if (user.userType === null) {
      setShowRolePrompt(true); // Show role prompt if userType is null
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
      // If user has no role, show role prompt
      if (updatedUser.userType === null) {
        setShowRolePrompt(true);
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
      setShowRolePrompt(false); // Close role prompt after submission
    } catch (err) {
      console.error("Error submitting role:", err);
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
              We're here to help you find trusted local services.
            </p>
            
          </div>
        </div>

        <div className="services-selection-container">
          <h2 className="find-services-message">Find services on Trabahanap</h2>
          <ServiceForm />
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

      {showRolePrompt && (
        <div className="role-prompt-modal">
          <div className="role-prompt-content">
            <h3>What brings you to Trabahanap?</h3>
            <p>We want to tailor your experience so you'll feel right at home.</p>
            <div className="role-prompt-buttons">
              <button
                onClick={() => handleRoleSelection('Customer')}
                className={role === 'Customer' ? 'selected' : ''}
              >
                <h4>Seeker</h4>
                <p>You can browse and book local services in your area, from home repairs to personal assistance, all at your convenience.</p>
              </button>
              <button
                onClick={() => handleRoleSelection('Service Provider')}
                className={role === 'Service Provider' ? 'selected' : ''}
              >
                <h4>Provider</h4>
                <p>You can offer your local expertise, manage bookings, and connect with customers in your community seeking your services.</p>
              </button>
            </div>
            {role && (
              <button className="submit-button" onClick={handleSubmitRole}>
                Submit
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
