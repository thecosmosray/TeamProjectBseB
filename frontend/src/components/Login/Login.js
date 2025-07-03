// src/components/Login/Login.js
import React, { useEffect, useState } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [authClient, setAuthClient] = useState(null);
  const navigate = useNavigate();

  // Get the frontend canister ID
  const FRONTEND_CANISTER_ID = process.env.REACT_APP_FRONTEND_CANISTER_ID || 'bd3sg-teaaa-aaaaa-qaaba-cai';
  const IS_LOCAL = process.env.NODE_ENV !== 'production';
  
  // Internet Identity canister ID for local development
  const II_CANISTER_ID = 'rdmx6-jaaaa-aaaaa-aaadq-cai';

  useEffect(() => {
    AuthClient.create().then(async (client) => {
      setAuthClient(client);
      const isAuthenticated = await client.isAuthenticated();
      if (isAuthenticated) {
        navigate('/upload');
      }
    });
  }, [navigate]);

  const handleLogin = async () => {
    if (!authClient) return;

    try {
      const identityProvider = 'https://identity.ic0.app';


      const derivationOrigin = IS_LOCAL 
        ? `http://127.0.0.1:4943/?canisterId=${FRONTEND_CANISTER_ID}`
        : `https://${FRONTEND_CANISTER_ID}.ic0.app`;

      console.log('🔐 Starting login with:', {
        identityProvider,
        derivationOrigin,
        frontendCanisterId: FRONTEND_CANISTER_ID
      });

      await authClient.login({
        identityProvider,
        derivationOrigin,
        windowOpenerFeatures: 'toolbar=0,location=0,menubar=0,width=500,height=600,left=100,top=100',
        onSuccess: async () => {
          console.log('✅ Login successful! Redirecting to upload page...');
          // Use React Router navigation instead of window.location
          navigate('/upload', { replace: true });
        },
        onError: (err) => {
          console.error('❌ Login error:', err);
          alert('❌ Login failed: ' + (err.message || 'Unknown error'));
        }
      });
    } catch (error) {
      console.error('❌ Login process failed:', error);
      alert('❌ Login process failed: ' + (error.message || 'Please try again.'));
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h1>🔐 Login with Internet Identity</h1>
        <p>
          We use <strong>Internet Identity</strong> — a privacy-preserving way to log in using your device.
        </p>
        <div className="instructions">
          <p><strong>New user?</strong> Here's how to get started:</p>
          <ol>
            <li>Click the login button below.</li>
            <li>Select <strong>"Create Identity Anchor"</strong> (if you don't have one).</li>
            <li>Follow the steps and return here.</li>
          </ol>
        </div>
        <button onClick={handleLogin} className="login-button">
          🚪 Login with Internet Identity
        </button>
        
        {/* Debug info for development */}
        {IS_LOCAL && (
          <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
            <p><strong>Debug Info:</strong></p>
            <p>Frontend Canister: {FRONTEND_CANISTER_ID}</p>
            <p>Environment: {process.env.NODE_ENV}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;