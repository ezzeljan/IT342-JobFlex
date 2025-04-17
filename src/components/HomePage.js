import React, { useEffect, useState } from 'react';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import HomeNavbar from './HomeNavbar';
import ServiceList from './ServiceList';

function HomePage() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || {});
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [showRolePrompt, setShowRolePrompt] = useState(false);
  const [role, setRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

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
              We're here to help you find trusted local services.
            </p>
          </div>
        </div>

        <div className="services-selection-container">
          <h2 className="find-services-message">Find services on Jobflex</h2>
          <ServiceList searchQuery={searchQuery}/>
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
      )}
    </div>
  );
}

export default HomePage;
