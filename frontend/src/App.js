// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import UploadForm from './components/UploadForm';
import Navbar from './components/Navbar';
import Login from './components/Login/Login';
import LandingPage from './components/LandingPage';
import { AuthClient } from '@dfinity/auth-client';
import AOS from 'aos';
import 'aos/dist/aos.css';

function App() {
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ✅ Initialize AOS and check authentication inside useEffect
  useEffect(() => {
    AOS.init({ duration: 1000 });

    const checkAuth = async () => {
      const client = await AuthClient.create();
      const result = await client.isAuthenticated();
      setIsAuthenticated(result);
      setIsAuthChecked(true);
    };

    checkAuth();

    // ✅ Re-check when window regains focus
    window.addEventListener("focus", checkAuth);
    return () => window.removeEventListener("focus", checkAuth);
  }, []);

  if (!isAuthChecked) {
    return <p>🔄 Checking authentication...</p>;
  }

  return (
    <Router>
      <Navbar isLoggedIn={isAuthenticated} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/upload"
          element={isAuthenticated ? <UploadForm /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;