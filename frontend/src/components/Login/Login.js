// src/components/Login/Login.js
import React, { useEffect, useState } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [authClient, setAuthClient] = useState(null);
  const navigate = useNavigate();

  const FRONTEND_CANISTER_ID = process.env.REACT_APP_FRONTEND_CANISTER_ID || 'bd3sg-teaaa-aaaaa-qaaba-cai';
  const IS_LOCAL = process.env.NODE_ENV !== 'production';

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

    await authClient.login({
      identityProvider: IS_LOCAL
        ? `http://127.0.0.1:4943/?canisterId=${FRONTEND_CANISTER_ID}`
        : `https://identity.ic0.app/#authorize?canisterId=${FRONTEND_CANISTER_ID}`,
      derivationOrigin: IS_LOCAL
        ? 'http://127.0.0.1:4943'
        : `https://${FRONTEND_CANISTER_ID}.ic0.app`,
      windowOpenerFeatures: 'toolbar=0,location=0,menubar=0,width=500,height=500,left=100,top=100',
      onSuccess: async () => {
        window.location.href = '/upload'; // Hard redirect ensures App.js rechecks auth
      },
      onError: (err) => {
        alert('❌ Login failed.');
        console.error(err);
      }
    });
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
            <li>Select <strong>"Create Identity Anchor"</strong> (if you don’t have one).</li>
            <li>Follow the steps and return here.</li>
          </ol>
        </div>
        <button onClick={handleLogin} className="login-button">
          🚪 Login with Internet Identity
        </button>
      </div>
    </div>
  );
};

export default Login;
