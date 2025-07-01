// src/components/Navbar.js
import React, { useEffect, useState } from 'react';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { AuthClient } from '@dfinity/auth-client';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLogin = async () => {
      const client = await AuthClient.create();
      const isAuth = await client.isAuthenticated();
      setIsLoggedIn(isAuth);
    };

    checkLogin();

    // Optional: recheck when window regains focus
    window.addEventListener("focus", checkLogin);
    return () => window.removeEventListener("focus", checkLogin);
  }, []);

  const handleLogout = async () => {
    const client = await AuthClient.create();
    await client.logout();
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <h2 className="logo">🧠 DecentMonetize</h2>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/upload">Upload</Link></li>
        <li><Link to="#">My Uploads</Link></li>
      </ul>
      <div className="login-placeholder">
        {isLoggedIn ? (
          <button onClick={handleLogout} className="logout-button">Logout</button>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;