import React from 'react';
import { Link } from 'react-router-dom';



const LandingPage = () => {
  return (
    <div>
      <header className="header">
        <div className="logo">JobFlex</div>
        <nav>
          {/* Use Link instead of <a> for routing */}
          <Link to="/login">Login</Link>
          <Link to="/register">Sign Up</Link>
        </nav>
      </header>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Poppins', sans-serif;
        }

        body {
          background-color: #f3f3f3;
          color: #333;
          line-height: 1.6;
        }

        .header {
          background-color: #000;
          color: #fff;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .logo {
          font-size: 1.8rem;
          font-weight: bold;
          color: #22c55e;
        }

        nav a {
          color: #fff;
          text-decoration: none;
          margin-right: 1.5rem;
          font-size: 1rem;
          transition: color 0.3s ease;
        }

        nav a:hover {
          color: #22c55e;
        }

        nav button {
          background-color: #22c55e;
          color: #fff;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1rem;
          transition: background-color 0.3s ease;
          margin-left: 0.5rem;
        }

        nav button:hover {
          background-color: #16a34a;
        }

        .search-bar {
          background-color: #fff;
          padding: 1.5rem 2rem;
          display: flex;
          justify-content: center;
          gap: 1rem;
          box-shadow: 0 4px 6px rgba(85, 105, 78, 0.1);
          margin: 2rem auto;
          border-radius: 10px;
          max-width: 900px;
        }

        .search-bar input {
          padding: 0.8rem;
          width: 300px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 1rem;
        }

        .search-bar button {
          background-color: #22c55e;
          color: #fff;
          border: none;
          padding: 0.8rem 1.5rem;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1rem;
          transition: background-color 0.3s ease;
        }

        .search-bar button:hover {
          background-color: #16a34a;
        }

        .job-listing {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .job-card {
          background-color: #fff;
          border: 1px solid #ddd;
          border-radius: 10px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .job-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
        }

        .job-card h3 {
          font-size: 1.4rem;
          margin-bottom: 0.5rem;
          color: #000;
        }

        .job-card p {
          margin-bottom: 0.5rem;
          color: #555;
        }

        .job-card button {
          background-color: #22c55e;
          color: #fff;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1rem;
          transition: background-color 0.3s ease;
        }

        .job-card button:hover {
          background-color: #16a34a;
        }

        .job-details {
          background-color: #fff;
          padding: 2rem;
          margin: 2rem auto;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          max-width: 900px;
        }

        .job-details h2 {
          font-size: 1.8rem;
          margin-bottom: 1rem;
          color: #000;
        }

        .job-details p {
          margin-bottom: 0.5rem;
          color: #555;
        }

        .job-details button {
          background-color: #22c55e;
          color: #fff;
          border: none;
          padding: 0.8rem 1.5rem;
          border-radius: 5px;
          cursor: pointer;
          margin-top: 1rem;
          font-size: 1rem;
          transition: background-color 0.3s ease;
        }

        .job-details button:hover {
          background-color: #16a34a;
        }

        .job-details ul {
          margin-top: 1rem;
          padding-left: 1.5rem;
        }

        .job-details ul li {
          margin-bottom: 0.5rem;
          color: #555;
        }

        @media (max-width: 768px) {
          .search-bar {
            flex-direction: column;
            gap: 0.5rem;
          }

          .search-bar input {
            width: 100%;
          }

          .job-listing {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <header className="header">
        <div className="logo">JobFlex</div>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/build-resume">Build Resume</Link>
          <Link to="/login">
            <button className="login-btn">Login</button>
          </Link>
          <Link to="/signup">
            <button className="signup-btn">Sign Up</button>
          </Link>
        </nav>
      </header>

      <section className="search-bar">
        <input type="text" placeholder="Job title, skill, or company" />
        <input type="text" placeholder="City, state, or remote" />
        <button>Search</button>
      </section>

      <section className="job-listing">
        <div className="job-card">
          <h3>IT Content Writer - Fresh Graduates</h3>
          <p>Company: XYZ Tech</p>
          <p>Location: Remote</p>
          <button>View Details</button>
        </div>
        <div className="job-card">
          <h3>IT Content Writer - Fresh Graduates</h3>
          <p>Company: XYZ Tech</p>
          <p>Location: Remote</p>
          <button>View Details</button>
        </div>
      </section>

      <section className="job-details">
        <h2>IT Content Writer - Fresh Graduates</h2>
        <p><strong>Company:</strong> XYZ Tech</p>
        <p><strong>Location:</strong> Remote</p>
        <p><strong>Salary:</strong> Negotiable</p>
        <p><strong>Job Type:</strong> Full-time</p>
        <button>Apply Now</button>

        <h3>Job Description</h3>
        <ul>
          <li>Write and edit content for websites.</li>
          <li>Conduct research and follow industry trends.</li>
          <li>Collaborate with developers and designers.</li>
        </ul>
      </section>
    </div>
  );
};

export default LandingPage;
