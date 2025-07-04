// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import UploadForm from './components/UploadForm';
import Navbar from './components/Navbar';
import Login from './components/Login/Login';
import LandingPage from './components/LandingPage';
import { AuthClient } from '@dfinity/auth-client';
import { initActor } from './services/canisterService';
import AOS from 'aos';
import 'aos/dist/aos.css';

function App() {
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isActorInitialized, setIsActorInitialized] = useState(false);

  // ✅ Initialize AOS, check authentication, and initialize actor inside useEffect
  useEffect(() => {
    AOS.init({ duration: 1000 });

    const initApp = async () => {
      try {
        console.log('🚀 Starting app initialization...');
        console.log('Environment variables:');
        console.log('REACT_APP_BACKEND_CANISTER_ID:', process.env.REACT_APP_BACKEND_CANISTER_ID);
        console.log('REACT_APP_DFX_NETWORK:', process.env.REACT_APP_DFX_NETWORK);
        console.log('NODE_ENV:', process.env.NODE_ENV);
        
        // Initialize actor first
        await initActor();
        setIsActorInitialized(true);
        console.log('✅ Actor initialized successfully');
        
        // Then check authentication
        const client = await AuthClient.create();
        const result = await client.isAuthenticated();
        setIsAuthenticated(result);
        setIsAuthChecked(true);
        console.log('✅ Authentication check completed');
      } catch (error) {
        console.error('❌ Failed to initialize app:', error);
        setIsAuthChecked(true); // Still allow app to continue
      }
    };

    initApp();

    // ✅ Re-check when window regains focus
    const checkAuth = async () => {
      try {
        const client = await AuthClient.create();
        const result = await client.isAuthenticated();
        setIsAuthenticated(result);
      } catch (error) {
        console.error('Failed to check auth:', error);
      }
    };

    window.addEventListener("focus", checkAuth);
    return () => window.removeEventListener("focus", checkAuth);
  }, []);

  if (!isAuthChecked || !isActorInitialized) {
    return <p>🔄 Initializing application...</p>;
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